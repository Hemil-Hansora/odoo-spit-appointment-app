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
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Main Container */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Heading */}
          <h1 className="mb-8 text-center text-4xl font-bold">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Select Resource
            </span>
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500"></div>
              <p className="mt-4 text-gray-400">Loading resources...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              className="py-12 text-center rounded-2xl"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              <p className="text-red-400">{error}</p>
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
                        "rounded-2xl p-8 text-center transition-all",
                        selectedId === item.id
                          ? "shadow-lg"
                          : "hover:shadow-md"
                      )}
                      style={{
                        background: selectedId === item.id
                          ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: selectedId === item.id
                          ? '2px solid rgb(168, 85, 247)'
                          : '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <div className="text-2xl font-bold text-white">{item.name}</div>
                      {item.type && (
                        <div className="mt-2 text-sm text-gray-300">{item.type}</div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mb-8 py-12 text-center text-gray-400">
                  No resources configured for this service. Click continue to proceed with booking.
                </div>
              )}

              {/* Introduction Message */}
              {items.length > 0 && (
                <div
                  className="rounded-xl p-4 text-center text-sm text-gray-400"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Select a resource to continue booking your appointment
                </div>
              )}

              {/* Continue Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  disabled={items.length > 0 && !selectedId}
                  className={cn(
                    "rounded-xl px-8 py-3 font-medium transition-all",
                    (items.length === 0 || selectedId)
                      ? "text-white shadow-lg hover:shadow-xl"
                      : "cursor-not-allowed text-gray-500"
                  )}
                  style={{
                    background: (items.length === 0 || selectedId)
                      ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: (items.length === 0 || selectedId)
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
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
