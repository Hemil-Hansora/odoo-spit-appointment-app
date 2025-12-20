"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface BookingWizardProps {
  service: Service;
}

const steps = [
  { id: "provider", title: "Select Provider" },
  { id: "date", title: "Select Date" },
  { id: "time", title: "Select Time" },
  { id: "details", title: "Your Details" },
  { id: "confirm", title: "Confirmation" },
];

// Mock providers
const providers = [
  { id: "p1", name: "Dr. Sarah Smith", role: "Senior Consultant" },
  { id: "p2", name: "James Wilson", role: "Technical Lead" },
  { id: "p3", name: "Any Available Provider", role: "Fastest Availability" },
];

// Mock time slots
const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
];

export default function BookingWizard({ service }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [bookingData, setBookingData] = React.useState({
    providerId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    notes: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: string, value: string) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate next 7 days for date selection
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    };
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Provider
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary ${
                  bookingData.providerId === provider.id
                    ? "border-primary bg-muted ring-1 ring-primary"
                    : "border-border"
                }`}
                onClick={() => updateData("providerId", provider.id)}
              >
                <div className="font-medium text-foreground">{provider.name}</div>
                <div className="text-sm text-muted-foreground">{provider.role}</div>
              </div>
            ))}
          </div>
        );
      case 1: // Date
        return (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {dates.map((date) => (
              <div
                key={date.value}
                className={`cursor-pointer rounded-lg border p-3 text-center transition-all hover:border-primary ${
                  bookingData.date === date.value
                    ? "border-primary bg-muted ring-1 ring-primary"
                    : "border-border"
                }`}
                onClick={() => updateData("date", date.value)}
              >
                <div className="font-medium text-foreground">{date.label}</div>
              </div>
            ))}
          </div>
        );
      case 2: // Time
        return (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={bookingData.time === time ? "default" : "outline"}
                className={`w-full ${
                  bookingData.time === time
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground hover:bg-accent"
                }`}
                onClick={() => updateData("time", time)}
              >
                {time}
              </Button>
            ))}
          </div>
        );
      case 3: // Details
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={bookingData.name}
                onChange={(e) => updateData("name", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={bookingData.email}
                onChange={(e) => updateData("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={bookingData.notes}
                onChange={(e) => updateData("notes", e.target.value)}
                placeholder="Any specific topics you'd like to discuss?"
              />
            </div>
          </div>
        );
      case 4: // Confirmation
        const selectedProvider = providers.find((p) => p.id === bookingData.providerId);
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-muted p-4">
              <h3 className="font-semibold text-foreground mb-4">Booking Summary</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Service</dt>
                  <dd className="font-medium text-foreground">{service.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Duration</dt>
                  <dd className="font-medium text-foreground">{service.duration} mins</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Provider</dt>
                  <dd className="font-medium text-foreground">{selectedProvider?.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date</dt>
                  <dd className="font-medium text-foreground">{bookingData.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Time</dt>
                  <dd className="font-medium text-foreground">{bookingData.time}</dd>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <dt className="text-foreground">Total Price</dt>
                  <dd className="text-foreground">${service.price}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h3 className="font-semibold text-foreground mb-2">Your Information</h3>
              <p className="text-sm text-muted-foreground">{bookingData.name}</p>
              <p className="text-sm text-muted-foreground">{bookingData.email}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return !!bookingData.providerId;
      case 1: return !!bookingData.date;
      case 2: return !!bookingData.time;
      case 3: return !!bookingData.name && !!bookingData.email;
      default: return true;
    }
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 sm:w-16 ${
                    index < currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>
          Step {currentStep + 1} of {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-75">
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="border-border hover:bg-accent text-foreground"
        >
          Back
        </Button>
        {currentStep === steps.length - 1 ? (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Confirm Booking
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
