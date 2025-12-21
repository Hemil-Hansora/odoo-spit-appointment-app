import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function AdminDashboard() {
  // Verify admin session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch statistics
  const [
    totalOrganisers,
    totalCustomers,
    totalServices,
    totalAppointments,
    recentOrganisers,
    recentCustomers,
    recentAppointments,
  ] = await Promise.all([
    // Count organisers (users with ORGANISER role)
    db.user.count({
      where: { role: "ORGANISER" },
    }),
    // Count customers
    db.user.count({
      where: { role: "CUSTOMER" },
    }),
    // Count total services
    db.service.count(),
    // Count total appointments
    db.booking.count(),
    // Get recent organisers
    db.user.findMany({
      where: { role: "ORGANISER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    // Get recent customers
    db.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
    // Get recent appointments
    db.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
          <p className="text-purple-200/60 text-lg">
            Manage all organisers, customers, and appointments
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Organisers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300/80 text-sm font-medium">Total Organisers</p>
                <h3 className="text-4xl font-bold text-white mt-2">{totalOrganisers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(168, 85, 247, 0.2)' }}
              >
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-300/80 text-sm font-medium">Total Customers</p>
                <h3 className="text-4xl font-bold text-white mt-2">{totalCustomers}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34, 211, 238, 0.2)' }}
              >
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Service Providers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300/80 text-sm font-medium">Service Providers</p>
                <h3 className="text-4xl font-bold text-white mt-2">{totalServices}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(250, 204, 21, 0.2)' }}
              >
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Appointments */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 p-6"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300/80 text-sm font-medium">Total Appointments</p>
                <h3 className="text-4xl font-bold text-white mt-2">{totalAppointments}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(34, 197, 94, 0.2)' }}
              >
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Organisers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Recent Organisers</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentOrganisers.length === 0 ? (
                  <p className="text-purple-200/60 text-center py-4">No organisers yet</p>
                ) : (
                  recentOrganisers.map((organiser) => (
                    <div key={organiser.id} className="flex items-center justify-between p-4 rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div>
                        <p className="text-white font-medium">{organiser.name || "N/A"}</p>
                        <p className="text-purple-200/60 text-sm">{organiser.email}</p>
                      </div>
                      <p className="text-purple-300/80 text-xs">
                        {new Date(organiser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Recent Customers</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentCustomers.length === 0 ? (
                  <p className="text-cyan-200/60 text-center py-4">No customers yet</p>
                ) : (
                  recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-4 rounded-lg"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div>
                        <p className="text-white font-medium">{customer.name || "N/A"}</p>
                        <p className="text-cyan-200/60 text-sm">{customer.email}</p>
                      </div>
                      <p className="text-cyan-300/80 text-xs">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Appointments</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            {recentAppointments.length === 0 ? (
              <p className="text-purple-200/60 text-center py-8">No appointments yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-purple-300/80 font-medium pb-3 px-4">Customer</th>
                    <th className="text-left text-purple-300/80 font-medium pb-3 px-4">Service</th>
                    <th className="text-left text-purple-300/80 font-medium pb-3 px-4">Status</th>
                    <th className="text-left text-purple-300/80 font-medium pb-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-white/5">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-white font-medium">{appointment.user.name || "N/A"}</p>
                          <p className="text-purple-200/60 text-sm">{appointment.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white">{appointment.service.name}</td>
                      <td className="py-4 px-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background:
                              appointment.status === "CONFIRMED"
                                ? "rgba(34, 197, 94, 0.2)"
                                : appointment.status === "PENDING"
                                ? "rgba(250, 204, 21, 0.2)"
                                : "rgba(239, 68, 68, 0.2)",
                            color:
                              appointment.status === "CONFIRMED"
                                ? "rgb(34, 197, 94)"
                                : appointment.status === "PENDING"
                                ? "rgb(250, 204, 21)"
                                : "rgb(239, 68, 68)",
                          }}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-purple-200/80 text-sm">
                        {new Date(appointment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
