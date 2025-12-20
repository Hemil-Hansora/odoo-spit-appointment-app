"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Service {
  id: string
  name: string
  duration: number
  location: string
  description: string
  price: number
  image: string
}

export default function ServiceSelectionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("/api/customer/services")
        if (!response.ok) {
          throw new Error("Failed to fetch services")
        }
        const data = await response.json()
        setServices(data.services)
      } catch (err) {
        setError("Failed to load services. Please try again later.")
        console.error("Error fetching services:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      filter === "all" ? true :
      filter === "free" ? service.price === 0 :
      service.price > 0
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

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center text-gray-600">
            Loading services...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
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
                  href={`/book/select-resource?service=${service.id}`}
                  className="block"
                >
                  <div className="rounded border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{service.image || "📅"}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">
                            {service.duration} min • {service.location || "Location TBD"}
                          </p>
                        </div>
                      </div>
                      <div className="rounded border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                        {service.price === 0 ? "Free" : `$${service.price}`}
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
          </>
        )}
      </div>
    </div>
  )
}
