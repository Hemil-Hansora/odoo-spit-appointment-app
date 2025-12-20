import { AppointmentType, Resource, WeeklySchedule, Booking, Slot } from "./types";

// Example weekly schedule 9:00-17:00 Mon-Fri
const defaultSchedule: WeeklySchedule = {
  Mon: { start: "09:00", end: "17:00" },
  Tue: { start: "09:00", end: "17:00" },
  Wed: { start: "09:00", end: "17:00" },
  Thu: { start: "09:00", end: "17:00" },
  Fri: { start: "09:00", end: "17:00" },
  Sat: null,
  Sun: null,
};

export const resources: Resource[] = [
  { id: "r1", name: "Provider A", capacity: 1, workingHours: defaultSchedule },
  { id: "r2", name: "Provider B", capacity: 2, workingHours: defaultSchedule },
];

export const appointmentTypes: AppointmentType[] = [
  {
    id: "a1",
    name: "Consultation",
    description: "30-minute initial consult",
    durationMinutes: 30,
    manageCapacity: true,
    maxPerSlot: 2,
    advancePayment: false,
    manualConfirmation: false,
    autoAssignResource: false,
    published: true,
    questions: [
      { id: "q1", label: "Reason for visit", type: "textarea" },
      { id: "q2", label: "Preferred contact method", type: "select", options: ["Email", "Phone"] },
    ],
  },
  {
    id: "a2",
    name: "Therapy Session",
    description: "60-minute session",
    durationMinutes: 60,
    manageCapacity: false,
    published: true,
    advancePayment: true,
    manualConfirmation: true,
    autoAssignResource: true,
    questions: [
      { id: "q3", label: "Have you attended before?", type: "select", options: ["Yes", "No"] },
    ],
  },
];

export const bookings: Booking[] = [];

// Simple in-memory slots per date per resource
const slotsCache = new Map<string, Slot[]>();

export function getSlotsFor(
  dateISO: string,
  resourceId: string,
  durationMinutes: number,
  capacityPerSlot: number
): Slot[] {
  const key = `${dateISO}_${resourceId}_${durationMinutes}_${capacityPerSlot}`;
  if (slotsCache.has(key)) return slotsCache.get(key)!;
  const date = new Date(dateISO);
  const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getUTCDay()] as keyof WeeklySchedule;
  const resource = resources.find(r => r.id === resourceId);
  const wh = resource?.workingHours[dow];
  if (!wh) return [];

  const [startH, startM] = wh.start.split(":").map(Number);
  const [endH, endM] = wh.end.split(":").map(Number);
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), startH, startM));
  const end = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), endH, endM));

  const slots: Slot[] = [];
  for (let t = start; t < end; t = new Date(t.getTime() + durationMinutes * 60000)) {
    const slotEnd = new Date(t.getTime() + durationMinutes * 60000);
    if (slotEnd > end) break;
    slots.push({
      start: t.toISOString(),
      end: slotEnd.toISOString(),
      capacity: capacityPerSlot,
      booked: 0,
    });
  }

  slotsCache.set(key, slots);
  return slots;
}
