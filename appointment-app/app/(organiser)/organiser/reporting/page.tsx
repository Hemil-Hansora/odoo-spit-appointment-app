"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Reporting
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          View today's appointments and customer bookings
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <p className="text-sm" style={{ color: 'rgb(239, 68, 68)' }}>{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl p-6 transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-sm font-medium text-gray-400 mb-2">
            Total Appointments
          </div>
          <div className="text-4xl font-bold text-white">
            {loading ? "..." : stats.total}
          </div>
        </div>

        <div className="rounded-2xl p-6 transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-sm font-medium text-gray-400 mb-2">
            Confirmed
          </div>
          <div className="text-4xl font-bold" style={{ color: 'rgb(34, 197, 94)' }}>
            {loading ? "..." : stats.confirmed}
          </div>
        </div>

        <div className="rounded-2xl p-6 transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-sm font-medium text-gray-400 mb-2">
            Pending
          </div>
          <div className="text-4xl font-bold" style={{ color: 'rgb(250, 204, 21)' }}>
            {loading ? "..." : stats.pending}
          </div>
        </div>

        <div className="rounded-2xl p-6 transition-all hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="text-sm font-medium text-gray-400 mb-2">
            Cancelled
          </div>
          <div className="text-4xl font-bold" style={{ color: 'rgb(239, 68, 68)' }}>
            {loading ? "..." : stats.cancelled}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by customer, service, or resource..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md bg-white/5 border-white/10 text-white placeholder:text-gray-500"
        />
        {selectedAppointments.length > 0 && (
          <span className="rounded-full px-4 py-2 text-sm font-medium"
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: 'rgb(168, 85, 247)'
            }}
          >
            {selectedAppointments.length} selected
          </span>
        )}
      </div>

      {/* Appointments Table */}
      <div className="rounded-2xl p-8 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Today's Appointments</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading appointments...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Service
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Time
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Resource
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Contact
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Capacity
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div>
                      <div className="font-medium text-white">
                        {appointment.customerName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {appointment.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-white">
                    {appointment.serviceName}
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {appointment.slotDate}
                      </div>
                      <div className="text-sm text-gray-400">
                        {appointment.slotTime}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-white">
                    {appointment.resourceName}
                  </td>
                  <td className="py-4 text-sm text-gray-400">
                    {appointment.customerPhone}
                  </td>
                  <td className="py-4">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        background: appointment.status === "confirmed"
                          ? 'rgba(34, 197, 94, 0.2)'
                          : appointment.status === "pending"
                          ? 'rgba(250, 204, 21, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                        border: appointment.status === "confirmed"
                          ? '1px solid rgba(34, 197, 94, 0.3)'
                          : appointment.status === "pending"
                          ? '1px solid rgba(250, 204, 21, 0.3)'
                          : '1px solid rgba(239, 68, 68, 0.3)',
                        color: appointment.status === "confirmed"
                          ? 'rgb(34, 197, 94)'
                          : appointment.status === "pending"
                          ? 'rgb(250, 204, 21)'
                          : 'rgb(239, 68, 68)'
                      }}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-white">
                    {appointment.capacity}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 text-sm rounded-lg font-medium transition-all"
                        style={{
                          background: 'rgba(34, 211, 238, 0.2)',
                          border: '1px solid rgba(34, 211, 238, 0.3)',
                          color: 'rgb(34, 211, 238)'
                        }}
                        onClick={() => setViewingAppointment(appointment)}
                      >
                        View
                      </button>
                      {appointment.status !== "cancelled" && (
                        <button
                          className="px-3 py-1 text-sm rounded-lg font-medium transition-all disabled:opacity-50"
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: 'rgb(239, 68, 68)'
                          }}
                          onClick={() => handleCancelAppointment(appointment.id)}
                          disabled={cancellingId === appointment.id}
                        >
                          {cancellingId === appointment.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>

            {filteredAppointments.length === 0 && !loading && (
              <div className="py-12 text-center text-gray-400 text-lg">
                No appointments found for today
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.8)' }} onClick={() => setViewingAppointment(null)}>
          <div className="rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto p-8"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Appointment Details
              </h2>
              <button onClick={() => setViewingAppointment(null)} className="text-gray-400 hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">Customer Name</p>
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
