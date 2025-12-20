
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { organization } from "better-auth/plugins"
import { sendOTPEmail } from "./email";

// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    emailAndPassword:{
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            // TODO: Implement email sending logic for password reset
            console.log(`Reset password URL for ${user.email}: ${url}`);
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            // Generate a simple 6-digit OTP instead of using the JWT token
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Store the OTP in the database (replace the JWT token with our OTP)
            await db.verification.updateMany({
                where: {
                    identifier: user.email,
                    value: token,
                },
                data: {
                    value: otp,
                },
            });
            
            // Send OTP via email
            try {
                await sendOTPEmail({
                    email: user.email,
                    otp: otp,
                    name: user.name,
                });
                console.log(`✅ OTP email sent successfully to ${user.email}`);
                console.log(`📧 OTP for ${user.email}: ${otp}`);
            } catch (error) {
                console.error(`❌ Failed to send OTP email to ${user.email}:`, error);
                // Also log to console as fallback for development
                console.log(`📧 Fallback - OTP for ${user.email}: ${otp}`);
                throw error; // Re-throw to let better-auth handle the error
            }
        },
    },

     plugins: [ 
        organization() 
    ] 
    
});