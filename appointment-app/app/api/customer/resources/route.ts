import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const serviceId = searchParams.get("serviceId")

    if (!serviceId) {
      return NextResponse.json(
        { error: "serviceId is required" },
        { status: 400 }
      )
    }

    // Fetch the service with its resources
    const service = await db.service.findUnique({
      where: {
        id: serviceId,
        isPublished: true,
      },
      include: {
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
        { error: "Service not found" },
        { status: 404 }
      )
    }

    // For now, we'll return resources as "Resource" type
    // In a real app, you might have a type field in the Resource model
    const resources = service.resources.map((resource) => ({
      id: resource.id,
      name: resource.name,
      type: "Resource", // Could be "User" or "Resource" based on your business logic
    }))

    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}
