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
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {manageCapacity && (
          <h2 className="mb-8 text-center text-4xl font-bold">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              Select Your Appointment Time
            </span>
          </h2>
        )}

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {error && (
            <div
              className="mb-6 rounded-2xl p-4 text-center text-red-400"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}
            >
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Date Picker */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Select Date</h3>
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="mb-4 flex items-center justify-between pb-4" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                      )
                    }
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ←
                  </button>
                  <div className="font-medium text-white">
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
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    →
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-gray-400 font-medium">
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
                          "rounded-xl p-2 transition-all",
                          isSelected
                            ? "text-white shadow-lg"
                            : isToday
                            ? "text-white"
                            : "text-gray-400 hover:text-white"
                        )}
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                            : isToday
                            ? 'rgba(168, 85, 247, 0.2)'
                            : 'transparent',
                          border: isSelected || isToday
                            ? '1px solid rgb(168, 85, 247)'
                            : 'none'
                        }}
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
              <h3 className="mb-4 text-lg font-semibold text-white">Available Slots</h3>

              {loading ? (
                <div className="py-12 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500"></div>
                  <p className="mt-4 text-gray-400">Loading slots...</p>
                </div>
              ) : slots.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
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
                        "w-full rounded-xl px-4 py-3 text-center transition-all",
                        !slot.available
                          ? "cursor-not-allowed line-through"
                          : selectedSlot === slot.id
                          ? "text-white shadow-lg"
                          : "text-white"
                      )}
                      style={{
                        background: !slot.available
                          ? 'rgba(255, 255, 255, 0.02)'
                          : selectedSlot === slot.id
                          ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: !slot.available
                          ? '1px solid rgba(255, 255, 255, 0.05)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        color: !slot.available ? 'rgb(107, 114, 128)' : 'inherit'
                      }}
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
                <div
                  className="mt-6 rounded-2xl p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div className="mb-2 text-sm font-medium text-white">Number of people</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    Capacity selected according to booking capacity rules
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      onClick={() => setCapacity(Math.max(1, capacity - 1))}
                      className="rounded-xl px-3 py-1 text-white transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      -
                    </button>
                    <span className="text-xl font-medium text-white">{capacity}</span>
                    <button
                      onClick={() => setCapacity(capacity + 1)}
                      className="rounded-xl px-3 py-1 text-white transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
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
                "rounded-xl px-8 py-3 font-medium transition-all",
                selectedSlot
                  ? "text-white shadow-lg hover:shadow-xl"
                  : "cursor-not-allowed text-gray-500"
              )}
              style={{
                background: selectedSlot
                  ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: selectedSlot
                  ? 'none'
                  : '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
