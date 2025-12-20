"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your upcoming appointments</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "confirmed").length}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {appointments.filter((a) => a.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search appointments by service, resource, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md border-gray-300 bg-white"
          />
        </div>

        {/* Appointments List */}
        <div className="space-y-6">
          {filteredAppointments.length === 0 ? (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No appointments found</p>
                <Link href="/book">
                  <Button className="mt-4">Book an Appointment</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card key={appointment.id} className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className="mb-4">
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : appointment.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : appointment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              : ""
                          }
                        >
                          {appointment.status === "confirmed" && "Appointment Confirmed"}
                          {appointment.status === "pending" && "Appointment Reserved"}
                          {appointment.status === "cancelled" && "Cancelled"}
                        </Badge>
                        {appointment.status === "pending" && (
                          <p className="mt-2 text-sm text-gray-600">
                            You will get a mail when organiser confirms your booking
                          </p>
                        )}
                      </div>

                      {/* Service & Resource */}
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {appointment.serviceName}
                        </h3>
                        <p className="text-gray-600">{appointment.resourceName}</p>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        {/* Time */}
                        <div className="flex items-start gap-4">
                          <div className="w-32 font-medium text-gray-700">Time</div>
                          <div>
                            <div className="text-gray-900">
                              {appointment.slotDate}, {appointment.slotTime}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => handleAddToCalendar(appointment, "google")}
                                className="rounded border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Google calendar
                              </button>
                              <button
                                onClick={() => handleAddToCalendar(appointment, "outlook")}
                                className="rounded border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                Outlook calendar
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-4">
                          <div className="w-32 font-medium text-gray-700">Duration</div>
                          <div className="text-gray-900">{appointment.duration} min</div>
                        </div>

                        {/* Capacity */}
                        {appointment.capacity > 1 && (
                          <div className="flex items-center gap-4">
                            <div className="w-32 font-medium text-gray-700">No of people</div>
                            <div className="text-gray-900">{appointment.capacity}</div>
                          </div>
                        )}

                        {/* Venue */}
                        <div className="flex items-start gap-4">
                          <div className="w-32 font-medium text-gray-700">Venue</div>
                          <div className="text-gray-900">
                            <div>{appointment.venue.name}</div>
                            <div className="text-gray-600">{appointment.venue.address}</div>
                            <div className="text-gray-600">{appointment.venue.city}</div>
                          </div>
                        </div>

                        {/* Confirmation Message */}
                        {appointment.status === "confirmed" && appointment.confirmationMessage && (
                          <div className="mt-4 rounded border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-2 text-sm font-medium text-gray-700">
                              Confirmation message
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment.confirmationMessage}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cancel Button */}
                    {appointment.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        onClick={() => handleCancel(appointment.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
