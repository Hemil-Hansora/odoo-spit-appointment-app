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
  const accountType = user.accountType as string | undefined;
  const role = user.role as string | undefined;

  // 3 user dashboards:
  // - Customer (no org) -> /customer
  // - Org Owner -> /admin
  // - Other org users -> /organiser
  const hasOrg = !!user.organizationId;

  if (!hasOrg || accountType === "customer") {
    redirect("/customer");
  }

  if (role === "owner") {
    redirect("/admin");
  }

  redirect("/organiser");
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
