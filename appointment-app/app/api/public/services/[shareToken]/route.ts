import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/public/services/[shareToken] - Get service by share token
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await context.params;

    // Find service by share token
    const service = await db.service.findUnique({
      where: { shareToken },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        resources: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
          },
        },
        schedules: {
          select: {
            id: true,
            dayOfWeek: true,
            startTime: true,
            endTime: true,
          },
        },
        questions: {
          select: {
            id: true,
            label: true,
            required: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found or link is invalid" },
        { status: 404 }
      );
    }

    // Parse metadata if it exists
    let metadata = null;
    if (service.metadata) {
      try {
        metadata = JSON.parse(service.metadata);
      } catch (e) {
        console.error("Failed to parse metadata:", e);
      }
    }

    return NextResponse.json({
      service: {
        ...service,
        metadata,
      },
    });
  } catch (error) {
    console.error("Error fetching service by share token:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
