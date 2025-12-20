import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/resources/[id] - Get resource by ID
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

    const resource = await db.resource.findUnique({
      where: { id: params.id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        services: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            services: true,
            slots: true,
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: resource.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this resource" },
        { status: 403 }
      );
    }

    return NextResponse.json({ resource }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/resources/[id] - Update resource
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
    const { name, isActive } = body;

    // Check if resource exists
    const existingResource = await db.resource.findUnique({
      where: { id: params.id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingResource.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this resource" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    const resource = await db.resource.update({
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
      },
    });

    return NextResponse.json({ resource }, { status: 200 });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/resources/[id] - Delete resource
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

    // Check if resource exists
    const existingResource = await db.resource.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            services: true,
            slots: true,
          },
        },
      },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingResource.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this resource" },
        { status: 403 }
      );
    }

    // Check if resource is being used
    if (
      existingResource._count.services > 0 ||
      existingResource._count.slots > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot delete resource that is assigned to services or slots. Please remove it from services first.",
        },
        { status: 400 }
      );
    }

    await db.resource.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Resource deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
