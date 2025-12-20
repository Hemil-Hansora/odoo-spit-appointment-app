"use client"

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const isActive = (path: string) => {
    if (path === "/organiser") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-muted/30">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/organiser" className="text-xl font-bold">
                <span>Book</span>
                <span className="text-primary">It</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/organiser"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/organiser")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/organiser/appointments"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/organiser/appointments")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Appointments
                </Link>
                <Link
                  href="/organiser/services"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/organiser/services")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Services
                </Link>
                <Link
                  href="/organiser/resources"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/organiser/resources")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Resources
                </Link>
                <Link
                  href="/organiser/reporting"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/organiser/reporting")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Reporting
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
              <Link
                href="/organiser/profile"
                className={cn(
                  buttonVariants(),
                  "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Profile
              </Link>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
