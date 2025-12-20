import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"
import { nanoid } from "nanoid"
import { auth } from "@/lib/auth"

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
      })

      if (!slot) {
        return NextResponse.json(
          { error: "Slot not found" },
          { status: 404 }
        )
      }

      // Check slot availability
      if (slot.bookedCount >= slot.capacity) {
        return NextResponse.json(
          { error: "Slot is fully booked" },
          { status: 400 }
        )
      }
    } else {
      // Create new slot
      const slotData: any = {
        id: nanoid(),
        serviceId,
        date: new Date(startTime),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: service.maxCapacity || 1,
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

    // Update slot booked count
    await db.slot.update({
      where: { id: slot.id },
      data: {
        bookedCount: {
          increment: capacity,
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
