"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/betterAuthClient";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailParam = searchParams.get("email") ?? "";
  const [email] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: trigger resend OTP or display message
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await authClient.verifyEmail({ email, code: otp });
      if (result.error) throw new Error(result.error);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify your email</CardTitle>
          <CardDescription>Enter the OTP sent to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="otp">One-Time Password</FieldLabel>
                <Input id="otp" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value)} required />
              </Field>
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Field orientation="horizontal">
                <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
                <Button type="button" variant="outline" disabled={loading}>Resend OTP</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
