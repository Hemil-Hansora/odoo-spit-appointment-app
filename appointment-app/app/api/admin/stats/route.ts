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
