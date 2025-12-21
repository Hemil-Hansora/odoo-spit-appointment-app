"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  isPublished: boolean;
  schedules?: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  resources?: Array<{
    id: string;
    name: string;
  }>;
  questions?: Array<{
    id: string;
    label: string;
    required: boolean;
  }>;
  _count?: {
    bookings: number;
  };
  metadata?: {
    price?: number | string;
    capacity?: number;
  };
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>("");
  const [viewingService, setViewingService] = useState<Service | null>(null);

  // Fetch organization ID from session
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

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      if (!organizationId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/organiser/services?organizationId=${organizationId}`
        );

        if (response.ok) {
          const data = await response.json();
          setServices(data.services || []);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [organizationId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your appointment types
          </p>
        </div>
        <Link
          href="/organiser/services/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
          }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Service
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-gray-400 mt-4">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div 
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p className="text-gray-400 mb-6 text-lg">No services yet</p>
          <Link
            href="/organiser/services/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Service
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl p-6 transition-all hover:scale-[1.01] hover:shadow-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">
                      {service.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={
                        service.isPublished
                          ? "border-green-500/50 bg-green-500/10 text-green-400"
                          : "border-gray-500/50 bg-gray-500/10 text-gray-400"
                      }
                    >
                      {service.isPublished ? "published" : "draft"}
                    </Badge>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-400">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                    <span>Duration: {service.durationMinutes} min</span>
                    <span>•</span>
                    <span>Bookings: {service._count?.bookings || 0}</span>
                    {service.metadata?.price && (
                      <>
                        <span>•</span>
                        <span>
                          Price:{" "}
                          {typeof service.metadata.price === "number"
                            ? `₹${service.metadata.price}`
                            : service.metadata.price}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-3">
                  <Link
                    href={`/organiser/services/${service.id}/edit`}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
                    style={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      border: '1px solid rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 transition-all hover:bg-white/5"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                    onClick={() => setViewingService(service)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Service Modal */}
      {viewingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setViewingService(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 shadow-2xl"
            style={{
              background: 'rgba(20, 20, 20, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                  {viewingService.title}
                </h2>
                <div className="mt-3 flex items-center gap-2">
                  {viewingService.isPublished ? (
                    <span className="rounded-full bg-green-500/20 border border-green-500/30 px-4 py-1 text-xs font-medium text-green-400">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-500/20 border border-gray-500/30 px-4 py-1 text-xs font-medium text-gray-400">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setViewingService(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-6 rounded-xl p-6"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="mt-2 font-semibold text-white text-lg">
                    {viewingService.durationMinutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Bookings</p>
                  <p className="mt-2 font-semibold text-white text-lg">
                    {viewingService._count?.bookings || 0}
                  </p>
                </div>
                {viewingService.metadata?.price && (
                  <div>
                    <p className="text-sm text-gray-400">Price</p>
                    <p className="mt-2 font-semibold text-white text-lg">
                      ₹{viewingService.metadata.price}
                    </p>
                  </div>
                )}
                {viewingService.metadata?.capacity && (
                  <div>
                    <p className="text-sm text-gray-400">Capacity</p>
                    <p className="mt-2 font-semibold text-white text-lg">
                      {viewingService.metadata.capacity} people
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewingService.description && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Description</h3>
                  <div className="rounded-xl p-4 text-sm text-gray-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    {viewingService.description}
                  </div>
                </div>
              )}

              {/* Schedules */}
              {viewingService.schedules && viewingService.schedules.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Schedules</h3>
                  <div className="space-y-2">
                    {viewingService.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between rounded-xl p-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <span className="font-medium text-white">
                          {DAYS[schedule.dayOfWeek]}
                        </span>
                        <span className="text-sm text-gray-400">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resources */}
              {viewingService.resources && viewingService.resources.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingService.resources.map((resource) => (
                      <span
                        key={resource.id}
                        className="rounded-full px-4 py-2 text-sm font-medium"
                        style={{
                          background: 'rgba(34, 211, 238, 0.2)',
                          border: '1px solid rgba(34, 211, 238, 0.3)',
                          color: 'rgb(34, 211, 238)'
                        }}
                      >
                        {resource.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {viewingService.questions && viewingService.questions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Booking Questions</h3>
                  <div className="space-y-2">
                    {viewingService.questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between rounded-xl p-4"
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <span className="text-sm text-white">{question.label}</span>
                        {question.required && (
                          <span className="text-xs font-medium" style={{ color: 'rgb(239, 68, 68)' }}>
                            Required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                className="px-6 py-2 rounded-lg font-medium text-gray-300 transition-all hover:bg-white/5"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                onClick={() => setViewingService(null)}
              >
                Close
              </button>
              <Link
                href={`/organiser/services/${viewingService.id}/edit`}
                className="px-6 py-2 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                }}
              >
                Edit Service
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
