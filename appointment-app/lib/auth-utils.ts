import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

export async function requireRole(requiredRole: string) {
  const session = await requireAuth();

  const roleHierarchy: Record<string, number> = {
    owner: 3,
    admin: 2,
    member: 1,
  };

  const userRoleLevel = roleHierarchy[session.user.role as string] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  if (userRoleLevel < requiredRoleLevel) {
    redirect("/unauthorized");
  }

  return session;
}

export async function checkPermission(
  resource: string,
  action: string
): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const permissions: Record<
    string,
    Record<string, string[]>
  > = {
    service: {
      create: ["admin", "owner"],
      read: ["admin", "owner", "member"],
      update: ["admin", "owner"],
      delete: ["admin", "owner"],
    },
    appointment: {
      create: ["customer", "admin", "owner"],
      read: ["admin", "owner", "member", "customer"],
      update: ["admin", "owner"],
      delete: ["admin", "owner"],
    },
    organization: {
      create: ["owner"],
      read: ["owner", "admin", "member"],
      update: ["owner", "admin"],
      delete: ["owner"],
    },
  };

  const resourcePerms = permissions[resource];
  if (!resourcePerms) return false;

  const actionPerms = resourcePerms[action];
  if (!actionPerms) return false;

  return actionPerms.includes(session.user.role as string);
}
