import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// PATCH /api/organiser/bookings/[id]/cancel - Cancel a booking
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the booking with service details
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        slot: true,
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

    // Update booking status to CANCELLED
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    });

    // Decrease slot booked count
    if (booking.slot) {
      await db.slot.update({
        where: { id: booking.slot.id },
        data: {
          bookedCount: {
            decrement: 1,
          },
        },
      });
    }

    return NextResponse.json(
      { booking: updatedBooking, message: "Booking cancelled successfully" },
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
