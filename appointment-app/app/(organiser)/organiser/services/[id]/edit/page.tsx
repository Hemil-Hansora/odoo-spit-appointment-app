"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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

interface Schedule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Question {
  id?: string;
  label: string;
  type: string;
  required: boolean;
}

interface Resource {
  id: string;
  name: string;
  isActive: boolean;
}

interface DateSlot {
  date: string;
  totalSlots: number;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [buffer, setBuffer] = useState("0");
  const [isPublished, setIsPublished] = useState(false);

  // Date slots state
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([]);

  // Schedules state
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  // Questions state
  const [questions, setQuestions] = useState<Question[]>([]);

  // Resources state
  const [availableResources, setAvailableResources] = useState<Resource[]>([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState<string[]>([]);

  // Load service data
  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);
        
        // Get organization ID from session
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) {
          throw new Error("Not authenticated");
        }
        const sessionData = await sessionRes.json();
        const orgId = sessionData.session?.user?.activeOrganizationId;

        if (!orgId) {
          throw new Error("No organization found");
        }

        // Load service
        const serviceRes = await fetch(`/api/organiser/services/${serviceId}/config`);
        if (!serviceRes.ok) {
          throw new Error("Failed to load service");
        }
        const serviceData = await serviceRes.json();
        const service = serviceData.service;

        // Set form values
        setName(service.title || "");
        setDescription(service.description || "");
        setDuration(service.durationMinutes.toString());
        setIsPublished(service.isPublished || false);

        // Parse metadata
        let metadata = {};
        if (typeof service.metadata === 'string') {
          try {
            metadata = JSON.parse(service.metadata);
          } catch (e) {
            metadata = {};
          }
        } else {
          metadata = service.metadata || {};
        }

        setPrice((metadata as any).price?.toString() || "");
        setCapacity((metadata as any).capacity?.toString() || "1");
        setBuffer((metadata as any).bufferMinutes?.toString() || "0");
        setDateSlots((metadata as any).dateSlots || []);

        // Set schedules
        setSchedules(service.schedules?.map((s: any) => ({
          id: s.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
        })) || []);

        // Set questions
        setQuestions(service.questions?.map((q: any) => ({
          id: q.id,
          label: q.label,
          type: q.type || "text",
          required: q.required,
        })) || []);

        // Load resources
        const resourcesRes = await fetch(`/api/organiser/resources?organizationId=${orgId}`);
        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json();
          setAvailableResources(resourcesData.resources || []);
        }

        // Set selected resources
        setSelectedResourceIds(service.resources?.map((r: any) => r.id) || []);
      } catch (err) {
        console.error("Failed to load service:", err);
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    }

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  // Schedule handlers
  const addSchedule = () => {
    setSchedules([...schedules, { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  // Question handlers
  const addQuestion = () => {
    setQuestions([...questions, { label: "", type: "text", required: false }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Resource handlers
  const toggleResource = (resourceId: string) => {
    setSelectedResourceIds(prev =>
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Date slot handlers
  const addDateSlot = () => {
    const today = new Date().toISOString().split('T')[0];
    setDateSlots([...dateSlots, { date: today, totalSlots: 10 }]);
  };

  const removeDateSlot = (index: number) => {
    setDateSlots(dateSlots.filter((_, i) => i !== index));
  };

  const updateDateSlot = (index: number, field: keyof DateSlot, value: any) => {
    const updated = [...dateSlots];
    updated[index] = { ...updated[index], [field]: value };
    setDateSlots(updated);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Build update payload with only fields that have values
      const updatePayload: any = {};
      
      if (name) updatePayload.title = name;
      if (description) updatePayload.description = description;
      if (duration) updatePayload.durationMinutes = parseInt(duration);
      if (price) updatePayload.price = parseFloat(price);
      if (capacity) {
        updatePayload.capacity = parseInt(capacity);
        updatePayload.maxCapacity = parseInt(capacity);
      }
      if (buffer) updatePayload.bufferMinutes = parseInt(buffer);
      if (dateSlots && dateSlots.length > 0) updatePayload.dateSlots = dateSlots;
      
      // Always include publish status as it can be toggled
      updatePayload.isPublished = isPublished;
      
      // Always include resource IDs to keep selections up to date
      updatePayload.resourceIds = selectedResourceIds;

      // Update service
      const serviceUpdateRes = await fetch(`/api/organiser/services/${serviceId}/config`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!serviceUpdateRes.ok) {
        const errorData = await serviceUpdateRes.json();
        throw new Error(errorData.error || "Failed to update service");
      }

      // Update schedules only if there are changes
      if (schedules.length > 0) {
        await fetch("/api/organiser/schedules/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId,
            schedules: schedules.map(s => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
            })),
          }),
        });
      }

      // Update questions only if there are changes
      if (questions.length > 0) {
        await fetch("/api/organiser/questions/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId,
            questions: questions.filter(q => q.label).map(q => ({
              label: q.label,
              type: q.type,
              required: q.required,
            })),
          }),
        });
      }

      // Success - redirect to services page
      router.push("/organiser/services");
    } catch (err) {
      console.error("Failed to update service:", err);
      setError(err instanceof Error ? err.message : "Failed to update service");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <p className="text-center text-gray-500">Loading service...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Service
        </h1>
        <p className="text-muted-foreground">
          Update the details for your appointment type.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>
              Basic information about the appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Initial Consultation"
                disabled={saving}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this service is about..."
                disabled={saving}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  name="duration"
                  value={duration}
                  onValueChange={setDuration}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={saving}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                value={isPublished ? "published" : "draft"}
                onValueChange={(value) => setIsPublished(value === "published")}
                disabled={saving}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (Not visible to customers)</SelectItem>
                  <SelectItem value="published">Published (Visible to customers)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Availability & Rules</CardTitle>
            <CardDescription>
              Set when this service can be booked.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label>Weekly Schedule</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSchedule}
                  disabled={saving}
                >
                  + Add Time Slot
                </Button>
              </div>
              <div className="space-y-3">
                {schedules.map((schedule, index) => (
                  <div key={index} className="grid grid-cols-[140px_1fr_1fr_auto] gap-2 items-center">
                    <Select
                      value={schedule.dayOfWeek.toString()}
                      onValueChange={(value) => updateSchedule(index, "dayOfWeek", parseInt(value))}
                      disabled={saving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map((day, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => updateSchedule(index, "startTime", e.target.value)}
                      disabled={saving}
                    />
                    <Input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => updateSchedule(index, "endTime", e.target.value)}
                      disabled={saving}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSchedule(index)}
                      disabled={saving}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="capacity">Max Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  disabled={saving}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="buffer">Buffer Time (minutes)</Label>
                <Select
                  name="buffer"
                  value={buffer}
                  onValueChange={setBuffer}
                  disabled={saving}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select buffer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="10">10 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Booking Questions</CardTitle>
            <CardDescription>
              Information to collect from customers when booking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Questions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addQuestion}
                disabled={saving}
              >
                + Add Question
              </Button>
            </div>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={index} className="grid grid-cols-[2fr_1fr_auto_auto] gap-2 items-center">
                  <Input
                    placeholder="Question label"
                    value={question.label}
                    onChange={(e) => updateQuestion(index, "label", e.target.value)}
                    disabled={saving}
                  />
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(index, "type", value)}
                    disabled={saving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="tel">Phone</SelectItem>
                      <SelectItem value="textarea">Long Text</SelectItem>
                    </SelectContent>
                  </Select>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(index, "required", e.target.checked)}
                      disabled={saving}
                    />
                    Required
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(index)}
                    disabled={saving}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {availableResources.length > 0 && (
          <Card className="mt-6 border-border shadow-sm">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>
                Select which resources (people/rooms) can provide this service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {availableResources.map((resource) => (
                  <label
                    key={resource.id}
                    className="flex items-center gap-3 p-3 border rounded hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedResourceIds.includes(resource.id)}
                      onChange={() => toggleResource(resource.id)}
                      disabled={saving}
                    />
                    <span>{resource.name}</span>
                    {!resource.isActive && (
                      <span className="text-xs text-muted-foreground">(Inactive)</span>
                    )}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Date-Specific Slots</CardTitle>
            <CardDescription>
              Configure specific dates with custom slot availability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Date Slots</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDateSlot}
                disabled={saving}
              >
                + Add Date Slot
              </Button>
            </div>
            {dateSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No date-specific slots configured. Slots will be generated based on weekly schedule.</p>
            ) : (
              <div className="space-y-3">
                {dateSlots.map((dateSlot, index) => (
                  <div key={index} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-center">
                    <div className="grid gap-2">
                      <Label htmlFor={`date-${index}`} className="text-xs">Date</Label>
                      <Input
                        id={`date-${index}`}
                        type="date"
                        value={dateSlot.date}
                        onChange={(e) => updateDateSlot(index, "date", e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`slots-${index}`} className="text-xs">Total Slots</Label>
                      <Input
                        id={`slots-${index}`}
                        type="number"
                        min="1"
                        value={dateSlot.totalSlots}
                        onChange={(e) => updateDateSlot(index, "totalSlots", parseInt(e.target.value) || 1)}
                        disabled={saving}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDateSlot(index)}
                      disabled={saving}
                      className="mt-6"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 border-border shadow-sm">
          <CardFooter className="flex justify-between bg-muted/50 border-t border-border p-6">
            <Button
              variant="outline"
              asChild
              className="border-border text-foreground"
              disabled={saving}
            >
              <Link href="/organiser/services">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
