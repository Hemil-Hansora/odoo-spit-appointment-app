import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Enhanced sign-up endpoint that creates user, organization, and member records
 * POST /api/auth/signup
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      accountType,
      organizationName,
    } = body;

    // Validate required fields
    if (!email || !password || !name || !accountType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate account type
    if (!["customer", "organiser"].includes(accountType)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingAccount = await db.account.findFirst({
      where: { accountId: email },
    });

    if (existingAccount) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Create user through better-auth (this handles password hashing)
    const userResult = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/sign-up/email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }
    );

    if (!userResult.ok) {
      const errorData = await userResult.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to create user" },
        { status: 400 }
      );
    }

    const userData = await userResult.json();
    const userId = userData.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Failed to get user ID" },
        { status: 500 }
      );
    }

    // If organiser, create organization and add user as owner
    if (accountType === "organiser") {
      const orgName = organizationName || `${name}'s Organization`;
      const slug = orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Check if slug already exists
      let uniqueSlug = slug;
      let counter = 1;
      while (await db.organization.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      // Create organization
      const organization = await db.organization.create({
        data: {
          id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: orgName,
          slug: uniqueSlug,
          metadata: JSON.stringify({ accountType }),
        },
      });

      // Create member record with owner role
      await db.member.create({
        data: {
          id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          organizationId: organization.id,
          userId: userId,
          role: "owner",
        },
      });

      return NextResponse.json({
        success: true,
        user: userData.user,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
        role: "owner",
        accountType: "organiser",
      });
    }

    // For customers, just return user data
    return NextResponse.json({
      success: true,
      user: userData.user,
      role: "customer",
      accountType: "customer",
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
