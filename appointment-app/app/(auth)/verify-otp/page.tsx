import Link from "next/link";
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
  async function verifyOtpAction(formData: FormData) {
    "use server";
    // Placeholder for BetterAuth OTP verification logic
    console.log("OTP verification attempt", formData);
  }

  return (
    <Card className="w-full border-border shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Verify OTP
        </CardTitle>
        <CardDescription>
          Enter the one-time password sent to your email
        </CardDescription>
      </CardHeader>
      <form action={verifyOtpAction}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="otp">One-Time Password</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="123456"
              required
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Verify
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code?{" "}
            <Button variant="link" className="p-0 h-auto font-medium text-foreground hover:underline">
              Resend
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
