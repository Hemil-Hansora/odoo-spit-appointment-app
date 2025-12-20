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
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="py-12 text-center text-gray-600">Loading booking details...</div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded border border-red-200 bg-red-50 p-4 text-center text-red-600">
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Status Badge */}
        {booking.status === "PENDING" || manualConfirmation ? (
          <div className="mb-8 flex justify-center">
            <div className="relative rounded border border-yellow-200 bg-yellow-50 px-8 py-3 text-center">
              <div className="text-yellow-700">Appointment Reserved</div>
              <div className="mt-2 text-sm text-yellow-600">
                You will get a notification when organiser confirms your booking
              </div>
            </div>
          </div>
        ) : booking.status === "CANCELLED" ? (
          <div className="mb-8 flex justify-center">
            <div className="rounded border border-red-200 bg-red-50 px-8 py-3 text-red-700">
              Appointment Cancelled
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <div className="rounded border border-green-200 bg-green-50 px-8 py-3 text-green-700">
              Appointment Confirmed
            </div>
          </div>
        )}

        {/* Confirmation Details */}
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {/* Service Name */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">{booking.service.title}</h2>
          </div>

          {/* Time */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-700">Time</div>
            <div>
              <div className="mb-3 text-gray-900">
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
                  className="rounded border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Google calendar
                </a>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-32 font-medium text-gray-700">Duration</div>
            <div className="text-gray-900">{booking.service.durationMinutes} min</div>
          </div>

          {/* Number of People */}
          {booking.capacity > 1 && (
            <div className="mb-6 flex items-center gap-4">
              <div className="w-32 font-medium text-gray-700">No of people:</div>
              <div className="text-gray-900">{booking.capacity}</div>
            </div>
          )}

          {/* Venue */}
          {booking.service.location && (
            <div className="mb-6 flex items-start gap-4">
              <div className="w-32 font-medium text-gray-700">Venue</div>
              <div className="text-gray-900">{booking.service.location}</div>
            </div>
          )}

          {/* Customer Details */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-700">Customer</div>
            <div className="text-gray-900">
              <div>{booking.user.name}</div>
              <div className="text-sm text-gray-600">{booking.user.email}</div>
            </div>
          </div>

          {/* Answers */}
          {booking.answers.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 font-medium text-gray-700">Additional Information</h3>
              <div className="space-y-2 rounded border border-gray-200 bg-gray-50 p-4">
                {booking.answers.map((answer, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium text-gray-700">{answer.question}:</span>{" "}
                    <span className="text-gray-900">{answer.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Message */}
          {!manualConfirmation && booking.status === "CONFIRMED" && (
            <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Confirmation message</div>
              <div className="text-sm text-gray-600">
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
                className="rounded border border-red-300 bg-white px-8 py-3 text-red-700 hover:bg-red-50 disabled:opacity-50"
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
