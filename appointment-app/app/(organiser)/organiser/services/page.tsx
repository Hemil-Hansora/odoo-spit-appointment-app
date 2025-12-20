import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
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
    price: "Free",
  },
  {
    id: "2",
    name: "Strategy Session",
    duration: "60 min",
    status: "published",
    bookings: 8,
    price: "$150",
  },
  {
    id: "3",
    name: "Technical Review",
    duration: "90 min",
    status: "draft",
    bookings: 0,
    price: "$250",
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Services
          </h1>
          <p className="text-muted-foreground">
            Manage your appointment types.
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

      <div className="grid gap-6">
        {services.map((service) => (
          <Card key={service.id} className="border-border shadow-sm flex flex-col sm:flex-row items-center justify-between p-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg text-foreground">{service.name}</h3>
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
              </div>
              <div className="text-sm text-muted-foreground">
                {service.duration} • {service.price}
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="text-sm text-muted-foreground">
                {service.bookings} bookings
              </div>
              <Button variant="outline" size="sm" className="border-border">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
