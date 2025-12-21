"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  metadata?: {
    price?: number | string;
    capacity?: number;
  };
  organization: {
    name: string;
  };
  resources?: Array<{
    id: string;
    name: string;
  }>;
  schedules?: Array<{
    id: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function BookWithShareTokenPage({
  params,
}: {
  params: Promise<{ shareToken: string }>;
}) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function loadParams() {
      const resolvedParams = await params;
      setShareToken(resolvedParams.shareToken);
    }
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!shareToken) return;

    async function fetchService() {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/services/${shareToken}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Service not found or link is invalid");
          }
          throw new Error("Failed to load service");
        }

        const data = await response.json();
        setService(data.service);
      } catch (err) {
        console.error("Failed to fetch service:", err);
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{error || "Service not found"}</p>
            <Link href="/">
              <Button>Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBookNow = () => {
    // Store the share token in session storage
    sessionStorage.setItem("bookingShareToken", shareToken);
    sessionStorage.setItem("bookingServiceId", service.id);
    
    // Redirect to booking flow
    router.push(`/book/select-slot?serviceId=${service.id}&fromShare=true`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <span className="text-sm text-gray-600">Shared by</span>
            <Badge variant="outline" className="font-medium">
              {service.organization.name}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {service.title}
          </h1>
          {!service.isPublished && (
            <Badge variant="outline" className="border-yellow-300 bg-yellow-50 text-yellow-700">
              Preview - Not publicly available
            </Badge>
          )}
        </div>

        {/* Service Details Card */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader>
            <CardTitle>About this service</CardTitle>
            {service.description && (
              <CardDescription className="text-base pt-2">
                {service.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-semibold text-gray-900">
                  {service.durationMinutes} minutes
                </p>
              </div>
              {service.metadata?.price !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{service.metadata.price}
                  </p>
                </div>
              )}
              {service.metadata?.capacity !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Max Capacity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {service.metadata.capacity} {service.metadata.capacity === 1 ? 'person' : 'people'}
                  </p>
                </div>
              )}
            </div>

            {/* Schedules */}
            {service.schedules && service.schedules.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
                <div className="space-y-2">
                  {service.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
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
            {service.resources && service.resources.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Available Resources</h3>
                <div className="flex flex-wrap gap-2">
                  {service.resources.map((resource) => (
                    <Badge
                      key={resource.id}
                      variant="outline"
                      className="border-blue-300 bg-blue-50 text-blue-700"
                    >
                      {resource.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={handleBookNow}
          >
            Book Now
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            This is a private booking link. Only people with this link can book this service.
          </p>
        </div>
      </div>
    </div>
  );
}
