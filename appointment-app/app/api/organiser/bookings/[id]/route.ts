import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";
import { BookingStatus } from "@/generated/prisma/enums";

// GET /api/organiser/bookings/[id] - Get booking by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const booking = await db.booking.findUnique({
      where: { id: params.id },
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
            description: true,
            durationMinutes: true,
            organizationId: true,
            manualConfirm: true,
          },
        },
        slot: {
          include: {
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
                required: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: booking.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this booking" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/bookings/[id] - Update booking status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, notes } = body;

    // Validation
    if (status && !Object.values(BookingStatus).includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${Object.values(
            BookingStatus
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        slot: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingBooking.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this booking" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // Handle slot capacity when status changes
    if (
      status &&
      status !== existingBooking.status &&
      existingBooking.slot
    ) {
      const slot = existingBooking.slot;

      // If confirming a pending booking, increment booked count
      if (
        existingBooking.status === BookingStatus.PENDING &&
        status === BookingStatus.CONFIRMED
      ) {
        // Already counted in booked count from creation
        // No change needed
      }

      // If cancelling a confirmed booking, decrement booked count
      if (
        existingBooking.status === BookingStatus.CONFIRMED &&
        status === BookingStatus.CANCELLED
      ) {
        await db.slot.update({
          where: { id: slot.id },
          data: {
            bookedCount: Math.max(0, slot.bookedCount - 1),
          },
        });
      }

      // If cancelling a pending booking, decrement booked count
      if (
        existingBooking.status === BookingStatus.PENDING &&
        status === BookingStatus.CANCELLED
      ) {
        await db.slot.update({
          where: { id: slot.id },
          data: {
            bookedCount: Math.max(0, slot.bookedCount - 1),
          },
        });
      }
    }

    const booking = await db.booking.update({
      where: { id: params.id },
      data: updateData,
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
          },
        },
        slot: {
          select: {
            id: true,
            date: true,
            startTime: true,
            endTime: true,
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
    });

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/bookings/[id] - Cancel booking (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        slot: true,
      },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingBooking.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this booking" },
        { status: 403 }
      );
    }

    // Update status to CANCELLED instead of hard delete
    await db.booking.update({
      where: { id: params.id },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });

    // Decrement slot booked count
    if (existingBooking.slot) {
      await db.slot.update({
        where: { id: existingBooking.slot.id },
        data: {
          bookedCount: Math.max(0, existingBooking.slot.bookedCount - 1),
        },
      });
    }

    return NextResponse.json(
      { message: "Booking cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
