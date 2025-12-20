export type Role = "customer" | "organiser" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Question {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox";
  options?: string[];
  required?: boolean;
}

export interface AppointmentType {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number; // 30, 60 etc.
  manageCapacity: boolean;
  maxPerSlot?: number; // if manageCapacity
  advancePayment?: boolean;
  manualConfirmation?: boolean;
  autoAssignResource?: boolean;
  published: boolean;
  questions: Question[];
}

export interface Resource {
  id: string;
  name: string;
  email?: string;
  capacity?: number; // per slot capacity default
  workingHours: WeeklySchedule; // e.g., 9-5
}

export type WeeklySchedule = Record<
  DayOfWeek,
  { start: string; end: string } | null
>;

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface Slot {
  start: string; // ISO string
  end: string;   // ISO string
  capacity: number;
  booked: number;
}

export interface Booking {
  id: string;
  customerId: string;
  appointmentTypeId: string;
  resourceId: string;
  slotStart: string; // ISO
  slotEnd: string;   // ISO
  answers: Record<string, string | string[]>;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus?: "unpaid" | "paid" | "refunded";
}
