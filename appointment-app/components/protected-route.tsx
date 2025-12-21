"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (isPending) return;

      // If no session, redirect to sign-in
      if (!session) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname || "/")}`);
        return;
      }

      // If no role required, allow access
      if (!requiredRole) {
        setIsChecking(false);
        return;
      }

      // Fetch user role info from server
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        router.push("/sign-in");
        return;
      }

      const data = await response.json();
      const user = data.session?.user;
      
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const role = user.role;
      const accountType = user.accountType;

      // Admin access - only users with admin role in organization
      if (requiredRole === "admin") {
        if (role !== "admin") {
          // Redirect to appropriate dashboard based on account type
          if (accountType === "organiser") {
            router.push("/organiser");
          } else {
            router.push("/customer");
          }
          return;
        }
      }

      // Organiser/Owner/Member access (organization members)
      if (requiredRole === "owner" || requiredRole === "member") {
        if (accountType !== "organiser") {
          // Non-organisers trying to access organiser pages
          router.push("/customer");
          return;
        }
        // Additional check for owner role if required
        if (requiredRole === "owner" && role !== "owner") {
          router.push("/organiser");
          return;
        }
      }

      // Customer access
      if (requiredRole === "customer") {
        if (accountType === "organiser") {
          // Organisers trying to access customer pages
          router.push("/organiser");
          return;
        }
      }

      setIsChecking(false);
    };

    checkAccess();
  }, [session, isPending, requiredRole, router, fallbackUrl, pathname]);

  if (isPending || isChecking) {
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
