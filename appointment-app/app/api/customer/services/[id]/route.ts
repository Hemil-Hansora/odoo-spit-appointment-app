import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch service with all related data
    const service = await db.service.findUnique({
      where: {
        id,
        isPublished: true, // Only show published services to customers
      },
      include: {
        questions: {
          select: {
            id: true,
            label: true,
            required: true,
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
        resources: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!service) {
      return NextResponse.json(
        { error: "Service not found or not published" },
        { status: 404 }
      )
    }

    // Parse metadata
    let parsedMetadata = {}
    try {
      parsedMetadata = service.metadata ? JSON.parse(service.metadata) : {}
    } catch (e) {
      console.error("Failed to parse metadata for service:", service.id)
    }

    // Format response
    const response = {
      id: service.id,
      title: service.title,
      description: service.description,
      durationMinutes: service.durationMinutes,
      maxCapacity: service.maxCapacity,
      manualConfirm: service.manualConfirm,
      advancePayment: service.advancePayment,
      price: parsedMetadata.price || 0,
      location: parsedMetadata.location || "",
      image: parsedMetadata.image || "",
      questions: service.questions.map((q) => ({
        id: q.id,
        label: q.label,
        required: q.required,
        type: q.label.toLowerCase().includes("email")
          ? "email"
          : q.label.toLowerCase().includes("phone")
          ? "tel"
          : q.label.toLowerCase().includes("symptom") ||
            q.label.toLowerCase().includes("message") ||
            q.label.toLowerCase().includes("note")
          ? "textarea"
          : "text",
      })),
      schedules: service.schedules,
      resources: service.resources,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching service details:", error)
    return NextResponse.json(
      { error: "Failed to fetch service details" },
      { status: 500 }
    )
  }
}
