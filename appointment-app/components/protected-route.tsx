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

      if (!session) {
        router.push(fallbackUrl);
        return;
      }

      if (!requiredRole) {
        setIsChecking(false);
        return;
      }

      // Fetch user role info from server
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        router.push(fallbackUrl);
        return;
      }

      const data = await response.json();
      const user = data.session?.user;
      
      if (!user) {
        router.push(fallbackUrl);
        return;
      }

      const hasOrg = user.organizationId || user.activeOrganizationId;
      const accountType = user.accountType;

      // Customer trying to access customer pages but has org -> redirect to organiser
      if (requiredRole === "customer" && hasOrg && accountType === "organiser") {
        router.push("/organiser");
        return;
      }
      
      // Organiser trying to access organiser pages but has no org -> redirect to customer
      if (requiredRole === "admin" && !hasOrg) {
        router.push("/book");
        return;
      }

      // Customer account type trying to access organiser pages -> redirect to customer
      if (requiredRole === "admin" && accountType === "customer") {
        router.push("/book");
        return;
      }

      // Organiser account type trying to access customer pages -> redirect to organiser
      if (requiredRole === "customer" && accountType === "organiser" && hasOrg) {
        router.push("/organiser");
        return;
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
