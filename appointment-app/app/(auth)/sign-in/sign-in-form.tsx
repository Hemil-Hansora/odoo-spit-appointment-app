"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { redirectToDashboard } from "../actions";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const result = await signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Redirect to appropriate dashboard
      await redirectToDashboard();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-8 border border-border bg-card">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back to Odoo Appointments
            </p>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="space-y-2 text-sm text-center">
            <Link
              href="/forgot-password"
              className="text-primary hover:text-primary/90 hover:underline block"
            >
              Forgot Password?
            </Link>
            <div className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/90 hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
