import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

// POST /api/organiser/questions/batch - Create or update multiple questions at once
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { serviceId, questions } = body;

    if (!serviceId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Service ID and questions array are required" },
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

    // Get existing questions with answers count
    const existingQuestions = await db.question.findMany({
      where: { serviceId },
      include: {
        _count: {
          select: { answers: true },
        },
      },
    });

    // Delete only questions without answers to preserve data integrity
    const questionsToDelete = existingQuestions.filter(
      (q) => q._count.answers === 0
    );
    if (questionsToDelete.length > 0) {
      await db.question.deleteMany({
        where: {
          id: { in: questionsToDelete.map((q) => q.id) },
        },
      });
    }

    // Create new questions
    const createdQuestions = [];
    for (const question of questions) {
      const { label, required, answerType } = question;

      if (!label || !label.trim()) {
        continue; // Skip empty questions
      }

      // Note: answerType is stored in the frontend but not in the current schema
      // You could extend the Question model to include answerType field if needed
      const created = await db.question.create({
        data: {
          serviceId,
          label: label.trim(),
          required: required || false,
        },
      });

      createdQuestions.push(created);
    }

    return NextResponse.json(
      { 
        questions: createdQuestions,
        preservedQuestions: existingQuestions.filter(q => q._count.answers > 0).length
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error batch updating questions:", error);
    return NextResponse.json(
      { error: "Failed to batch update questions" },
      { status: 500 }
    );
  }
}
