
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
        sendResetPassword: async ({ user, url, token }) => {
            // For local development without a verified Resend domain
            // Just log the reset URL to the console
            console.log(`\n${"=".repeat(50)}`);
            console.log(`🔐 PASSWORD RESET for ${user.email}`);
            console.log(`🔗 Reset URL: ${url}`);
            console.log(`${"=".repeat(50)}\n`);
            
            // Uncomment when you have a verified domain:
            // try {
            //     await sendResetPasswordEmail({ email: user.email, url, name: user.name });
            // } catch (error) {
            //     console.error("Failed to send reset email:", error);
            //     if (process.env.NODE_ENV === "production") throw error;
            // }
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
            } catch (error) {
                // In development, just log the OTP to console and continue
                // This allows testing without a verified Resend domain
                console.error(`❌ Failed to send OTP email to ${user.email}:`, error);
                console.log(`\n${"=".repeat(50)}`);
                console.log(`📧 DEVELOPMENT MODE - OTP for ${user.email}`);
                console.log(`🔑 OTP CODE: ${otp}`);
                console.log(`${"=".repeat(50)}\n`);
                
                // Don't throw error in development - allow sign-up to continue
                if (process.env.NODE_ENV === "production") {
                    throw error;
                }
            }
        },
    },

     plugins: [ 
        organization() 
    ] 
    
});