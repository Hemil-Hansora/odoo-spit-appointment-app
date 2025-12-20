import { NextRequest, NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get("organizationId")

    // Build query filter
    const where: any = {
      isPublished: true,
    }

    // Optionally filter by organization
    if (organizationId) {
      where.organizationId = organizationId
    }

    // Fetch all published services
    const services = await db.service.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        durationMinutes: true,
        maxCapacity: true,
        metadata: true, // Contains: price, location, image
        organizationId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Parse metadata for each service
    const servicesWithParsedMetadata = services.map((service) => {
      let parsedMetadata = {}
      try {
        parsedMetadata = service.metadata ? JSON.parse(service.metadata) : {}
      } catch (e) {
        console.error("Failed to parse metadata for service:", service.id)
      }

      return {
        id: service.id,
        name: service.title,
        duration: service.durationMinutes,
        description: service.description || "",
        price: parsedMetadata.price || 0,
        location: parsedMetadata.location || "",
        image: parsedMetadata.image || "",
        maxCapacity: service.maxCapacity,
      }
    })

    return NextResponse.json({
      services: servicesWithParsedMetadata,
    })
  } catch (error) {
    console.error("Error fetching customer services:", error)
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}
