import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { appointmentTypes, resources, bookings } from "@/lib/data";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>System-level monitoring and control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Total users</p>
              <p className="text-2xl font-semibold">{12}</p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Total service providers</p>
              <p className="text-2xl font-semibold">{resources.length}</p>
            </div>
            <div className="rounded-md border p-4">
              <p className="text-sm text-muted-foreground">Total appointments</p>
              <p className="text-2xl font-semibold">{bookings.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
