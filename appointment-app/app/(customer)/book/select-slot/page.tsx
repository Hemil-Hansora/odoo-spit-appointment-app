"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface Slot {
  id: string
  time: string
  startTime: string
  endTime: string
  available: boolean
  capacity: number
  bookedCount: number
}

export default function SelectSlotPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const resourceId = searchParams.get("resource")

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<string>("")
  const [capacity, setCapacity] = useState<number>(1)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const manageCapacity = true

  useEffect(() => {
    if (!serviceId) {
      setError("Service ID is required")
      setLoading(false)
      return
    }

    async function fetchSlots() {
      try {
        setLoading(true)
        // Format date in local timezone to avoid timezone offset issues
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        const url = `/api/customer/slots?serviceId=${serviceId}&date=${dateStr}${
          resourceId ? `&resourceId=${resourceId}` : ""
        }`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch slots")
        }
        const data = await response.json()
        setSlots(data.slots || [])
      } catch (err) {
        setError("Failed to load time slots. Please try again later.")
        console.error("Error fetching slots:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [selectedDate, serviceId, resourceId])

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
    setSelectedSlot("") // Reset slot selection when date changes
  }

  const handleContinue = () => {
    if (selectedSlot) {
      const slot = slots.find((s) => s.id === selectedSlot)
      if (slot) {
        const params = new URLSearchParams({
          service: serviceId || "",
          slotId: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          capacity: capacity.toString(),
        })
        if (resourceId) params.append("resourceId", resourceId)
        router.push(`/book/questions?${params.toString()}`)
      }
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = () => {
    return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {manageCapacity && (
          <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
            Select Your Appointment Time
          </h2>
        )}

        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Date Picker */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Select Date</h3>
              <div className="rounded border border-gray-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                      )
                    }
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ←
                  </button>
                  <div className="font-medium text-gray-900">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                      )
                    }
                    className="text-gray-600 hover:text-gray-900"
                  >
                    →
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-gray-500 font-medium">
                      {day}
                    </div>
                  ))}
                  {[...Array(getFirstDayOfMonth())].map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {[...Array(getDaysInMonth())].map((_, i) => {
                    const day = i + 1
                    const isSelected =
                      selectedDate.getDate() === day &&
                      selectedDate.getMonth() === currentMonth.getMonth() &&
                      selectedDate.getFullYear() === currentMonth.getFullYear()
                    const isToday =
                      new Date().getDate() === day &&
                      new Date().getMonth() === currentMonth.getMonth() &&
                      new Date().getFullYear() === currentMonth.getFullYear()
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className={cn(
                          "rounded p-2 transition-colors",
                          isSelected
                            ? "border border-gray-900 bg-gray-900 text-white"
                            : isToday
                            ? "border border-gray-300 text-gray-900"
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
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Available Slots</h3>

              {loading ? (
                <div className="py-12 text-center text-gray-600">Loading slots...</div>
              ) : slots.length === 0 ? (
                <div className="py-12 text-center text-gray-600">
                  No slots available for this date
                </div>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
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
                      <div className="flex items-center justify-between">
                        <span>{slot.time}</span>
                        {!slot.available && (
                          <span className="text-xs">
                            ({slot.bookedCount}/{slot.capacity})
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

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
