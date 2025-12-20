import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

/**
 * Get enhanced session with role and organization information
 * GET /api/auth/session
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ session: null });
    }

    const userId = session.user.id;

    // Get user's organization memberships
    const memberships = await db.member.findMany({
      where: { userId },
      include: {
        organization: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get active organization from session or use first membership
    let activeOrganizationId = (session as any).session?.activeOrganizationId;
    
    if (!activeOrganizationId && memberships.length > 0) {
      activeOrganizationId = memberships[0].organizationId;
    }

    const activeMembership = memberships.find(
      (m) => m.organizationId === activeOrganizationId
    );

    // Determine role and account type
    let role = "customer";
    let accountType = "customer";
    let organization = null;

    if (activeMembership) {
      role = activeMembership.role;
      accountType = "organiser";
      organization = {
        id: activeMembership.organization.id,
        name: activeMembership.organization.name,
        slug: activeMembership.organization.slug,
        logo: activeMembership.organization.logo,
      };
    }

    return NextResponse.json({
      session: {
        ...session,
        user: {
          ...session.user,
          role,
          accountType,
          activeOrganizationId,
          organizations: memberships.map((m) => ({
            id: m.organization.id,
            name: m.organization.name,
            slug: m.organization.slug,
            role: m.role,
          })),
        },
        organization,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

/**
 * Update active organization
 * PATCH /api/auth/session
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { organizationId } = await request.json();

    // Verify user is a member of this organization
    const membership = await db.member.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Not a member of this organization" },
        { status: 403 }
      );
    }

    // Update session with new active organization
    await db.session.update({
      where: { id: session.session.id },
      data: { activeOrganizationId: organizationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update session error:", error);
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    );
  }
}
