import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
  title: "Protected Page Example - Odoo Appointments",
};

/**
 * This is an example of a server-side protected page.
 * 
 * The `requireAuth()` function will:
 * 1. Get the current session
 * 2. Redirect to /sign-in if user is not authenticated
 * 3. Return session data if authenticated
 */
export default async function ExampleProtectedPage() {
  // This will throw/redirect if user is not authenticated
  const session = await requireAuth();

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Protected Page Example
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          This page requires authentication
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">User Information</h2>
          <div className="space-y-2 text-foreground">
            <p>
              <span className="text-muted-foreground">Name:</span> {session.user.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span>{" "}
              {session.user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role:</span>{" "}
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm font-semibold">
                {session.user.role}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Server Information</h2>
          <p className="text-foreground text-sm">
            This page uses <code className="bg-muted px-2 py-1 rounded">requireAuth()</code> to
            verify authentication on the server.
          </p>
          <p className="text-foreground text-sm">
            Users not authenticated will be redirected to{" "}
            <code className="bg-muted px-2 py-1 rounded">/sign-in</code>
          </p>
        </div>
      </div>

      <div className="bg-secondary/10 border border-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          How Server-Side Protection Works
        </h3>
        <pre className="bg-card p-4 rounded border border-border text-foreground text-sm overflow-auto">
{`import { requireAuth } from "@/lib/auth-utils";

export default async function ProtectedPage() {
  // This line will redirect if not authenticated
  const session = await requireAuth();
  
  return (
    <div>
      <p>Welcome, {session.user.name}</p>
    </div>
  );
}`}
        </pre>
      </div>

      <div className="bg-accent/10 border border-accent rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Require Specific Role
        </h3>
        <pre className="bg-card p-4 rounded border border-border text-foreground text-sm overflow-auto">
{`import { requireRole } from "@/lib/auth-utils";

export default async function AdminPage() {
  // This will redirect if user is not an admin or owner
  const session = await requireRole("admin");
  
  return <div>Admin Content</div>;
}`}
        </pre>
      </div>

      <div className="bg-primary/10 border border-primary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Check Permissions
        </h3>
        <pre className="bg-card p-4 rounded border border-border text-foreground text-sm overflow-auto">
{`import { checkPermission } from "@/lib/auth-utils";

export default async function MyComponent() {
  const canEdit = await checkPermission("service", "update");
  
  return (
    {canEdit && <button>Edit Service</button>}
  );
}`}
        </pre>
      </div>
    </div>
  );
}
