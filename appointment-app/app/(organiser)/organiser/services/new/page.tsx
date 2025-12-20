"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateServicePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [buffer, setBuffer] = useState("0");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get session and organizationId
      const sessionRes = await fetch("/api/auth/session");
      if (!sessionRes.ok) {
        throw new Error("Not authenticated");
      }
      const sessionData = await sessionRes.json();
      const organizationId = sessionData.session?.user?.activeOrganizationId;

      if (!organizationId) {
        throw new Error("No organization found");
      }

      // Prepare service data
      const serviceData = {
        title: name,
        description: description || null,
        durationMinutes: parseInt(duration),
        organizationId,
        isPublished: false,
        metadata: {
          price: price ? parseFloat(price) : 0,
          capacity: capacity ? parseInt(capacity) : 1,
          bufferMinutes: parseInt(buffer),
        },
      };

      // Create service via API
      const response = await fetch("/api/organiser/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create service");
      }

      // Success - redirect to services page
      router.push("/organiser/services");
    } catch (err) {
      console.error("Failed to create service:", err);
      setError(err instanceof Error ? err.message : "Failed to create service");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Service
        </h1>
        <p className="text-muted-foreground">
          Define the details for your new appointment type.
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
                required
                disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
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
            <div className="grid gap-2">
              <Label>Weekly Schedule</Label>
              <div className="text-sm text-muted-foreground border border-border p-4 rounded-md bg-muted">
                <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  (Default schedule applied. Edit in settings.)
                </p>
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
                  disabled={loading}
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
                  disabled={loading}
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
          <CardFooter className="flex justify-between bg-muted/50 border-t border-border p-6">
            <Button
              variant="outline"
              asChild
              className="border-border text-foreground"
              disabled={loading}
            >
              <Link href="/organiser/services">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
