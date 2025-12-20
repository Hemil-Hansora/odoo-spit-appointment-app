import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

/**
 * Verify OTP for email verification
 * POST /api/auth/verify-otp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate required fields
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Find the verification record
    const verification = await db.verification.findFirst({
      where: {
        identifier: email,
        value: otp,
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > verification.expiresAt) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    // Mark email as verified
    await db.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    // Delete the verification record
    await db.verification.delete({
      where: { id: verification.id },
    });

    // Check if user is part of an organization (organiser)
    const member = await db.member.findFirst({
      where: { userId: user.id },
      include: { organization: true },
    });

    let redirectUrl = "/sign-in";
    
    if (member) {
      // User is an organiser
      redirectUrl = "/organiser";
    } else {
      // User is a customer
      redirectUrl = "/book";
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      redirect: redirectUrl,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
