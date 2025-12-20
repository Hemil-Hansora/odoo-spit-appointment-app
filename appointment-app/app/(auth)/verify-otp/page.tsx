"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/sign-up");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to verify OTP");
        return;
      }

      setSuccess("Email verified successfully! Redirecting...");
      
      // Redirect based on user role
      setTimeout(() => {
        if (result.redirect) {
          router.push(result.redirect);
        } else {
          router.push("/sign-in");
        }
      }, 1500);
    } catch (err) {
      console.error("Verification error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        setError(result.error || "Failed to resend OTP");
        return;
      }

      setSuccess("OTP resent successfully! Check your email.");
    } catch (err) {
      console.error("Resend error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Verify OTP
        </CardTitle>
        <CardDescription>
          Enter the one-time password sent to {email}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleVerify}>
        <CardContent className="grid gap-4">
          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              {success}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="123456"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isLoading || isResending}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading || isResending || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <Button 
              type="button"
              variant="link" 
              className="p-0 h-auto font-medium text-foreground hover:underline"
              onClick={handleResend}
              disabled={isLoading || isResending}
            >
              {isResending ? "Resending..." : "Resend"}
            </Button>
          </div>
          <div className="text-center text-sm">
            <Link
              href="/sign-in"
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
