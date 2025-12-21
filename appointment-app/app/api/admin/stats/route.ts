<<<<<<< HEAD
import { NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total users count
    const totalUsers = await db.user.count();

    // Get total organisers count (members with admin role)
    const totalOrganisers = await db.member.count({
      where: {
        role: "admin",
      },
    });

    // Get total services count
    const totalServices = await db.service.count();

    // Get total bookings count
    const totalBookings = await db.booking.count();

    return NextResponse.json({
      totalUsers,
      totalOrganisers,
      totalServices,
      totalBookings,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
=======
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
 * GET /api/admin/stats
 * Get dashboard statistics
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
    // Get statistics in parallel
    const [
      totalUsers,
      totalOrganisers,
      totalCustomers,
      totalOrganizations,
      totalServices,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      recentUsers,
      recentBookings,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "ORGANISER" } }),
      db.user.count({ where: { role: "CUSTOMER" } }),
      db.organization.count(),
      db.service.count(),
      db.booking.count(),
      db.booking.count({ where: { status: "PENDING" } }),
      db.booking.count({ where: { status: "CONFIRMED" } }),
      db.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
        },
      }),
      db.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          service: { select: { title: true } },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalOrganisers,
        totalCustomers,
        totalOrganizations,
        totalServices,
        totalBookings,
        pendingBookings,
        confirmedBookings,
      },
      recentUsers,
      recentBookings,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
>>>>>>> 029c2a47b2babbac22a4899868ad858454a7a8ac
