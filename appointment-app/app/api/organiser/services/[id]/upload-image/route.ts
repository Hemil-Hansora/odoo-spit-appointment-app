import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// POST /api/organiser/services/[id]/upload-image - Upload service image
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = await db.service.findUnique({
      where: { id: params.id },
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

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "services");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const filename = `${params.id}-${timestamp}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const imageUrl = `/uploads/services/${filename}`;

    // Update service metadata with image URL
    let metadata = {};
    if (service.metadata) {
      try {
        metadata =
          typeof service.metadata === "string"
            ? JSON.parse(service.metadata)
            : service.metadata;
      } catch (e) {
        metadata = {};
      }
    }

    const updatedService = await db.service.update({
      where: { id: params.id },
      data: {
        metadata: JSON.stringify({ ...metadata, image: imageUrl }),
      },
    });

    return NextResponse.json(
      { imageUrl, service: updatedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// DELETE /api/organiser/services/[id]/upload-image - Remove service image
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = await db.service.findUnique({
      where: { id: params.id },
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

    // Update service metadata to remove image
    let metadata: any = {};
    if (service.metadata) {
      try {
        metadata =
          typeof service.metadata === "string"
            ? JSON.parse(service.metadata)
            : service.metadata;
      } catch (e) {
        metadata = {};
      }
    }

    const updatedMetadata: any = { ...metadata };
    delete updatedMetadata.image;

    await db.service.update({
      where: { id: params.id },
      data: {
        metadata: JSON.stringify(updatedMetadata),
      },
    });

    return NextResponse.json(
      { message: "Image removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing image:", error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 }
    );
  }
}
