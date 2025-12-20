import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type UserRole = "owner" | "admin" | "member" | "customer";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  organizationId?: string;
}

/**
 * Get the current authenticated user session
 * Use this in Server Components and Server Actions
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return session;
}

/**
 * Get the current user or throw if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  
  return session;
}

/**
 * Check if user has required role
 */
export async function requireRole(requiredRole: UserRole) {
  const session = await requireAuth();
  const user = session.user as any;
  const userRole = user.role;
  const hasOrg = user.organizationId || user.activeOrganizationId;
  
  // Customer check (no org)
  if (requiredRole === "customer" && hasOrg) {
    throw new Error("Access denied: Customer accounts should not have organization");
  }
  
  // Org member checks
  if (["owner", "admin", "member"].includes(requiredRole) && !hasOrg) {
    throw new Error("Access denied: Organization membership required");
  }
  
  // Role hierarchy check
  const roleHierarchy: Record<UserRole, number> = {
    customer: 0,
    member: 1,
    admin: 2,
    owner: 3,
  };
  
  const userRoleLevel = roleHierarchy[userRole as UserRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];
  
  if (userRoleLevel < requiredRoleLevel) {
    throw new Error(`Access denied: ${requiredRole} role required`);
  }
  
  return session;
}

/**
 * Check if user can perform action based on permissions
 */
export async function checkPermission(
  resource: "service" | "slot" | "booking",
  action: string
): Promise<boolean> {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return false;
    }
    
    const user = session.user as any;
    const userRole = user.role;
    
    if (!userRole) {
      return false;
    }
    
    const { getRolePermissions } = await import("@/lib/rbac");
    const permissions = getRolePermissions(userRole);
    
    if (!permissions) {
      return false;
    }
    
    // Check if user has permission for the action
    // The permissions object has an authorize method, not a can method
    try {
      const request = { [resource]: [action] };
      permissions.authorize(request as any, {} as any);
      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}
