import { notFound } from "next/navigation";
import BookingWizard from "./booking-wizard";

// Mock data lookup
const services = {
  "consultation-30": {
    id: "consultation-30",
    name: "Initial Consultation",
    duration: 30,
    price: 0,
  },
  "strategy-session": {
    id: "strategy-session",
    name: "Strategy Session",
    duration: 60,
    price: 150,
  },
  "technical-review": {
    id: "technical-review",
    name: "Technical Review",
    duration: 90,
    price: 250,
  },
  "follow-up": {
    id: "follow-up",
    name: "Follow-up Meeting",
    duration: 45,
    price: 100,
  },
};

interface PageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { serviceId } = await params;
  const service = services[serviceId as keyof typeof services];

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Book {service.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Complete the steps below to schedule your appointment.
        </p>
      </div>
      
      <BookingWizard service={service} />
    </div>
  );
}
