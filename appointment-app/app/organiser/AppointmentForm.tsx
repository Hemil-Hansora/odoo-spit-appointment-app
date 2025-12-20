"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AppointmentForm() {
  const [title, setTitle] = useState("Dental care");
  const [description, setDescription] = useState("Compassionate Oyster");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("Doctor's Office");
  const [bookingType, setBookingType] = useState("User");
  const [assignment, setAssignment] = useState("Automatically");
  const [manageCapacity, setManageCapacity] = useState(false);
  const [maxPerSlot, setMaxPerSlot] = useState("1");
  const [resources, setResources] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, { from: string; to: string }>>({
    Monday: { from: "09:00", to: "17:00" },
    Tuesday: { from: "09:00", to: "17:00" },
    Wednesday: { from: "09:00", to: "17:00" },
    Thursday: { from: "09:00", to: "17:00" },
    Friday: { from: "09:00", to: "17:00" },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleScheduleChange = (day: string, field: "from" | "to", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/appointment-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description,
          durationMinutes: parseInt(duration),
          location,
          bookingType,
          assignment,
          manageCapacity,
          maxPerSlot: parseInt(maxPerSlot),
          resources,
          schedule,
        }),
      });

      if (!res.ok) throw new Error("Failed to create appointment");
      setMessage("✅ Appointment type created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Appointment Type</CardTitle>
        <CardDescription>Define a service that customers can book</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Service Details</h3>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Service Title</FieldLabel>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Dental Checkup"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., 30-minute dental consultation"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Doctor's Office"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Booking & Assignment */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Booking Settings</h3>
            <FieldGroup>
              <Field orientation="horizontal">
                <label className="text-sm">
                  <span className="font-medium">Book by:</span>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option>User</option>
                    <option>Resource</option>
                  </select>
                </label>
              </Field>
              <Field orientation="horizontal">
                <label className="text-sm">
                  <span className="font-medium">Assignment:</span>
                  <select
                    value={assignment}
                    onChange={(e) => setAssignment(e.target.value)}
                    className="ml-2 px-2 py-1 border rounded"
                  >
                    <option>Automatically</option>
                    <option>By visitor</option>
                  </select>
                </label>
              </Field>
            </FieldGroup>
          </div>

          {/* Capacity */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Capacity Management</h3>
            <Field>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={manageCapacity}
                  onCheckedChange={(checked) => setManageCapacity(checked as boolean)}
                />
                <span className="text-sm">Manage capacity per slot</span>
              </label>
            </Field>
            {manageCapacity && (
              <Field className="mt-2">
                <FieldLabel htmlFor="maxPerSlot">Max appointments per slot</FieldLabel>
                <Input
                  id="maxPerSlot"
                  type="number"
                  value={maxPerSlot}
                  onChange={(e) => setMaxPerSlot(e.target.value)}
                />
              </Field>
            )}
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Weekly Schedule</h3>
            <div className="space-y-2 text-sm">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-20 font-medium">{day}</span>
                  <input
                    type="time"
                    value={schedule[day]?.from || "09:00"}
                    onChange={(e) => handleScheduleChange(day, "from", e.target.value)}
                    className="px-2 py-1 border rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={schedule[day]?.to || "17:00"}
                    onChange={(e) => handleScheduleChange(day, "to", e.target.value)}
                    className="px-2 py-1 border rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-md bg-muted border text-sm">
              {message}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Appointment Type"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
