"use client";
import AppointmentForm from "./AppointmentForm";

export default function OrganiserPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Organiser Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointment types and resources</p>
      </div>
      <AppointmentForm />
    </div>
  );
}
