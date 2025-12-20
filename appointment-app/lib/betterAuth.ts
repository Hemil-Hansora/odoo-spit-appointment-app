import { createAuth } from "better-auth";
import { prisma } from "@/lib/prisma";

// Better Auth server config using Prisma
export const auth = createAuth({
  database: {
    type: "prisma",
    prisma,
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "super-secret-key-change-in-production",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disable for now until email provider is configured
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
