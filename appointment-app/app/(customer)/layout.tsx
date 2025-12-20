import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              <span>Book</span>
              <span className="text-primary">It</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/book"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Services
              </Link>
              <Link
                href="/book"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                My Appointments
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Out
            </Link>
            <Link
              href="/customer/profile"
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
  );
}
