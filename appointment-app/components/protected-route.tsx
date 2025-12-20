"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "owner" | "admin" | "member" | "customer";
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackUrl = "/sign-in",
}: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(fallbackUrl);
    }

    if (!isPending && session && requiredRole) {
      const user = session.user as any;
      const userRole = user?.role;
      const hasOrg = user?.organizationId || user?.activeOrganizationId;

      // Check role-based access
      if (requiredRole === "customer" && hasOrg) {
        router.push("/organiser");
      } else if (
        (requiredRole === "owner" || requiredRole === "admin" || requiredRole === "member") &&
        !hasOrg
      ) {
        router.push("/customer");
      } else if (requiredRole && userRole !== requiredRole) {
        // Redirect to appropriate dashboard based on role
        if (userRole === "owner") {
          router.push("/admin");
        } else if (userRole === "admin") {
          router.push("/organiser");
        } else if (userRole === "member") {
          router.push("/organiser/appointments");
        } else {
          router.push("/customer");
        }
      }
    }
  }, [session, isPending, requiredRole, router, fallbackUrl]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
