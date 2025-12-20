import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data
const services = [
  {
    id: "1",
    name: "Initial Consultation",
    duration: "30 min",
    status: "published",
    bookings: 12,
  },
  {
    id: "2",
    name: "Strategy Session",
    duration: "60 min",
    status: "published",
    bookings: 8,
  },
  {
    id: "3",
    name: "Technical Review",
    duration: "90 min",
    status: "draft",
    bookings: 0,
  },
];

export default function OrganiserDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your appointment types and view performance.
          </p>
        </div>
        <Link
          href="/organiser/services/new"
          className={cn(
            buttonVariants(),
            "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          Create Service
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                {service.name}
              </CardTitle>
              <Badge
                variant={service.status === "published" ? "default" : "secondary"}
                className={
                  service.status === "published"
                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80 border-border"
                }
              >
                {service.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{service.bookings}</div>
              <p className="text-xs text-muted-foreground">Total bookings</p>
              <div className="mt-4 text-sm text-muted-foreground">
                Duration: {service.duration}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full border-border">
                Edit Service
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
