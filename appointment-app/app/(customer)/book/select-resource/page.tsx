"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

type SelectionType = "User" | "Resources"

interface Resource {
  id: string
  name: string
  type: string
}

export default function SelectResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")

  const [selectionType, setSelectionType] = useState<SelectionType>("Resources")
  const [selectedId, setSelectedId] = useState<string>("")
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!serviceId) {
      setError("Service ID is required")
      setLoading(false)
      return
    }

    async function fetchResources() {
      try {
        const response = await fetch(`/api/customer/resources?serviceId=${serviceId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch resources")
        }
        const data = await response.json()
        setResources(data.resources)
      } catch (err) {
        setError("Failed to load resources. Please try again later.")
        console.error("Error fetching resources:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [serviceId])

  const items = resources

  const handleContinue = () => {
    // If there are no resources, continue without resourceId
    // Otherwise, only continue if a resource is selected
    if (items.length === 0 || selectedId) {
      const url = selectedId 
        ? `/book/select-slot?service=${serviceId}&resource=${selectedId}`
        : `/book/select-slot?service=${serviceId}`
      router.push(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Main Container */}
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {/* Heading */}
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Select Resource
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center text-gray-600">
              Loading resources...
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
              {/* Selectable Cards */}
              {items.length > 0 ? (
                <div className="mb-8 grid gap-6 md:grid-cols-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={cn(
                        "rounded border p-8 text-center transition-all",
                        selectedId === item.id
                          ? "border-gray-900 bg-gray-900 text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      <div className="text-2xl font-bold">{item.name}</div>
                      {item.type && (
                        <div className="mt-2 text-sm opacity-80">{item.type}</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-8 py-12 text-center text-gray-600">
                  No resources configured for this service. Click continue to proceed with booking.
                </div>
              )}

              {/* Introduction Message */}
              {items.length > 0 && (
                <div className="rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
                  Select a resource to continue booking your appointment
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  disabled={items.length > 0 && !selectedId}
                  className={cn(
                    "rounded border px-8 py-3 transition-colors",
                    (items.length === 0 || selectedId)
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                      : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                  )}
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
