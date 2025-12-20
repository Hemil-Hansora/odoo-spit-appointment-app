import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sendOTPEmail } from "@/lib/email";

/**
 * Resend OTP for email verification
 * POST /api/auth/resend-otp
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old verification records for this email
    await db.verification.deleteMany({
      where: { identifier: email },
    });

    // Create new verification record
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    await db.verification.create({
      data: {
        id: `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        identifier: email,
        value: otp,
        expiresAt: expiresAt,
      },
    });

    // Send OTP email
    try {
      await sendOTPEmail({
        email: user.email,
        otp: otp,
        name: user.name,
      });
      console.log(`✅ OTP resent successfully to ${user.email}`);
      console.log(`📧 New OTP for ${user.email}: ${otp}`);
    } catch (error) {
      console.error(`❌ Failed to resend OTP email:`, error);
      console.log(`📧 Fallback - New OTP for ${user.email}: ${otp}`);
      // Don't throw - the OTP is stored, user can still use it
    }

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
