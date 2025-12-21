import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { nanoid } from "nanoid"
import { auth } from "@/lib/auth"
import { getSession } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user's bookings with all related data
    const bookings = await db.booking.findMany({
      where: {
        userId,
      },
      include: {
        service: {
          include: {
            organization: true,
          },
        },
        slot: {
          include: {
            resource: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform bookings to frontend format
    const formattedBookings = bookings.map((booking) => {
      const slot = booking.slot;
      const service = booking.service;
      const resource = booking.slot.resource;
      const organization = booking.service.organization;

      // Format date and time
      const slotDate = new Date(slot.startTime);
      const formattedDate = slotDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = slotDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Calculate duration in minutes
      const duration = Math.round(
        (new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / 60000
      );

      // Get answers as key-value pairs
      const answersObj: Record<string, string> = {};
      booking.answers.forEach((answer) => {
        answersObj[answer.question.label] = answer.value;
      });

      return {
        id: booking.id,
        serviceName: service.title,
        serviceDescription: service.description,
        resourceName: resource?.name || "Not assigned",
        slotDate: formattedDate,
        slotTime: formattedTime,
        duration,
        status: booking.status.toLowerCase() as "confirmed" | "pending" | "cancelled",
        venue: {
          name: organization.name,
          address: "Address not available",
          city: "City not available",
        },
        capacity: service.maxCapacity || 1,
        confirmationMessage: service.metadata
          ? JSON.parse(service.metadata).confirmationMessage
          : undefined,
        notes: booking.notes,
        answers: answersObj,
        createdAt: booking.createdAt,
      };
    });

    return NextResponse.json({
      bookings: formattedBookings,
      total: formattedBookings.length,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      serviceId,
      slotId,
      startTime,
      endTime,
      resourceId,
      answers,
      capacity = 1,
      guestEmail,
      guestName,
    } = body

    if (!serviceId || (!slotId && (!startTime || !endTime))) {
      return NextResponse.json(
        { error: "serviceId and slot information are required" },
        { status: 400 }
      )
    }

    // Get session to check if user is authenticated
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    let userId = session?.user?.id

    // If user is not authenticated, create a guest user
    if (!userId) {
      if (!guestEmail) {
        return NextResponse.json(
          { error: "guestEmail is required for guest bookings" },
          { status: 400 }
        )
      }

      // Check if guest user already exists
      let guestUser = await db.user.findUnique({
        where: { email: guestEmail },
      })

      if (!guestUser) {
        // Create new guest user
        guestUser = await db.user.create({
          data: {
            id: nanoid(),
            email: guestEmail,
            name: guestName || guestEmail.split("@")[0],
            emailVerified: false,
          },
        })
      }

      userId = guestUser.id
    }

    // Fetch service details
    const service = await db.service.findUnique({
      where: { id: serviceId, isPublished: true },
      include: {
        questions: true,
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service not found or not published" },
        { status: 404 }
      )
    }

    // Validate required questions are answered
    const requiredQuestions = service.questions.filter((q) => q.required)
    const answeredQuestionIds = answers?.map((a: any) => a.questionId) || []

    for (const question of requiredQuestions) {
      if (!answeredQuestionIds.includes(question.id)) {
        return NextResponse.json(
          { error: `Required question "${question.label}" is not answered` },
          { status: 400 }
        )
      }
    }

    // Find or create slot
    let slot
    if (slotId && !slotId.startsWith("new-")) {
      // Existing slot
      slot = await db.slot.findUnique({
        where: { id: slotId },
        include: {
          bookings: {
            where: {
              status: {
                in: ["PENDING", "CONFIRMED"],
              },
            },
          },
        },
      })

      if (!slot) {
        return NextResponse.json(
          { error: "Slot not found" },
          { status: 404 }
        )
      }

      // Check if slot is already booked (exclusive booking - one user per slot)
      if (slot.bookings && slot.bookings.length > 0) {
        return NextResponse.json(
          { error: "This time slot is already booked by another user" },
          { status: 400 }
        )
      }

      // Double-check slot availability using bookedCount
      if (slot.bookedCount >= slot.capacity) {
        return NextResponse.json(
          { error: "Slot is fully booked" },
          { status: 400 }
        )
      }
    } else {
      // Create new slot with capacity of 1 for exclusive booking
      const slotData: any = {
        id: nanoid(),
        serviceId,
        date: new Date(startTime),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: 1, // Set to 1 for exclusive booking (one user per slot)
        bookedCount: 0,
      }

      if (resourceId) {
        slotData.resourceId = resourceId
      }

      slot = await db.slot.create({
        data: slotData,
      })
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        id: nanoid(),
        userId,
        serviceId,
        slotId: slot.id,
        status: service.manualConfirm ? "PENDING" : "CONFIRMED",
        notes: `Capacity: ${capacity}`,
      },
    })

    // Save answers
    if (answers && answers.length > 0) {
      await Promise.all(
        answers.map((answer: any) =>
          db.answer.create({
            data: {
              id: nanoid(),
              questionId: answer.questionId,
              value: answer.value,
              bookingId: booking.id,
            },
          })
        )
      )
    }

    // Update slot booked count (increment by 1 for exclusive booking)
    await db.slot.update({
      where: { id: slot.id },
      data: {
        bookedCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      message: service.manualConfirm
        ? "Booking created. Awaiting organiser confirmation."
        : "Booking confirmed successfully!",
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
