"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bookings, appointmentTypes, resources } from "@/lib/data";

export default function CustomerPage() {
  // Stubbed profile; integrate with auth later
  const [name, setName] = useState("Guest User");
  const [email, setEmail] = useState("guest@example.com");

  const upcoming = bookings.filter(b => b.status !== "cancelled");
  const past: typeof upcoming = [];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field orientation="horizontal">
                <Button type="button">Save changes</Button>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming appointments</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((b) => {
                  const at = appointmentTypes.find(a => a.id === b.appointmentTypeId);
                  const r = resources.find(x => x.id === b.resourceId);
                  return (
                    <li key={b.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{at?.name}</p>
                          <p className="text-sm text-muted-foreground">{r?.name} • {new Date(b.slotStart).toLocaleString()}</p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Appointments</CardTitle>
            <CardDescription>History</CardDescription>
          </CardHeader>
          <CardContent>
            {past.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past appointments</p>
            ) : (
              <ul className="space-y-3">
                {past.map((b) => (
                  <li key={b.id} className="rounded-md border p-3">{b.id}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
