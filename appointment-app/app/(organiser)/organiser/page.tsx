"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  durationMinutes: number;
  isPublished: boolean;
  description?: string | null;
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
  metadata?: {
    price?: number;
    capacity?: number;
  };
  _count?: {
    bookings: number;
  };
}

interface Stats {
  totalServices: number;
  totalBookings: number;
  publishedServices: number;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function OrganiserDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
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

          // Calculate stats
          const totalServices = data.services?.length || 0;
          const publishedServices =
            data.services?.filter((s: Service) => s.isPublished).length || 0;
          const totalBookings =
            data.services?.reduce(
              (acc: number, s: Service) => acc + (s._count?.bookings || 0),
              0
            ) || 0;

          setStats({
            totalServices,
            publishedServices,
            totalBookings,
          });
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [organizationId]);

  const statsDisplay = [
    {
      label: "Total Services",
      value: stats?.totalServices.toString() || "0",
      change: `${stats?.publishedServices || 0} published`,
    },
    {
      label: "Total Bookings",
      value: stats?.totalBookings.toString() || "0",
      change: "All time",
    },
    {
      label: "Published",
      value: stats?.publishedServices.toString() || "0",
      change: "Active services",
    },
    {
      label: "Draft",
      value: (
        (stats?.totalServices || 0) - (stats?.publishedServices || 0)
      ).toString(),
      change: "Unpublished",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your appointment types and view performance
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

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsDisplay.map((stat) => (
            <div
              key={stat.label}
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">
                {stat.label}
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {stat.value}
              </dd>
              <dd className="mt-1 text-xs text-gray-500">{stat.change}</dd>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Services</h2>
          <p className="mt-1 text-sm text-gray-600">
            Overview of all your appointment types
          </p>
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <CardHeader className="border-b border-gray-100 bg-gray-50 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base font-semibold text-gray-900">
                      {service.title}
                    </CardTitle>
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
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-900">
                        {service.durationMinutes} min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bookings:</span>
                      <span className="font-medium text-gray-900">
                        {service._count?.bookings || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 border-t border-gray-100 bg-gray-50 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-300"
                    asChild
                  >
                    <Link href={`/organiser/services/${service.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-gray-600"
                    onClick={() => setViewingService(service)}
                  >
                    View
                  </Button>
                </CardFooter>
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
