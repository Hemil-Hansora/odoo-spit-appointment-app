"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const mockSlots = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "10:00 AM", available: true },
  { id: "3", time: "11:00 AM", available: false },
  { id: "4", time: "12:00 PM", available: true },
  { id: "5", time: "02:00 PM", available: true },
  { id: "6", time: "03:00 PM", available: false },
  { id: "7", time: "04:00 PM", available: true },
  { id: "8", time: "05:00 PM", available: true },
]

export default function SelectSlotPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const userId = searchParams.get("user") || searchParams.get("resources")

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [capacity, setCapacity] = useState<number>(1)
  const manageCapacity = true // Mock: from appointment config

  const handleContinue = () => {
    if (selectedSlot) {
      router.push(`/customer/book/questions?service=${serviceId}&slot=${selectedSlot}&capacity=${capacity}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {manageCapacity && (
          <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
            Capacity Management Enabled
          </h2>
        )}

        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Date Picker */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Date picker</h3>
              <div className="rounded border border-gray-200 bg-white p-4">
                {/* Simple Calendar UI */}
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                  <button className="text-gray-600 hover:text-gray-900">←</button>
                  <div className="font-medium text-gray-900">December 2025</div>
                  <button className="text-gray-600 hover:text-gray-900">→</button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-gray-500">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1
                    const isToday = day === 17
                    return (
                      <button
                        key={day}
                        className={cn(
                          "rounded p-2 transition-colors",
                          isToday
                            ? "border border-gray-900 bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Slots */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Slots</h3>
              <div className="space-y-3">
                {mockSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={cn(
                      "w-full rounded border px-4 py-3 text-center transition-colors",
                      !slot.available
                        ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through"
                        : selectedSlot === slot.id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>

              {/* Number of People */}
              {manageCapacity && selectedSlot && (
                <div className="mt-6 rounded border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 text-sm font-medium text-gray-700">Number of people</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    Capacity selected according to booking capacity rules
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => setCapacity(Math.max(1, capacity - 1))}
                      className="rounded border border-gray-300 bg-white px-3 py-1 text-gray-900 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-medium text-gray-900">{capacity}</span>
                    <button
                      onClick={() => setCapacity(capacity + 1)}
                      className="rounded border border-gray-300 bg-white px-3 py-1 text-gray-900 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedSlot}
              className={cn(
                "rounded border px-8 py-3 transition-colors",
                selectedSlot
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
