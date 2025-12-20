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
  _count?: {
    bookings: number;
  };
  metadata?: {
    price?: number | string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string>("");

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
                              ? `$${service.metadata.price}`
                              : service.metadata.price}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
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
                      asChild
                    >
                      <Link href={`/organiser/services/${service.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
