import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Admin middleware to check if user is admin
 */
async function isAdmin(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { isAdmin: false, error: "Unauthorized", status: 401 };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return { isAdmin: false, error: "Forbidden - Admin access required", status: 403 };
  }

  return { isAdmin: true, user: session.user };
}

/**
 * GET /api/admin/organizations
 * Get all organizations with pagination
 */
export async function GET(request: NextRequest) {
  const adminCheck = await isAdmin(request);
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const [organizations, total] = await Promise.all([
      db.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              members: true,
              services: true,
            },
          },
          members: {
            where: { role: "owner" },
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
            take: 1,
          },
        },
      }),
      db.organization.count({ where }),
    ]);

    // Format response
    const formattedOrgs = organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      logo: org.logo,
      createdAt: org.createdAt,
      memberCount: org._count.members,
      serviceCount: org._count.services,
      owner: org.members[0]?.user || null,
    }));

    return NextResponse.json({
      organizations: formattedOrgs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin organizations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/organizations
 * Delete an organization
 */
export async function DELETE(request: NextRequest) {
  const adminCheck = await isAdmin(request);
  if (!adminCheck.isAdmin) {
    return NextResponse.json(
      { error: adminCheck.error },
      { status: adminCheck.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    await db.organization.delete({
      where: { id: orgId },
    });

    return NextResponse.json({
      success: true,
      message: "Organization deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete organization error:", error);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}
