"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  isPublished: boolean;
  shareToken?: string | null;
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
  const [shareLoading, setShareLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  // Generate or get share link
  const handleShare = async (serviceId: string) => {
    try {
      setShareLoading(serviceId);
      const response = await fetch(`/api/organiser/services/${serviceId}/share`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        const shareUrl = data.shareUrl;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopiedId(serviceId);
        
        // Update the service in the list with the share token
        setServices(prev => 
          prev.map(s => s.id === serviceId ? { ...s, shareToken: data.shareToken } : s)
        );
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error("Failed to generate share link:", err);
      alert("Failed to generate share link");
    } finally {
      setShareLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Services
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your appointment types
              </p>
            </div>
            <Link
              href="/organiser/services/new"
              className={cn(
                buttonVariants(),
                "bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
              )}
            >
              Create Service
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">No services yet</p>
              <Link
                href="/organiser/services/new"
                className={cn(
                  buttonVariants(),
                  "bg-gray-900 hover:bg-gray-800 text-white"
                )}
              >
                Create Your First Service
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {service.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={
                          service.isPublished
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-50 text-gray-600"
                        }
                      >
                        {service.isPublished ? "published" : "draft"}
                      </Badge>
                    </div>
                    {service.description && (
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
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
                    {!service.isPublished && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleShare(service.id)}
                        disabled={shareLoading === service.id}
                      >
                        {shareLoading === service.id ? (
                          "Generating..."
                        ) : copiedId === service.id ? (
                          "✓ Copied!"
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share Link
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-100"
                      asChild
                    >
                      <Link href={`/organiser/services/${service.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => setViewingService(service)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* View Service Modal */}
      {viewingService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setViewingService(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewingService.title}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  {viewingService.isPublished ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setViewingService(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {viewingService.durationMinutes} minutes
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {viewingService._count?.bookings || 0}
                  </p>
                </div>
                {viewingService.metadata?.price && (
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="mt-1 font-medium text-gray-900">
                      ₹{viewingService.metadata.price}
                    </p>
                  </div>
                )}
                {viewingService.metadata?.capacity && (
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="mt-1 font-medium text-gray-900">
                      {viewingService.metadata.capacity} people
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {viewingService.description && (
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Description</h3>
                  <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                    {viewingService.description}
                  </p>
                </div>
              )}

              {/* Schedules */}
              {viewingService.schedules && viewingService.schedules.length > 0 && (
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900">Schedules</h3>
                  <div className="space-y-2">
                    {viewingService.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <span className="font-medium text-gray-900">
                          {DAYS[schedule.dayOfWeek]}
                        </span>
                        <span className="text-sm text-gray-600">
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
                  <h3 className="mb-2 font-semibold text-gray-900">Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingService.resources.map((resource) => (
                      <span
                        key={resource.id}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
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
                  <h3 className="mb-2 font-semibold text-gray-900">Booking Questions</h3>
                  <div className="space-y-2">
                    {viewingService.questions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <span className="text-sm text-gray-900">{question.label}</span>
                        {question.required && (
                          <span className="text-xs text-red-600">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setViewingService(null)}
              >
                Close
              </Button>
              <Button asChild>
                <Link href={`/organiser/services/${viewingService.id}/edit`}>
                  Edit Service
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
