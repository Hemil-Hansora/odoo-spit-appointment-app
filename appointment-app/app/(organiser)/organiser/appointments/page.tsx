import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data
const bookings = [
  {
    id: "1",
    customer: "Alice Johnson",
    email: "alice@example.com",
    service: "Initial Consultation",
    time: "Dec 20, 2025 - 10:00 AM",
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Bob Smith",
    email: "bob@example.com",
    service: "Strategy Session",
    time: "Dec 21, 2025 - 02:00 PM",
    status: "pending",
  },
  {
    id: "3",
    customer: "Charlie Brown",
    email: "charlie@example.com",
    service: "Technical Review",
    time: "Dec 22, 2025 - 11:00 AM",
    status: "cancelled",
  },
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Appointments
        </h1>
        <p className="text-muted-foreground">
          View and manage all your bookings.
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            A list of all appointments including customer details and status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Service
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Time
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium text-foreground">
                      <div>{booking.customer}</div>
                      <div className="text-xs text-muted-foreground font-normal">{booking.email}</div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {booking.service}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {booking.time}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
