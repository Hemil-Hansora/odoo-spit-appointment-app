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

// Mock data
const services = [
  {
    id: "1",
    name: "Initial Consultation",
    duration: "30 min",
    status: "published",
    bookings: 12,
    price: "Free",
  },
  {
    id: "2",
    name: "Strategy Session",
    duration: "60 min",
    status: "published",
    bookings: 8,
    price: "$150",
  },
  {
    id: "3",
    name: "Technical Review",
    duration: "90 min",
    status: "draft",
    bookings: 0,
    price: "$250",
  },
];

export default function ServicesPage() {
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

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <Badge
                      variant="outline"
                      className={
                        service.status === "published"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }
                    >
                      {service.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{service.duration}</span>
                    <span>•</span>
                    <span>{service.price}</span>
                    <span>•</span>
                    <span>{service.bookings} bookings</span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-3">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    View
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
