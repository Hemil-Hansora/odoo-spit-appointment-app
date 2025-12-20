"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const isPaid = searchParams.get("paid") === "true"
  
  // Mock: from appointment config
  const manualConfirmation = false // If true, show "Reserved" state
  const manageCapacity = true

  const handleCancel = () => {
    router.push("/customer/book")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Status Badge */}
        {manualConfirmation ? (
          <div className="mb-8 flex justify-center">
            <div className="relative rounded border border-yellow-200 bg-yellow-50 px-8 py-3 text-center">
              <div className="text-yellow-700">Appointment Reserved</div>
              <div className="absolute -top-16 right-0 rounded border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                You will get a mail when organiser confirms your booking
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <div className="rounded border border-green-200 bg-green-50 px-8 py-3 text-green-700">
              Appointment confirmed
            </div>
          </div>
        )}

        {/* Confirmation Details */}
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {/* Time */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-700">Time</div>
            <div>
              <div className="mb-3 text-gray-900">Dec 17, 9:00 am</div>
              <div className="flex gap-2">
                <button className="rounded border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-50">
                  Google calendar
                </button>
                <button className="rounded border border-gray-300 bg-white px-4 py-1 text-sm text-gray-700 hover:bg-gray-50">
                  Outlook calendar
                </button>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6 flex items-center gap-4">
            <div className="w-32 font-medium text-gray-700">Duration</div>
            <div className="text-gray-900">30 min</div>
          </div>

          {/* Number of People */}
          {manageCapacity && (
            <div className="mb-6 flex items-center gap-4">
              <div className="w-32 font-medium text-gray-700">No of people:</div>
              <div className="text-gray-900">10</div>
            </div>
          )}

          {/* Venue */}
          <div className="mb-6 flex items-start gap-4">
            <div className="w-32 font-medium text-gray-700">Venue</div>
            <div className="text-gray-900">
              <div>Doctor's Office</div>
              <div className="text-gray-600">64 Doctor Street</div>
              <div className="text-gray-600">Springfield 380005</div>
              <div className="text-gray-600">Ahmedabad</div>
            </div>
          </div>

          {/* Confirmation Message */}
          {!manualConfirmation && (
            <div className="mt-8 rounded border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 text-sm font-medium text-gray-700">Confirmation message</div>
              <div className="text-sm text-gray-600">
                Thank you for your trust we look forward to meeting you
              </div>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleCancel}
              className="rounded border border-gray-300 bg-white px-8 py-3 text-gray-700 hover:bg-gray-50"
            >
              Cancel your appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
