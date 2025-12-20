import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/services - List all services for the organization
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const isPublished = searchParams.get("isPublished");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Build query filters
    const where: any = { organizationId };
    if (isPublished !== null && isPublished !== undefined) {
      where.isPublished = isPublished === "true";
    }

    const services = await db.service.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        resources: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
        schedules: true,
        questions: true,
        _count: {
          select: {
            bookings: true,
            slots: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/organiser/services - Create a new service
export async function POST(req: NextRequest) {
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
      organizationId,
      isPublished = false,
      maxCapacity,
      manualConfirm = false,
      advancePayment = false,
      metadata,
      resourceIds = [],
      schedules = [],
      questions = [],
    } = body;

    // Validation
    if (!title || !durationMinutes || !organizationId) {
      return NextResponse.json(
        { error: "Title, duration, and organization ID are required" },
        { status: 400 }
      );
    }

    if (durationMinutes <= 0) {
      return NextResponse.json(
        { error: "Duration must be greater than 0" },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this organization" },
        { status: 403 }
      );
    }

    // Create service with related data
    const service = await db.service.create({
      data: {
        title,
        description,
        durationMinutes,
        organizationId,
        isPublished,
        maxCapacity,
        manualConfirm,
        advancePayment,
        metadata: metadata ? JSON.stringify(metadata) : null,
        resources: resourceIds.length
          ? {
              connect: resourceIds.map((id: string) => ({ id })),
            }
          : undefined,
        schedules: schedules.length
          ? {
              create: schedules.map((schedule: any) => ({
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
              })),
            }
          : undefined,
        questions: questions.length
          ? {
              create: questions.map((question: any) => ({
                label: question.label,
                required: question.required || false,
              })),
            }
          : undefined,
      },
      include: {
        resources: true,
        schedules: true,
        questions: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
