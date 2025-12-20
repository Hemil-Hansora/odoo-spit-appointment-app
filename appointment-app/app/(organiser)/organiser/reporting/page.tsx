"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  resourceName: string;
  slotDate: string;
  slotTime: string;
  status: "confirmed" | "pending" | "cancelled";
  answers: Record<string, string>;
  capacity: number;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

export default function ReportingPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Fetch user session and organization ID
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          if (data.session?.user?.activeOrganizationId) {
            setOrganizationId(data.session.user.activeOrganizationId);
          }
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
      }
    };
    fetchSession();
  }, []);

  // Fetch appointments when organizationId is available
  useEffect(() => {
    if (organizationId) {
      fetchAppointments();
    }
  }, [organizationId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/organiser/reporting?organizationId=${organizationId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data.appointments || []);
      setStats(data.stats || { total: 0, confirmed: 0, pending: 0, cancelled: 0 });
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err instanceof Error ? err.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.resourceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedAppointments((prev) =>
      prev.includes(id) ? prev.filter((apptId) => apptId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAppointments.length === filteredAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAppointments.map((appt) => appt.id));
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      const response = await fetch(`/api/organiser/bookings/${appointmentId}/cancel`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      // Refresh appointments list
      await fetchAppointments();
      alert("Appointment cancelled successfully");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      alert("Failed to cancel appointment. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Reporting
        </h1>
        <p className="text-gray-600 mt-1">
          View today's appointments and customer bookings
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {loading ? "..." : stats.total}
            </div>
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
              {loading ? "..." : stats.confirmed}
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
              {loading ? "..." : stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {loading ? "..." : stats.cancelled}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by customer, service, or resource..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md border-gray-300 bg-white"
        />
        {selectedAppointments.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedAppointments.length} selected
          </Badge>
        )}
      </div>

      {/* Appointments Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Today's Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">Loading appointments...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Service
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Time
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Resource
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Contact
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Capacity
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {appointment.serviceName}
                    </td>
                    <td className="py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.slotDate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.slotTime}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {appointment.resourceName}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {appointment.customerPhone}
                    </td>
                    <td className="py-4">
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
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {appointment.capacity}
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => setViewingAppointment(appointment)}
                        >
                          View
                        </Button>
                        {appointment.status !== "cancelled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={cancellingId === appointment.id}
                          >
                            {cancellingId === appointment.id ? "Cancelling..." : "Cancel"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>

              {filteredAppointments.length === 0 && !loading && (
                <div className="py-12 text-center text-gray-500">
                  No appointments found for today
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Appointment Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewingAppointment(null)}>
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                <button onClick={() => setViewingAppointment(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Name</p>
                  <p className="text-gray-900">{viewingAppointment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-gray-900">{viewingAppointment.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">{viewingAppointment.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Service</p>
                  <p className="text-gray-900">{viewingAppointment.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-gray-900">{viewingAppointment.slotDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Time</p>
                  <p className="text-gray-900">{viewingAppointment.slotTime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Resource</p>
                  <p className="text-gray-900">{viewingAppointment.resourceName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacity</p>
                  <p className="text-gray-900">{viewingAppointment.capacity}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge
                    variant={
                      viewingAppointment.status === "confirmed"
                        ? "default"
                        : viewingAppointment.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      viewingAppointment.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : viewingAppointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : ""
                    }
                  >
                    {viewingAppointment.status}
                  </Badge>
                </div>
                {Object.keys(viewingAppointment.answers).length > 0 && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-600 mb-2">Additional Information</p>
                    <div className="space-y-2">
                      {Object.entries(viewingAppointment.answers).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-sm font-medium text-gray-600">{key}:</span>
                          <span className="text-sm text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              {viewingAppointment.status !== "cancelled" && (
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setViewingAppointment(null);
                    handleCancelAppointment(viewingAppointment.id);
                  }}
                >
                  Cancel Appointment
                </Button>
              )}
              <Button onClick={() => setViewingAppointment(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
