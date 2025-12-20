"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockServices = [
  {
    id: "1",
    name: "Dental Care",
    duration: "30 min",
    location: "Doctor's Office",
    description: "Professional dental consultation and care",
    price: "Free",
    image: "🦷",
  },
  {
    id: "2",
    name: "General Checkup",
    duration: "45 min",
    location: "Clinic Room A",
    description: "Comprehensive health assessment",
    price: "$50",
    image: "🏥",
  },
  {
    id: "3",
    name: "Mental Health Consultation",
    duration: "60 min",
    location: "Virtual / In-person",
    description: "Professional mental health support and guidance",
    price: "$75",
    image: "🧠",
  },
  {
    id: "4",
    name: "Physical Therapy",
    duration: "45 min",
    location: "Therapy Room",
    description: "Rehabilitation and physical wellness session",
    price: "Free",
    image: "💪",
  },
]

export default function ServiceSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filter === "all" ? true :
      filter === "free" ? service.price === "Free" :
      service.price !== "Free"
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Select a service to get started</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_200px]">
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-300 bg-white"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="border-gray-300 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="free">Free Only</SelectItem>
              <SelectItem value="paid">Paid Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Service Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredServices.map((service) => (
            <Link
              key={service.id}
              href={`/customer/book/select-resource?service=${service.id}`}
              className="block"
            >
              <div className="rounded border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{service.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-600">
                        {service.duration} • {service.location}
                      </p>
                    </div>
                  </div>
                  <div className="rounded border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                    {service.price}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-12 text-center text-gray-600">
            No services found matching your criteria
          </div>
        )}
      </div>
    </div>
  )
}
