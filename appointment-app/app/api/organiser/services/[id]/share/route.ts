import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { nanoid } from "nanoid";

// POST /api/organiser/services/[id]/share - Generate or retrieve share token
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Get the service
    const service = await db.service.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
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

    // Check if user is a member of the organization
    if (service.organization.members.length === 0) {
      return NextResponse.json(
        { error: "You do not have permission to share this service" },
        { status: 403 }
      );
    }

    // If service already has a share token, return it
    if (service.shareToken) {
      const shareUrl = `${request.nextUrl.origin}/book/${service.shareToken}`;
      return NextResponse.json({
        shareToken: service.shareToken,
        shareUrl,
      });
    }

    // Generate a new share token
    const shareToken = nanoid(16);

    // Update the service with the share token
    await db.service.update({
      where: { id },
      data: { shareToken },
    });

    const shareUrl = `${request.nextUrl.origin}/book/${shareToken}`;

    return NextResponse.json({
      shareToken,
      shareUrl,
    });
  } catch (error) {
    console.error("Error generating share token:", error);
    return NextResponse.json(
      { error: "Failed to generate share token" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/services/[id]/share - Delete share token
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Get the service
    const service = await db.service.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
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

    // Check if user is a member of the organization
    if (service.organization.members.length === 0) {
      return NextResponse.json(
        { error: "You do not have permission to modify this service" },
        { status: 403 }
      );
    }

    // Remove the share token
    await db.service.update({
      where: { id },
      data: { shareToken: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting share token:", error);
    return NextResponse.json(
      { error: "Failed to delete share token" },
      { status: 500 }
    );
  }
}
