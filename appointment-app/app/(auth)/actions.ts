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
  const hasOrg = user.activeOrganizationId || user.organizationId;
  const role = user.role;
  
  // Customer (no organization)
  if (!hasOrg) {
    redirect("/customer");
  }
  
  // Organization members
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
}> {
  const session = await getSession();
  
  if (!session?.user) {
    return { role: null, hasOrg: false };
  }
  
  const user = session.user as any;
  const hasOrg = !!(user.activeOrganizationId || user.organizationId);
  const role = user.role || "customer";
  
  return { role, hasOrg };
}
