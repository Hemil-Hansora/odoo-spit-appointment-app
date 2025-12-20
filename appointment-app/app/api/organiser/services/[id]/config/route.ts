import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// PATCH /api/organiser/services/[id]/config - Update service configuration with extended fields
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

    const body = await req.json();
    const {
      title,
      description,
      durationMinutes,
      location,
      bookType, // "User" or "Resources"
      assignmentType, // "Automatically" or "By visitor"
      maxSimultaneousAppointments,
      isPublished,
      maxCapacity,
      manualConfirm,
      advancePayment,
      cancellationPolicy,
      timeSlotDuration,
      introMessage,
      confirmationMessage,
      image,
      price,
      capacity,
      bufferMinutes,
      dateSlots,
      resourceIds, // Array of resource IDs to connect
    } = body;

    const existingService = await db.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const member = await db.member.findFirst({
      where: {
        organizationId: existingService.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this service" },
        { status: 403 }
      );
    }

    // Build metadata object for extended fields
    const metadata: any = {};
    let parsedMetadata = {};

    if (existingService.metadata) {
      try {
        parsedMetadata =
          typeof existingService.metadata === "string"
            ? JSON.parse(existingService.metadata)
            : existingService.metadata;
      } catch (e) {
        parsedMetadata = {};
      }
    }

    if (location !== undefined) metadata.location = location;
    if (bookType !== undefined) metadata.bookType = bookType;
    if (assignmentType !== undefined)
      metadata.assignmentType = assignmentType;
    if (maxSimultaneousAppointments !== undefined)
      metadata.maxSimultaneousAppointments = maxSimultaneousAppointments;
    if (cancellationPolicy !== undefined)
      metadata.cancellationPolicy = cancellationPolicy;
    if (timeSlotDuration !== undefined)
      metadata.timeSlotDuration = timeSlotDuration;
    if (introMessage !== undefined) metadata.introMessage = introMessage;
    if (confirmationMessage !== undefined)
      metadata.confirmationMessage = confirmationMessage;
    if (image !== undefined) metadata.image = image;
    if (price !== undefined) metadata.price = price;
    if (capacity !== undefined) metadata.capacity = capacity;
    if (bufferMinutes !== undefined) metadata.bufferMinutes = bufferMinutes;
    if (dateSlots !== undefined) metadata.dateSlots = dateSlots;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (durationMinutes !== undefined) {
      if (durationMinutes <= 0) {
        return NextResponse.json(
          { error: "Duration must be greater than 0" },
          { status: 400 }
        );
      }
      updateData.durationMinutes = durationMinutes;
    }
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
    if (manualConfirm !== undefined) updateData.manualConfirm = manualConfirm;
    if (advancePayment !== undefined)
      updateData.advancePayment = advancePayment;

    if (Object.keys(metadata).length > 0) {
      updateData.metadata = JSON.stringify({ ...parsedMetadata, ...metadata });
    }

    // Handle resource connections
    if (resourceIds !== undefined && Array.isArray(resourceIds)) {
      updateData.resources = {
        set: resourceIds.map((id: string) => ({ id })),
      };
    }

    const service = await db.service.update({
      where: { id },
      data: updateData,
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        resources: true,
        schedules: true,
        questions: true,
      },
    });

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error("Error updating service configuration:", error);
    return NextResponse.json(
      { error: "Failed to update service configuration" },
      { status: 500 }
    );
  }
}

// GET /api/organiser/services/[id]/config - Get full service configuration
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = await db.service.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true, slug: true } },
        resources: true,
        schedules: { orderBy: { dayOfWeek: "asc" } },
        questions: true,
        _count: { select: { bookings: true, slots: true } },
      },
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

    let metadata = {};
    if (service.metadata) {
      try {
        metadata =
          typeof service.metadata === "string"
            ? JSON.parse(service.metadata)
            : service.metadata;
      } catch (e) {
        metadata = {};
      }
    }

    return NextResponse.json(
      { service: { ...service, metadata } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching service configuration:", error);
    return NextResponse.json(
      { error: "Failed to fetch service configuration" },
      { status: 500 }
    );
  }
}
