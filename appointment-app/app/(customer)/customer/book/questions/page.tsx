"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const mockQuestions = [
  { id: "1", label: "Email", type: "email", required: true },
  { id: "2", label: "Phone number", type: "tel", required: true },
  { id: "3", label: "Symptoms", type: "textarea", required: false },
]

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const slotId = searchParams.get("slot")
  const capacity = searchParams.get("capacity")

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const isPaid = true // Mock: from appointment config

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleContinue = () => {
    const allRequiredAnswered = mockQuestions
      .filter((q) => q.required)
      .every((q) => answers[q.id]?.trim())

    if (allRequiredAnswered) {
      if (isPaid) {
        router.push(`/customer/book/payment?service=${serviceId}`)
      } else {
        router.push(`/customer/book/confirmation?service=${serviceId}`)
      }
    }
  }

  const allRequiredFilled = mockQuestions
    .filter((q) => q.required)
    .every((q) => answers[q.id]?.trim())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Heading */}
        <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
          Booking Details
        </h2>

        {/* Form Container */}
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Details</h3>

          {/* Questions Form */}
          <div className="space-y-6">
            {mockQuestions.map((question) => (
              <div key={question.id}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {question.label}
                  {question.required && <span className="ml-1 text-red-500">*</span>}
                </label>
                {question.type === "textarea" ? (
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="border-gray-300 bg-white"
                    rows={3}
                  />
                ) : (
                  <Input
                    type={question.type}
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="border-gray-300 bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Confirm Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!allRequiredFilled}
              className={cn(
                "rounded border px-8 py-3 transition-colors",
                allRequiredFilled
                  ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                  : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
              )}
            >
              {isPaid ? "Proceed to Payment" : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
