import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { nanoid } from "nanoid";

// GET /api/organiser/members - List all members of the organization
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const userMember = await db.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
        role: {
          in: ["owner", "admin"],
        },
      },
    });

    if (!userMember) {
      return NextResponse.json(
        { error: "You don't have permission to view members" },
        { status: 403 }
      );
    }

    const members = await db.member.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST /api/organiser/members - Invite a new member
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { email, role, organizationId } = body;

    if (!email || !role || !organizationId) {
      return NextResponse.json(
        { error: "Email, role, and organization ID are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["admin", "member"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'admin' or 'member'" },
        { status: 400 }
      );
    }

    // Verify user has permission to invite (must be owner or admin)
    const userMember = await db.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
        role: {
          in: ["owner", "admin"],
        },
      },
    });

    if (!userMember) {
      return NextResponse.json(
        { error: "You don't have permission to invite members" },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if already a member
      const existingMember = await db.member.findFirst({
        where: {
          organizationId,
          userId: existingUser.id,
        },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: "User is already a member of this organization" },
          { status: 400 }
        );
      }

      // Add existing user as member
      const member = await db.member.create({
        data: {
          id: nanoid(),
          organizationId,
          userId: existingUser.id,
          role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json(
        { member, message: "User added to organization" },
        { status: 201 }
      );
    }

    // Create invitation for new user
    const invitation = await db.invitation.create({
      data: {
        id: nanoid(),
        organizationId,
        email,
        role,
        inviterId: session.user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
      },
    });

    // TODO: Send invitation email here
    // await sendInvitationEmail(email, invitation.id, invitation.organization.name);

    return NextResponse.json(
      {
        invitation,
        message: "Invitation sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inviting member:", error);
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    );
  }
}
