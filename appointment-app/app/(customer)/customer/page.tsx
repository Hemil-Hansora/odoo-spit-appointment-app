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

// Mock data for services
const services = [
  {
    id: "consultation-30",
    name: "Initial Consultation",
    description: "A 30-minute introductory call to discuss your needs and how we can help.",
    duration: "30 min",
    providerType: "Video Call",
    price: "Free",
  },
  {
    id: "strategy-session",
    name: "Strategy Session",
    description: "Deep dive into your business strategy and roadmap planning.",
    duration: "60 min",
    providerType: "In-Person / Video",
    price: "$150",
  },
  {
    id: "technical-review",
    name: "Technical Review",
    description: "Comprehensive review of your current technical architecture.",
    duration: "90 min",
    providerType: "Video Call",
    price: "$250",
  },
  {
    id: "follow-up",
    name: "Follow-up Meeting",
    description: "Regular check-in to track progress and adjust plans.",
    duration: "45 min",
    providerType: "Video Call",
    price: "$100",
  },
];

export default function CustomerHomePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Select a Service
        </h1>
        <p className="text-muted-foreground">
          Choose from our available appointment types below to get started.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl font-semibold text-foreground">
                  {service.name}
                </CardTitle>
                <Badge variant="secondary" className="shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {service.price}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 mt-2">
                {service.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded border border-border">
                  <span className="font-medium">Duration:</span> {service.duration}
                </div>
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded border border-border">
                  <span className="font-medium">Type:</span> {service.providerType}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/customer/book/${service.id}`}
                className={cn(
                  buttonVariants(),
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
              >
                Book Appointment
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
