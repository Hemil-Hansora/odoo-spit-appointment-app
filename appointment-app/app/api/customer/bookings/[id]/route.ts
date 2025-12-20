import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        service: true,
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Parse service metadata
    let parsedMetadata = {}
    try {
      parsedMetadata = booking.service.metadata
        ? JSON.parse(booking.service.metadata)
        : {}
    } catch (e) {
      console.error("Failed to parse metadata for service:", booking.service.id)
    }

    // Extract capacity from notes (stored as "Capacity: X")
    let capacity = 1
    if (booking.notes) {
      const match = booking.notes.match(/Capacity: (\d+)/)
      if (match) {
        capacity = parseInt(match[1], 10)
      }
    }

    // Format response
    const response = {
      id: booking.id,
      status: booking.status,
      createdAt: booking.createdAt,
      capacity,
      user: {
        id: booking.user.id,
        name: booking.user.name,
        email: booking.user.email,
      },
      service: {
        id: booking.service.id,
        title: booking.service.title,
        description: booking.service.description,
        durationMinutes: booking.service.durationMinutes,
        manualConfirm: booking.service.manualConfirm,
        price: parsedMetadata.price || 0,
        location: parsedMetadata.location || "",
        image: parsedMetadata.image || "",
      },
      slot: {
        id: booking.slot.id,
        date: booking.slot.date,
        startTime: booking.slot.startTime,
        endTime: booking.slot.endTime,
      },
      answers: booking.answers.map((answer) => ({
        id: answer.id,
        question: answer.question.label,
        value: answer.value,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching booking details:", error)
    return NextResponse.json(
      { error: "Failed to fetch booking details" },
      { status: 500 }
    )
  }
}
