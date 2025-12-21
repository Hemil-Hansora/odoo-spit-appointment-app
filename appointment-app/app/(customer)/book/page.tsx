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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Book an Appointment
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Select a service to get started</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading services...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div 
            className="py-4 px-6 rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            <p className="text-red-400 text-center">{error}</p>
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
                className="border-0 text-white placeholder:text-gray-500"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)'
                }}
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger 
                  className="border-0 text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)'
                  }}
                >
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
                  <div 
                    className="rounded-2xl p-6 transition-all hover:scale-[1.01] hover:shadow-xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{service.image || "📅"}</div>
                        <div>
                          <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                          <p className="text-sm text-gray-400">
                            {service.duration} min • {service.location || "Location TBD"}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="rounded-lg px-3 py-1 text-sm font-medium"
                        style={{
                          background: service.price === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(168, 85, 247, 0.2)',
                          color: service.price === 0 ? 'rgb(34, 197, 94)' : 'rgb(168, 85, 247)',
                          border: service.price === 0 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)'
                        }}
                      >
                        {service.price === 0 ? "Free" : `₹${service.price}`}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{service.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                No services found matching your criteria
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
