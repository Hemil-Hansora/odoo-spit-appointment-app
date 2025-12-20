import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/schedules/[id] - Get schedule by ID
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

    const schedule = await db.schedule.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            organizationId: true,
          },
        },
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: schedule.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this schedule" },
        { status: 403 }
      );
    }

    return NextResponse.json({ schedule }, { status: 200 });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/schedules/[id] - Update schedule
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
    const { dayOfWeek, startTime, endTime } = body;

    // Check if schedule exists
    const existingSchedule = await db.schedule.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            id: true,
            organizationId: true,
          },
        },
      },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingSchedule.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this schedule" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (dayOfWeek !== undefined) {
      if (dayOfWeek < 0 || dayOfWeek > 6) {
        return NextResponse.json(
          {
            error: "Day of week must be between 0 (Sunday) and 6 (Saturday)",
          },
          { status: 400 }
        );
      }
      updateData.dayOfWeek = dayOfWeek;
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (startTime !== undefined) {
      if (!timeRegex.test(startTime)) {
        return NextResponse.json(
          { error: "Start time must be in HH:MM format" },
          { status: 400 }
        );
      }
      updateData.startTime = startTime;
    }

    if (endTime !== undefined) {
      if (!timeRegex.test(endTime)) {
        return NextResponse.json(
          { error: "End time must be in HH:MM format" },
          { status: 400 }
        );
      }
      updateData.endTime = endTime;
    }

    const schedule = await db.schedule.update({
      where: { id: params.id },
      data: updateData,
      include: {
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ schedule }, { status: 200 });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Failed to update schedule" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/schedules/[id] - Delete schedule
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

    // Check if schedule exists
    const existingSchedule = await db.schedule.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!existingSchedule) {
      return NextResponse.json(
        { error: "Schedule not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingSchedule.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this schedule" },
        { status: 403 }
      );
    }

    await db.schedule.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Schedule deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json(
      { error: "Failed to delete schedule" },
      { status: 500 }
    );
  }
}
