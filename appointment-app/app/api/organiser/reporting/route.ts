import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/reporting - Get appointments for reporting with optional date filter
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const date = searchParams.get("date"); // Optional: specific date filter

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this organization" },
        { status: 403 }
      );
    }

    // Build date filter for today or specified date
    let startOfDay: Date;
    let endOfDay: Date;
    
    if (date) {
      // Use specified date
      const targetDate = new Date(date);
      startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    } else {
      // Default to today
      const today = new Date();
      startOfDay = new Date(today.setHours(0, 0, 0, 0));
      endOfDay = new Date(today.setHours(23, 59, 59, 999));
    }

    // Fetch appointments for the organization's services
    const appointments = await db.booking.findMany({
      where: {
        service: {
          organizationId,
        },
        slot: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            durationMinutes: true,
          },
        },
        slot: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
            capacity: true,
            resource: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        answers: {
          include: {
            question: {
              select: {
                id: true,
                label: true,
              },
            },
          },
        },
      },
      orderBy: {
        slot: {
          startTime: "asc",
        },
      },
    });

    // Transform the data to match the frontend format
    const formattedAppointments = appointments.map((booking) => {
      // Format answers as key-value pairs
      const answersMap: Record<string, string> = {};
      booking.answers.forEach((answer) => {
        answersMap[answer.question.label] = answer.value;
      });

      // Extract phone from answers if available
      const phoneAnswer = booking.answers.find(
        (a) => a.question.label.toLowerCase().includes("phone")
      );

      return {
        id: booking.id,
        customerName: booking.user.name,
        customerEmail: booking.user.email,
        customerPhone: phoneAnswer?.value || "N/A",
        serviceName: booking.service.title,
        resourceName: booking.slot.resource?.name || "N/A",
        slotDate: new Date(booking.slot.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        slotTime: new Date(booking.slot.startTime).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        status: booking.status.toLowerCase() as "confirmed" | "pending" | "cancelled",
        answers: answersMap,
        capacity: booking.slot.capacity,
      };
    });

    // Calculate stats
    const stats = {
      total: formattedAppointments.length,
      confirmed: formattedAppointments.filter((a) => a.status === "confirmed").length,
      pending: formattedAppointments.filter((a) => a.status === "pending").length,
      cancelled: formattedAppointments.filter((a) => a.status === "cancelled").length,
    };

    return NextResponse.json({
      appointments: formattedAppointments,
      stats,
    });
  } catch (error) {
    console.error("Error fetching reporting data:", error);
    return NextResponse.json(
      { error: "Failed to fetch reporting data" },
      { status: 500 }
    );
  }
}
