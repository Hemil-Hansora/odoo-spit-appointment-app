import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch booking with slot info
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        slot: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Booking is already cancelled" },
        { status: 400 }
      )
    }

    // Extract capacity from notes
    let capacity = 1
    if (booking.notes) {
      const match = booking.notes.match(/Capacity: (\d+)/)
      if (match) {
        capacity = parseInt(match[1], 10)
      }
    }

    // Update booking status to CANCELLED
    await db.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    })

    // Decrease slot booked count
    await db.slot.update({
      where: { id: booking.slotId },
      data: {
        bookedCount: {
          decrement: capacity,
        },
      },
    })

    return NextResponse.json({
      message: "Booking cancelled successfully",
      bookingId: id,
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    )
  }
}
