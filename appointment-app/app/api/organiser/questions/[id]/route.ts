import { NextRequest, NextResponse } from "next/server";
import  db  from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/organiser/questions/[id] - Get question by ID
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

    const question = await db.question.findUnique({
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

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: question.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this question" },
        { status: 403 }
      );
    }

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// PATCH /api/organiser/questions/[id] - Update question
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
    const { label, required } = body;

    // Check if question exists
    const existingQuestion = await db.question.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingQuestion.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this question" },
        { status: 403 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (required !== undefined) updateData.required = required;

    const question = await db.question.update({
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

    return NextResponse.json({ question }, { status: 200 });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/questions/[id] - Delete question
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

    // Check if question exists
    const existingQuestion = await db.question.findUnique({
      where: { id: params.id },
      include: {
        service: {
          select: {
            organizationId: true,
          },
        },
        _count: {
          select: {
            answers: true,
          },
        },
      },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this organization
    const member = await db.member.findFirst({
      where: {
        organizationId: existingQuestion.service.organizationId,
        userId: session.user.id,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: "You don't have access to this question" },
        { status: 403 }
      );
    }

    // Check if there are answers to this question
    if (existingQuestion._count.answers > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete question with existing answers. This question has been answered in bookings.",
        },
        { status: 400 }
      );
    }

    await db.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
