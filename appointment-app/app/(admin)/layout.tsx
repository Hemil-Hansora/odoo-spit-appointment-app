"use client"

import Link from "next/link";
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { signOut } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
=======
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
>>>>>>> 029c2a47b2babbac22a4899868ad858454a7a8ac

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
<<<<<<< HEAD
  const router = useRouter();
  const pathname = usePathname();
=======
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  // Check if user has ADMIN role
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/"); // Redirect non-admins to home page
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-primary-foreground hidden md:flex flex-col">
        <div className="p-6 border-b border-primary-foreground/10">
          <h2 className="text-xl font-bold tracking-tight">
            Admin Panel
          </h2>
          <p className="text-xs text-primary-foreground/60 mt-1">
            {session.user.email}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center px-4 py-2 text-sm font-medium bg-primary-foreground/10 rounded-md text-primary-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-md"
          >
            Users
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-md"
          >
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-primary-foreground/10">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
            )}
          >
            Sign Out
          </Link>
        </div>
      </aside>
>>>>>>> 029c2a47b2babbac22a4899868ad858454a7a8ac

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
