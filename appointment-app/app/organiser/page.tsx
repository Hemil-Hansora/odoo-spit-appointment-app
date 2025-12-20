"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { appointmentTypes as seedAppointmentTypes, resources as seedResources } from "@/lib/data";

export default function OrganiserPage() {
  const [appointmentTypes, setAppointmentTypes] = useState(seedAppointmentTypes);
  const [resources, setResources] = useState(seedResources);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);

  const addType = () => {
    if (!name) return;
    setAppointmentTypes(prev => ([...prev, {
      id: `a_${prev.length+1}`,
      name,
      description: "",
      durationMinutes: duration,
      manageCapacity: false,
      published: false,
      questions: [],
    }]));
    setName("");
    setDuration(30);
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Types</CardTitle>
            <CardDescription>Create and manage services</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <div className="flex gap-2">
                <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
                <Button type="button" onClick={addType}>Add</Button>
              </div>
              <ul className="mt-4 space-y-3">
                {appointmentTypes.map(a => (
                  <li key={a.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-sm text-muted-foreground">{a.durationMinutes} min • {a.published ? "Published" : "Unpublished"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="outline" size="sm">Publish</Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>Manage providers/users</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {resources.map(r => (
                <li key={r.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">Capacity per slot: {r.capacity ?? 1}</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>View all bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Stubbed view — integrate data next.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
