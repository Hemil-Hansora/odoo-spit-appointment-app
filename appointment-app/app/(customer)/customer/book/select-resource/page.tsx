"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

type SelectionType = "User" | "Resources"

const mockUsers = [
  { id: "A1", name: "Dr. Sarah Johnson", type: "User" },
  { id: "A2", name: "Dr. Michael Chen", type: "User" },
]

const mockResources = [
  { id: "R1", name: "Room 101", type: "Resource" },
  { id: "R2", name: "Room 202", type: "Resource" },
]

export default function SelectResourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")

  const [selectionType, setSelectionType] = useState<SelectionType>("User")
  const [selectedId, setSelectedId] = useState<string>("")

  const items = selectionType === "User" ? mockUsers : mockResources

  const handleContinue = () => {
    if (selectedId) {
      router.push(`/customer/book/select-slot?service=${serviceId}&${selectionType.toLowerCase()}=${selectedId}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Main Container */}
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {/* Heading */}
          <h1 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Select user / Resource
          </h1>

          {/* Toggle Tabs */}
          <div className="mb-8 flex justify-center gap-4">
            <button
              onClick={() => {
                setSelectionType("User")
                setSelectedId("")
              }}
              className={cn(
                "rounded border px-8 py-2 text-sm transition-colors",
                selectionType === "User"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              User
            </button>
            <button
              onClick={() => {
                setSelectionType("Resources")
                setSelectedId("")
              }}
              className={cn(
                "rounded border px-8 py-2 text-sm transition-colors",
                selectionType === "Resources"
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              )}
            >
              Resources
            </button>
          </div>

          {/* Selectable Cards */}
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
                <div className="text-4xl font-bold">{item.id}</div>
                {item.name && (
                  <div className="mt-2 text-sm">{item.name}</div>
                )}
              </button>
            ))}
          </div>

          {/* Introduction Message */}
          <div className="rounded border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
            Schedule your visit today and experience expert dental care brought right to your doorstep.
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedId}
              className={cn(
                "rounded border px-8 py-3 transition-colors",
                selectedId
                  ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                  : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
              )}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
