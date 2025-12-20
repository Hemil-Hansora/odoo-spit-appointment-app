import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// POST /api/organiser/schedules/batch - Create or update multiple schedules at once
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { serviceId, schedules } = body;

    if (!serviceId || !schedules || !Array.isArray(schedules)) {
      return NextResponse.json(
        { error: "Service ID and schedules array are required" },
        { status: 400 }
      );
    }

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

    // Delete existing schedules for this service
    await db.schedule.deleteMany({
      where: { serviceId },
    });

    // Validate and create new schedules
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const createdSchedules = [];

    for (const schedule of schedules) {
      const { dayOfWeek, startTime, endTime } = schedule;

      // Skip invalid schedules
      if (
        dayOfWeek === undefined ||
        !startTime ||
        !endTime ||
        dayOfWeek < 0 ||
        dayOfWeek > 6
      ) {
        continue;
      }

      // Validate time format
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        continue;
      }

      // Validate that end time is after start time
      if (startTime >= endTime) {
        continue;
      }

      const created = await db.schedule.create({
        data: {
          serviceId,
          dayOfWeek,
          startTime,
          endTime,
        },
      });

      createdSchedules.push(created);
    }

    return NextResponse.json(
      { schedules: createdSchedules },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error batch updating schedules:", error);
    return NextResponse.json(
      { error: "Failed to batch update schedules" },
      { status: 500 }
    );
  }
}
