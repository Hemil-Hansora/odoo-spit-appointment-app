// Example of using authentication in a Server Component

import { getSession, requireAuth, requireRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function ExampleProtectedPage() {
  // Option 1: Get session (returns null if not authenticated)
  const session = await getSession();
  
  if (!session) {
    redirect("/sign-in");
  }

  // Option 2: Require authentication (throws if not authenticated)
  // const session = await requireAuth();

  // Option 3: Require specific role (throws if not authenticated or wrong role)
  // const session = await requireRole("admin");

  const user = session.user as any;

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back!
        </h1>
        <p className="text-muted-foreground">
          You are authenticated as {user.email}
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          User Information
        </h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Name:</dt>
            <dd className="font-medium text-foreground">{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email:</dt>
            <dd className="font-medium text-foreground">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Role:</dt>
            <dd className="font-medium text-foreground">
              {user.role || "customer"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Organization:</dt>
            <dd className="font-medium text-foreground">
              {user.activeOrganizationId ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-border bg-muted/50 p-6">
        <h3 className="font-semibold text-foreground mb-2">
          Protected Content
        </h3>
        <p className="text-sm text-muted-foreground">
          This page is only accessible to authenticated users. The session is
          checked on the server, so unauthorized users are redirected before
          the page renders.
        </p>
      </div>
    </div>
  );
}
