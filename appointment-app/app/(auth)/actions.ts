"use server";

import { getSession } from "@/lib/auth-utils";
import { getDefaultDashboard } from "@/lib/rbac";
import { redirect } from "next/navigation";

export async function redirectToDashboard() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const dashboard = getDefaultDashboard(
    session.user.role as "owner" | "admin" | "member" | "customer"
  );
  redirect(dashboard);
}

export async function getUserRole() {
  const session = await getSession();
  return session?.user.role || null;
}
