"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  status: string;
  user: {
    name: string;
    email: string;
  };
  service: {
    title: string;
    durationMinutes: number;
  };
  slot: {
    date: string;
    startTime: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setError("Failed to load bookings");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-muted-foreground text-muted";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Bookings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          View and manage all appointments across the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No bookings found
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Service
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Date & Time
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0">
                      <td className="py-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {booking.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-foreground">
                          {booking.service.title}
                        </p>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm text-foreground">
                            {new Date(booking.slot.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.slot.startTime}
                          </p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm text-foreground">
                          {booking.service.durationMinutes} min
                        </p>
                      </td>
                      <td className="py-4">
                        <Badge className={getStatusColor(booking.status)} variant="secondary">
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
