import { getSession } from "./auth-utils";

export type UserRole = "owner" | "admin" | "member" | "customer";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  customer: 1,
};

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export async function canAccessRoute(requiredRole?: UserRole): Promise<boolean> {
  if (!requiredRole) return true;

  const session = await getSession();
  if (!session) return false;

  return hasRole(session.user.role as UserRole, requiredRole);
}

export function getDefaultDashboard(role: UserRole): string {
  switch (role) {
    case "owner":
      return "/admin";
    case "admin":
      return "/organiser";
    case "member":
      return "/organiser/appointments";
    case "customer":
      return "/customer";
    default:
      return "/";
  }
}
