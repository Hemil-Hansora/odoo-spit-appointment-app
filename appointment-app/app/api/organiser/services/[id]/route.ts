import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/services/[id] - Get service by ID
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

    const service = await db.service.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        resources: true,
        schedules: {
          orderBy: {
            dayOfWeek: "asc",
          },
        },
        questions: true,
        _count: {
          select: {
            bookings: true,
            slots: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
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

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/services/[id] - Update service
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
    const {
      title,
      description,
      durationMinutes,
      isPublished,
      maxCapacity,
      manualConfirm,
      advancePayment,
      resourceIds,
    } = body;

    // Check if service exists
    const existingService = await db.service.findUnique({
      where: { id: params.id },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
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

    // Build update data
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

    // Handle resources update
    if (resourceIds !== undefined) {
      updateData.resources = {
        set: resourceIds.map((id: string) => ({ id })),
      };
    }

    const service = await db.service.update({
      where: { id: params.id },
      data: updateData,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        resources: true,
        schedules: true,
        questions: true,
      },
    });

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/services/[id] - Delete service
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

    // Check if service exists
    const existingService = await db.service.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
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

    // Check if there are active bookings
    if (existingService._count.bookings > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete service with existing bookings. Please cancel or complete all bookings first.",
        },
        { status: 400 }
      );
    }

    await db.service.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
