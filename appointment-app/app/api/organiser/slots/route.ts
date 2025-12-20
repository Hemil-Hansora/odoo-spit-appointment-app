import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/slots - List slots with filters
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const resourceId = searchParams.get("resourceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    // Verify service exists and user has access
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const member = await db.member.findFirst({
      where: {
        organizationId: service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this service" },
        { status: 403 }
      );
    }

    // Build query filters
    const where: any = { serviceId };
    if (resourceId) {
      where.resourceId = resourceId;
    }
    if (startDate) {
      where.date = { gte: new Date(startDate) };
    }
    if (endDate) {
      where.date = { ...where.date, lte: new Date(endDate) };
    }

    const slots = await db.slot.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            durationMinutes: true,
          },
        },
        resource: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error) {
    console.error("Error fetching slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch slots" },
      { status: 500 }
    );
  }
}

// POST /api/organiser/slots - Create slots (can create multiple)
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { serviceId, resourceId, date, slots: slotTimes, capacity } = body;

    // Validation
    if (!serviceId || !date) {
      return NextResponse.json(
        { error: "Service ID and date are required" },
        { status: 400 }
      );
    }

    if (!slotTimes || !Array.isArray(slotTimes) || slotTimes.length === 0) {
      return NextResponse.json(
        {
          error:
            "Slots array is required with at least one slot (startTime, endTime)",
        },
        { status: 400 }
      );
    }

    // Verify service exists and user has access
    const service = await db.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const member = await db.member.findFirst({
      where: {
        organizationId: service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this service" },
        { status: 403 }
      );
    }

    // Verify resource if provided
    if (resourceId) {
      const resource = await db.resource.findUnique({
        where: { id: resourceId },
      });

      if (!resource || resource.organizationId !== service.organizationId) {
        return NextResponse.json(
          { error: "Resource not found or doesn't belong to organization" },
          { status: 404 }
        );
      }
    }

    const slotDate = new Date(date);
    const slotCapacity = capacity || service.maxCapacity || 1;

    // Create slots
    const createdSlots = [];
    for (const slotTime of slotTimes) {
      const { startTime, endTime } = slotTime;

      if (!startTime || !endTime) {
        continue; // Skip invalid slots
      }

      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);

      // Check for overlapping slots
      const existingSlot = await db.slot.findFirst({
        where: {
          serviceId,
          resourceId: resourceId || null,
          OR: [
            {
              AND: [
                { startTime: { lte: startDateTime } },
                { endTime: { gt: startDateTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endDateTime } },
                { endTime: { gte: endDateTime } },
              ],
            },
          ],
        },
      });

      if (existingSlot) {
        return NextResponse.json(
          {
            error: `Slot overlaps with existing slot from ${existingSlot.startTime} to ${existingSlot.endTime}`,
          },
          { status: 400 }
        );
      }

      const slot = await db.slot.create({
        data: {
          serviceId,
          resourceId,
          date: slotDate,
          startTime: startDateTime,
          endTime: endDateTime,
          capacity: slotCapacity,
          bookedCount: 0,
        },
        include: {
          service: {
            select: {
              id: true,
              title: true,
            },
          },
          resource: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      createdSlots.push(slot);
    }

    return NextResponse.json({ slots: createdSlots }, { status: 201 });
  } catch (error) {
    console.error("Error creating slots:", error);
    return NextResponse.json(
      { error: "Failed to create slots" },
      { status: 500 }
    );
  }
}
