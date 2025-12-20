import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Appointment App
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A professional booking system for modern businesses.
          Select a role below to explore the application.
        </p>

        <div className="grid gap-6 sm:grid-cols-3 text-left mt-12">
          <Card className="hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Book appointments and manage your schedule.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/customer"
                className={cn(
                  buttonVariants(),
                  "w-full bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                Enter as Customer
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <CardTitle>Organiser</CardTitle>
              <CardDescription>Manage services, availability, and bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/organiser"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full border-border text-foreground hover:bg-accent"
                )}
              >
                Enter as Organiser
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-border">
            <CardHeader>
              <CardTitle>Admin</CardTitle>
              <CardDescription>System administration and user management.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/admin"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full border-border text-foreground hover:bg-accent"
                )}
              >
                Enter as Admin
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Authentication Pages:{" "}
            <Link href="/sign-in" className="underline hover:text-foreground">Sign In</Link>
            {" · "}
            <Link href="/sign-up" className="underline hover:text-foreground">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}