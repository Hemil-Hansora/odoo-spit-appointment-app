import { requireRole } from "@/lib/auth-utils";

export const metadata = {
  title: "Organiser Dashboard - Odoo Appointments",
};

export default async function OrganiserPage() {
  const session = await requireRole("admin");

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl font-bold text-foreground">
          Organiser Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your services, appointments, and team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Total Services</p>
          <p className="text-3xl font-bold text-primary mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Today's Appointments</p>
          <p className="text-3xl font-bold text-secondary mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Team Members</p>
          <p className="text-3xl font-bold text-accent mt-2">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground text-sm">Pending Bookings</p>
          <p className="text-3xl font-bold text-destructive mt-2">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Services</h2>
          <p className="text-muted-foreground">Create and manage your services</p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition w-full">
            Manage Services
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Appointments</h2>
          <p className="text-muted-foreground">View and manage all bookings</p>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/90 transition w-full">
            View Appointments
          </button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Team</h2>
          <p className="text-muted-foreground">Manage team members and roles</p>
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded hover:bg-accent/90 transition w-full">
            Manage Team
          </button>
        </div>
      </div>
    </div>
  );
}
