import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";
import { BookingStatus } from "@/generated/prisma/enums";


// GET /api/organiser/bookings - List bookings for organization's services
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
    const serviceId = searchParams.get("serviceId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

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

    // Build query filters
    const where: any = {
      service: {
        organizationId,
      },
    };

    if (serviceId) {
      where.serviceId = serviceId;
    }

    if (status && Object.values(BookingStatus).includes(status as any)) {
      where.status = status as BookingStatus;
    }

    if (startDate || endDate) {
      where.slot = {};
      if (startDate) {
        where.slot.date = { gte: new Date(startDate) };
      }
      if (endDate) {
        where.slot.date = { ...where.slot.date, lte: new Date(endDate) };
      }
    }

    const bookings = await db.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
            bookedCount: true,
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
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
