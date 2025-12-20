import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const serviceId = searchParams.get("serviceId")
    const dateStr = searchParams.get("date")
    const resourceId = searchParams.get("resourceId")

    if (!serviceId || !dateStr) {
      return NextResponse.json(
        { error: "serviceId and date are required" },
        { status: 400 }
      )
    }

    // Parse the date
    const requestedDate = new Date(dateStr)
    const dayOfWeek = requestedDate.getDay() // 0 = Sunday, 6 = Saturday

    // Fetch service with schedules
    const service = await db.service.findUnique({
      where: {
        id: serviceId,
        isPublished: true,
      },
      include: {
        schedules: {
          where: {
            dayOfWeek,
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      )
    }

    if (service.schedules.length === 0) {
      return NextResponse.json({
        slots: [],
        message: "No schedules available for this day",
      })
    }

    // Fetch existing slots for this date, service, and optionally resource
    const whereSlot: any = {
      serviceId,
      date: {
        gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        lt: new Date(requestedDate.setHours(23, 59, 59, 999)),
      },
    }

    if (resourceId) {
      whereSlot.resourceId = resourceId
    }

    const existingSlots = await db.slot.findMany({
      where: whereSlot,
    })

    // Generate available slots based on schedules
    const availableSlots = []

    for (const schedule of service.schedules) {
      const [startHour, startMinute] = schedule.startTime.split(":").map(Number)
      const [endHour, endMinute] = schedule.endTime.split(":").map(Number)

      let currentTime = new Date(requestedDate)
      currentTime.setHours(startHour, startMinute, 0, 0)

      const endTime = new Date(requestedDate)
      endTime.setHours(endHour, endMinute, 0, 0)

      // Generate slots with service duration intervals
      while (currentTime < endTime) {
        const slotEndTime = new Date(
          currentTime.getTime() + service.durationMinutes * 60000
        )

        if (slotEndTime > endTime) break

        // Check if slot exists in database
        const existingSlot = existingSlots.find(
          (slot) =>
            slot.startTime.getTime() === currentTime.getTime() &&
            slot.endTime.getTime() === slotEndTime.getTime()
        )

        const capacity = service.maxCapacity || 1
        const bookedCount = existingSlot?.bookedCount || 0
        const available = bookedCount < capacity

        availableSlots.push({
          id: existingSlot?.id || `new-${currentTime.getTime()}`,
          time: currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          startTime: currentTime.toISOString(),
          endTime: slotEndTime.toISOString(),
          available,
          capacity,
          bookedCount,
        })

        // Move to next slot
        currentTime = new Date(currentTime.getTime() + service.durationMinutes * 60000)
      }
    }

    return NextResponse.json({ slots: availableSlots })
  } catch (error) {
    console.error("Error fetching slots:", error)
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    )
  }
}
