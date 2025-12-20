"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-utils";

/**
 * Redirect user to appropriate dashboard based on their role
 */
export async function redirectToDashboard() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/sign-in");
  }
  
  const user = session.user as any;
  const accountType = user.accountType;
  const role = user.role;
  
  // Customer (no organization)
  if (accountType === "customer" || !user.organizationId) {
    redirect("/customer");
  }
  
  // Organization members - redirect based on role
  if (role === "owner") {
    redirect("/admin");
  } else if (role === "admin") {
    redirect("/organiser");
  } else if (role === "member") {
    redirect("/organiser/appointments");
  }
  
  // Default fallback
  redirect("/customer");
}

/**
 * Get user role for client-side routing
 */
export async function getUserRole(): Promise<{
  role: string | null;
  hasOrg: boolean;
  accountType: string;
}> {
  const session = await getSession();
  
  if (!session?.user) {
    return { role: null, hasOrg: false, accountType: "customer" };
  }
  
  const user = session.user as any;
  const hasOrg = !!(user.organizationId);
  const role = user.role || "customer";
  const accountType = user.accountType || "customer";
  
  return { role, hasOrg, accountType };
}
