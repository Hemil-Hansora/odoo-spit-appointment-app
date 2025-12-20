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

// Mock data
const services = [
  {
    id: "1",
    name: "Initial Consultation",
    duration: "30 min",
    status: "published",
    bookings: 12,
  },
  {
    id: "2",
    name: "Strategy Session",
    duration: "60 min",
    status: "published",
    bookings: 8,
  },
  {
    id: "3",
    name: "Technical Review",
    duration: "90 min",
    status: "draft",
    bookings: 0,
  },
];

const stats = [
  { label: "Total Services", value: "3", change: "+2 this month" },
  { label: "Total Bookings", value: "20", change: "+12% from last month" },
  { label: "Revenue", value: "$1,200", change: "+18% from last month" },
  { label: "Avg. Rating", value: "4.8", change: "Based on 15 reviews" },
];

export default function OrganiserDashboard() {
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
          {stats.map((stat) => (
            <div key={stat.label} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
              <dd className="mt-1 text-xs text-gray-500">{stat.change}</dd>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Services</h2>
          <p className="mt-1 text-sm text-gray-600">Overview of all your appointment types</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="border-b border-gray-100 bg-gray-50 pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold text-gray-900">
                    {service.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      service.status === "published"
                        ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                        : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{service.bookings}</div>
                    <p className="text-sm text-gray-500">Total bookings</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium text-gray-900">{service.duration}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 bg-gray-50">
                <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100">
                  Edit Service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
