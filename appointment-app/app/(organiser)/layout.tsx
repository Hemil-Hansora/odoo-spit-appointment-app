"use client"

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/protected-route";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function OrganiserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <ProtectedRoute requiredRole="admin">
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Organiser
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/organiser"
            className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/organiser/appointments"
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
          >
            Appointments
          </Link>
          <Link
            href="/organiser/services"
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
          >
            Services
          </Link>
          <Link
            href="/organiser/resources"
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
          >
            Resources
          </Link>
          <Link
            href="/organiser/calendar"
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
          >
            Calendar
          </Link>
          <Link
            href="/organiser/reporting"
            className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground rounded-md"
          >
            Reporting
          </Link>
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}
