import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-muted/30 px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            <span>Book</span>
            <span className="text-primary">It</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
