import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data
const user = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
};

const upcomingAppointments = [
  {
    id: "apt-1",
    serviceName: "Strategy Session",
    date: "2025-12-25",
    time: "10:00 AM",
    provider: "Dr. Sarah Smith",
    status: "confirmed",
  },
  {
    id: "apt-2",
    serviceName: "Follow-up Meeting",
    date: "2025-12-28",
    time: "02:00 PM",
    provider: "James Wilson",
    status: "pending",
  },
];

const pastAppointments = [
  {
    id: "apt-3",
    serviceName: "Initial Consultation",
    date: "2025-12-10",
    time: "09:00 AM",
    provider: "Dr. Sarah Smith",
    status: "completed",
  },
];

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your account and view your appointments.
          </p>
        </div>
        <Button variant="outline" className="border-border text-foreground">
          Edit Profile
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Full Name</div>
            <div className="text-foreground">{user.name}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Email</div>
            <div className="text-foreground">{user.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">Phone</div>
            <div className="text-foreground">{user.phone}</div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Upcoming Appointments
        </h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="border-border shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">
                      {apt.serviceName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {apt.date} at {apt.time} with {apt.provider}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={apt.status === "confirmed" ? "default" : "secondary"}
                      className={
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"
                      }
                    >
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-border">
                      Reschedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming appointments.</p>
        )}
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Past Appointments
        </h2>
        {pastAppointments.length > 0 ? (
          <div className="grid gap-4">
            {pastAppointments.map((apt) => (
              <Card key={apt.id} className="border-border bg-muted shadow-none opacity-75">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <div className="font-semibold text-foreground">
                      {apt.serviceName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {apt.date} at {apt.time} with {apt.provider}
                    </div>
                  </div>
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No past appointments.</p>
        )}
      </div>
    </div>
  );
}
