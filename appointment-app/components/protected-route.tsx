"use client";

import { useSession } from "@/lib/auth-client";
import { getDefaultDashboard } from "@/lib/rbac";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "owner" | "admin" | "member" | "customer";
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }

    if (session && requiredRole) {
      const roleHierarchy: Record<string, number> = {
        owner: 4,
        admin: 3,
        member: 2,
        customer: 1,
      };

      const userRoleLevel =
        roleHierarchy[session.user.role as string] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        const defaultDashboard = getDefaultDashboard(
          session.user.role as "owner" | "admin" | "member" | "customer"
        );
        router.push(defaultDashboard);
      }
    }
  }, [session, isPending, requiredRole, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
