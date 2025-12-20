import { requireRole } from "@/lib/auth-utils";

export const metadata = {
  title: "Admin Dashboard - Odoo Appointments",
};

export default async function AdminPage() {
  const session = await requireRole("owner");

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          System administration and organization management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Users</p>
          <p className="text-3xl font-bold text-primary mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Organizations</p>
          <p className="text-3xl font-bold text-secondary mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Appointments</p>
          <p className="text-3xl font-bold text-accent mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">System Health</p>
          <p className="text-3xl font-bold text-primary mt-2">100%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Users Management</h2>
          <p className="text-muted-foreground">Manage all users and roles</p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition w-full">
            Manage Users
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Organization</h2>
          <p className="text-muted-foreground">Manage your organization</p>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition w-full">
            Organization Settings
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Reports</h2>
          <p className="text-muted-foreground">View system reports and analytics</p>
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/90 transition w-full">
            View Reports
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">System Settings</h2>
          <p className="text-muted-foreground">Configure system preferences</p>
          <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 transition w-full">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
