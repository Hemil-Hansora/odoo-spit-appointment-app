import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
