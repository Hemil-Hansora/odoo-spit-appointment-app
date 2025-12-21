"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface BookingData {
  id: string
  status: string
  capacity: number
  service: {
    title: string
    durationMinutes: number
    manualConfirm: boolean
    location: string
  }
  slot: {
    startTime: string
    endTime: string
  }
  user: {
    name: string
    email: string
  }
  answers: Array<{
    question: string
    value: string
  }>
}

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is required")
      setLoading(false)
      return
    }

    async function fetchBooking() {
      try {
        const response = await fetch(`/api/customer/bookings/${bookingId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch booking details")
        }
        const data = await response.json()
        setBooking(data)
      } catch (err) {
        setError("Failed to load booking details. Please try again later.")
        console.error("Error fetching booking:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId])

  const handleCancel = async () => {
    if (!bookingId || !window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      setCancelling(true)
      const response = await fetch(`/api/customer/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to cancel booking")
      }

      alert("Booking cancelled successfully")
      router.push("/book")
    } catch (err) {
      alert("Failed to cancel booking. Please try again.")
      console.error("Error cancelling booking:", err)
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading booking details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div
            className="rounded-2xl p-4 text-center text-red-400"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
          >
            {error || "Booking not found"}
          </div>
        </div>
      </div>
    )
  }

  const manualConfirmation = booking.service.manualConfirm
  const startTime = new Date(booking.slot.startTime)
  const formattedDate = startTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
  const formattedTime = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Status Badge */}
        {booking.status === "PENDING" || manualConfirmation ? (
          <div className="mb-8 flex justify-center">
            <div
              className="relative rounded-2xl px-8 py-3 text-center"
              style={{
                background: 'rgba(250, 204, 21, 0.2)',
                border: '1px solid rgba(250, 204, 21, 0.3)'
              }}
            >
              <div className="text-yellow-400">Appointment Reserved</div>
              <div className="mt-2 text-sm text-yellow-300">
                You will get a notification when organiser confirms your booking
              </div>
            </div>
          </div>
        ) : booking.status === "CANCELLED" ? (
          <div className="mb-8 flex justify-center">
            <div
              className="rounded-2xl px-8 py-3 text-red-400"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              Appointment Cancelled
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <div
              className="rounded-2xl px-8 py-3 text-green-400"
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
            >
              Appointment Confirmed
            </div>
          </div>
        )}

        {/* Confirmation Details */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Service Name */}
          <div className="mb-6 pb-4" style={{borderBottom: '1px solid rgba(255, 255, 255, 0.1)'}}>
            <h2 className="text-2xl font-bold text-white">{booking.service.title}</h2>
          </div>

          {/* Time */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-400">Time</div>
            <div>
              <div className="mb-3 text-white">
                {formattedDate}, {formattedTime}
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    booking.service.title
                  )}&dates=${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${new Date(
                    booking.slot.endTime
                  )
                    .toISOString()
                    .replace(/[-:]/g, "")
                    .split(".")[0]}Z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-4 py-1 text-sm text-white transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Google calendar
                </a>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-32 font-medium text-gray-400">Duration</div>
            <div className="text-white">{booking.service.durationMinutes} min</div>
          </div>

          {/* Number of People */}
          {booking.capacity > 1 && (
            <div className="mb-6 flex items-center gap-4">
              <div className="w-32 font-medium text-gray-400">No of people:</div>
              <div className="text-white">{booking.capacity}</div>
            </div>
          )}

          {/* Venue */}
          {booking.service.location && (
            <div className="mb-6 flex items-start gap-4">
              <div className="w-32 font-medium text-gray-400">Venue</div>
              <div className="text-white">{booking.service.location}</div>
            </div>
          )}

          {/* Customer Details */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-400">Customer</div>
            <div className="text-white">
              <div>{booking.user.name}</div>
              <div className="text-sm text-gray-400">{booking.user.email}</div>
            </div>
          </div>

          {/* Answers */}
          {booking.answers.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-white">Additional Information</h3>
              <div
                className="space-y-2 rounded-xl p-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {booking.answers.map((answer, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-gray-400">{answer.question}:</span>{" "}
                    <span className="text-white">{answer.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          {!manualConfirmation && booking.status === "CONFIRMED" && (
            <div
              className="mt-8 rounded-xl p-4"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <div className="mb-2 text-sm font-medium text-white">Confirmation message</div>
              <div className="text-sm text-gray-400">
                Thank you for your booking! We look forward to seeing you.
              </div>
            </div>
          )}

          {/* Cancel Button */}
          {booking.status !== "CANCELLED" && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="rounded-xl px-8 py-3 text-white transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
              >
                {cancelling ? "Cancelling..." : "Cancel your appointment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
