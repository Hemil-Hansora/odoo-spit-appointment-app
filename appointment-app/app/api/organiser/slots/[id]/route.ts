import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/slots/[id] - Get slot by ID
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

    const slot = await db.slot.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            durationMinutes: true,
            organizationId: true,
          },
        },
        resource: {
          select: {
            id: true,
            name: true,
          },
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: slot.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this slot" },
        { status: 403 }
      );
    }

    return NextResponse.json({ slot }, { status: 200 });
  } catch (error) {
    console.error("Error fetching slot:", error);
    return NextResponse.json(
      { error: "Failed to fetch slot" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/slots/[id] - Update slot
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
    const { capacity, startTime, endTime } = body;

    // Check if slot exists
    const existingSlot = await db.slot.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!existingSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingSlot.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this slot" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (capacity !== undefined) {
      if (capacity < existingSlot.bookedCount) {
        return NextResponse.json(
          {
            error: `Cannot reduce capacity below current bookings (${existingSlot.bookedCount})`,
          },
          { status: 400 }
        );
      }
      updateData.capacity = capacity;
    }

    if (startTime !== undefined) {
      updateData.startTime = new Date(startTime);
    }

    if (endTime !== undefined) {
      updateData.endTime = new Date(endTime);
    }

    const slot = await db.slot.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ slot }, { status: 200 });
  } catch (error) {
    console.error("Error updating slot:", error);
    return NextResponse.json(
      { error: "Failed to update slot" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/slots/[id] - Delete slot
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

    // Check if slot exists
    const existingSlot = await db.slot.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    if (!existingSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingSlot.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this slot" },
        { status: 403 }
      );
    }

    // Check if there are active bookings
    if (existingSlot._count.bookings > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete slot with existing bookings. Please cancel all bookings first.",
        },
        { status: 400 }
      );
    }

    await db.slot.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Slot deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting slot:", error);
    return NextResponse.json(
      { error: "Failed to delete slot" },
      { status: 500 }
    );
  }
}
