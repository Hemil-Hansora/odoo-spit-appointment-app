"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Appointment {
  id: string;
  serviceName: string;
  resourceName: string;
  slotDate: string;
  slotTime: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled";
  venue: {
    name: string;
    address: string;
    city: string;
  };
  capacity: number;
  confirmationMessage?: string;
  notes?: string;
  answers: Record<string, string>;
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/customer/bookings");
      
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data.bookings || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.slotDate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancel = async (id: string) => {
    // TODO: Implement cancel functionality
    console.log("Cancel appointment:", id);
  };

  const handleAddToCalendar = (appointment: Appointment, type: "google" | "outlook") => {
    // TODO: Implement calendar export
    console.log(`Add to ${type} calendar:`, appointment);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-400">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              My Appointments
            </span>
          </h1>
          <p className="text-gray-400 text-lg">View and manage your upcoming appointments</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-sm font-medium text-gray-400 mb-2">
              Total Appointments
            </p>
            <div className="text-3xl font-bold text-white">{appointments.length}</div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-sm font-medium text-gray-400 mb-2">
              Confirmed
            </p>
            <div className="text-3xl font-bold text-green-400">
              {appointments.filter((a) => a.status === "confirmed").length}
            </div>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(250, 204, 21, 0.1)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p className="text-sm font-medium text-gray-400 mb-2">
              Pending
            </p>
            <div className="text-3xl font-bold text-yellow-400">
              {appointments.filter((a) => a.status === "pending").length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search appointments by service, resource, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md border-0 text-white placeholder:text-gray-500"
            style={{
              background: 'rgba(255, 255, 255, 0.05)'
            }}
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <p className="text-gray-400 mb-4">No appointments found</p>
              <Link href="/book">
                <button
                  className="px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                  }}
                >
                  Book an Appointment
                </button>
              </Link>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Status Badge */}
                    <div className="mb-4">
                      <Badge
                        variant="outline"
                        className="border-0"
                        style={{
                          background: appointment.status === "confirmed"
                            ? "rgba(34, 197, 94, 0.2)"
                            : appointment.status === "pending"
                            ? "rgba(250, 204, 21, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: appointment.status === "confirmed"
                            ? "rgb(34, 197, 94)"
                            : appointment.status === "pending"
                            ? "rgb(250, 204, 21)"
                            : "rgb(239, 68, 68)"
                        }}
                      >
                        {appointment.status === "confirmed" && "Appointment Confirmed"}
                        {appointment.status === "pending" && "Appointment Reserved"}
                        {appointment.status === "cancelled" && "Cancelled"}
                      </Badge>
                      {appointment.status === "pending" && (
                        <p className="mt-2 text-sm text-gray-400">
                          You will get a mail when organiser confirms your booking
                        </p>
                      )}
                    </div>

                    {/* Service & Resource */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        {appointment.serviceName}
                      </h3>
                      <p className="text-gray-400">{appointment.resourceName}</p>
                    </div>

                      {/* Details */}
                      <div className="space-y-3">
                        {/* Time */}
                        <div className="flex items-start gap-4">
                          <div className="w-32 font-medium text-gray-400">Time</div>
                          <div>
                            <div className="text-white">
                              {appointment.slotDate}, {appointment.slotTime}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleAddToCalendar(appointment, "google")}
                                className="rounded-xl px-4 py-1 text-sm text-white transition-all"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                Google calendar
                              </button>
                              <button
                                onClick={() => handleAddToCalendar(appointment, "outlook")}
                                className="rounded-xl px-4 py-1 text-sm text-white transition-all"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                Outlook calendar
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-4">
                          <div className="w-32 font-medium text-gray-400">Duration</div>
                          <div className="text-white">{appointment.duration} min</div>
                        </div>

                        {/* Capacity */}
                        {appointment.capacity > 1 && (
                          <div className="flex items-center gap-4">
                            <div className="w-32 font-medium text-gray-400">No of people</div>
                            <div className="text-white">{appointment.capacity}</div>
                          </div>
                        )}

                        {/* Venue */}
                        <div className="flex items-start gap-4">
                          <div className="w-32 font-medium text-gray-400">Venue</div>
                          <div className="text-white">
                            <div>{appointment.venue.name}</div>
                            <div className="text-gray-400">{appointment.venue.address}</div>
                            <div className="text-gray-400">{appointment.venue.city}</div>
                          </div>
                        </div>

                        {/* Confirmation Message */}
                        {appointment.status === "confirmed" && appointment.confirmationMessage && (
                          <div
                            className="mt-4 rounded-xl p-4"
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}
                          >
                            <div className="mb-2 text-sm font-medium text-white">
                              Confirmation message
                            </div>
                            <div className="text-sm text-gray-400">
                              {appointment.confirmationMessage}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancel Button */}
                    {appointment.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="px-6 py-3 rounded-xl font-medium text-white transition-all"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
