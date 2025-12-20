import { requireAuth } from "@/lib/auth-utils";

export const metadata = {
  title: "Customer Dashboard - Odoo Appointments",
};

export default async function CustomerPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse and book appointments with our service providers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Browse Services</h2>
          <p className="text-muted-foreground">
            Explore all available services and book appointments
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition">
            Browse Services
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">My Bookings</h2>
          <p className="text-muted-foreground">
            View and manage your upcoming appointments
          </p>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition">
            View Bookings
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Account Settings</h2>
          <p className="text-muted-foreground">
            Manage your profile and preferences
          </p>
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/90 transition">
            Settings
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-muted-foreground text-sm">Upcoming</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary">0</p>
            <p className="text-muted-foreground text-sm">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-accent">0</p>
            <p className="text-muted-foreground text-sm">Cancelled</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-destructive">0</p>
            <p className="text-muted-foreground text-sm">Pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
