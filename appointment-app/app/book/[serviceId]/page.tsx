"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { appointmentTypes, resources, getSlotsFor } from "@/lib/data";
import { Question } from "@/lib/types";

export default function BookServicePage() {
  const params = useParams();
  const serviceId = Array.isArray(params?.serviceId) ? params?.serviceId[0] : (params?.serviceId as string);
  const appt = useMemo(() => appointmentTypes.find(a => a.id === serviceId), [serviceId]);

  const [resourceId, setResourceId] = useState(resources[0]?.id ?? "");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [capacity, setCapacity] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!appt) {
    return <div className="mx-auto max-w-2xl p-4"><Card><CardHeader><CardTitle>Service not found</CardTitle></CardHeader></Card></div>;
  }

  const duration = appt.durationMinutes;
  const perSlotCap = appt.manageCapacity ? (appt.maxPerSlot ?? 1) : 1;
  const slots = getSlotsFor(new Date(date + "T00:00:00Z").toISOString(), resourceId, duration, perSlotCap);

  const onAnswerChange = (q: Question, v: string) => {
    setAnswers(a => ({...a, [q.id]: v}));
  };

  const onConfirm = async () => {
    setError(null);
    setConfirming(true);
    try {
      if (!slotStart) throw new Error("Please select a time slot");
      // TODO: validate capacity and book (server action)
      await new Promise(r => setTimeout(r, 800));
      alert("Booked! (stub)\n" + JSON.stringify({ serviceId, resourceId, date, slotStart, capacity, answers }, null, 2));
    } catch (e: any) {
      setError(e?.message ?? "Booking failed");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Book: {appt.name}</CardTitle>
          <CardDescription>{appt.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Provider</FieldLabel>
                <Select value={resourceId as any} onValueChange={(v: any) => setResourceId(String(v))}>
                  <SelectTrigger aria-label="Provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {resources.map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </Field>
            </div>

            <Field>
              <FieldLabel>Available time slots</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {slots.length === 0 && (
                  <p className="text-sm text-muted-foreground">No slots for selected date</p>
                )}
                {slots.map(s => (
                  <Button key={s.start} variant={slotStart === s.start ? "default" : "outline"} onClick={() => setSlotStart(s.start)}>
                    {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Button>
                ))}
              </div>
            </Field>

            {appt.manageCapacity && (
              <Field>
                <FieldLabel>Capacity</FieldLabel>
                <Input type="number" min={1} max={perSlotCap} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
              </Field>
            )}

            {appt.questions.length > 0 && (
              <div className="space-y-4">
                {appt.questions.map(q => (
                  <Field key={q.id}>
                    <FieldLabel>{q.label}{q.required ? " *" : ""}</FieldLabel>
                    {q.type === "textarea" ? (
                      <Textarea value={answers[q.id] ?? ""} onChange={(e) => onAnswerChange(q, e.target.value)} />
                    ) : q.type === "select" ? (
                      <Select value={(answers[q.id] ?? "") as any} onValueChange={(v: any) => onAnswerChange(q, String(v))}>
                        <SelectTrigger aria-label={q.label}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {(q.options ?? []).map(o => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={answers[q.id] ?? ""} onChange={(e) => onAnswerChange(q, e.target.value)} />
                    )}
                  </Field>
                ))}
              </div>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center gap-2">
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button className="ml-auto" onClick={onConfirm} disabled={confirming || !slotStart}>{confirming ? "Confirming..." : "Confirm Booking"}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
