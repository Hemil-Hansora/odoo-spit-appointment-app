"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
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
    if (path === "/admin") {
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
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">Appointment App</span>
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/admin"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/admin")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/bookings"
                  className={cn(
                    "text-sm font-medium transition-colors relative pb-1",
                    isActive("/admin/bookings")
                      ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All Bookings
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
