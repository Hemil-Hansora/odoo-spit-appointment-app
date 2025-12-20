"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { redirectToDashboard } from "../actions";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"customer" | "organiser">("customer");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (accountType === "organiser" && !organizationName.trim()) {
      setError("Organization name is required for organiser accounts");
      return;
    }

    setIsLoading(true);

    try {
      // Use custom sign-up endpoint that handles organization creation
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          accountType,
          organizationName: accountType === "organiser" ? organizationName : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to create account");
        setIsLoading(false);
        return;
      }

      // Sign in the user after successful registration
      const signInResult = await authClient.signIn.email({
        email,
        password,
      });

      if (signInResult.error) {
        setError("Account created but sign-in failed. Please try signing in manually.");
        setIsLoading(false);
        return;
      }

      // Redirect based on account type and role
      if (result.accountType === "customer") {
        router.push("/customer");
      } else if (result.role === "owner") {
        router.push("/admin");
      } else {
        router.push("/organiser");
      }
      router.refresh();
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
          Create an account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="border-border"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="border-border"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountType" className="text-foreground">Account Type</Label>
            <Select
              value={accountType}
              //@ts-ignore
              onValueChange={(value) => setAccountType(value as "customer" | "organiser")}
              disabled={isLoading}
            >
              <SelectTrigger className="border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer - Book appointments</SelectItem>
                <SelectItem value="organiser">Organiser - Manage services</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {accountType === "customer"
                ? "As a customer, you can browse and book appointments."
                : "As an organiser, you can create services and manage bookings."}
            </p>
          </div>
          
          {accountType === "organiser" && (
            <div className="grid gap-2">
              <Label htmlFor="organizationName" className="text-foreground">
                Organization Name
              </Label>
              <Input
                id="organizationName"
                name="organizationName"
                placeholder="My Company"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required={accountType === "organiser"}
                disabled={isLoading}
                className="border-border"
              />
              <p className="text-xs text-muted-foreground">
                This will be the name of your organization where you manage services
              </p>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="border-border"
              minLength={8}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="border-border"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-foreground hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
