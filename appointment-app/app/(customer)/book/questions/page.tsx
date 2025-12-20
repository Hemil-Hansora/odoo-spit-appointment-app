"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  label: string
  type: string
  required: boolean
}

export default function QuestionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const slotId = searchParams.get("slotId")
  const startTime = searchParams.get("startTime")
  const endTime = searchParams.get("endTime")
  const capacity = searchParams.get("capacity")
  const resourceId = searchParams.get("resourceId")

  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [advancePayment, setAdvancePayment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!serviceId) {
      setError("Service ID is required")
      setLoading(false)
      return
    }

    async function fetchServiceDetails() {
      try {
        const response = await fetch(`/api/customer/services/${serviceId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch service details")
        }
        const data = await response.json()
        setQuestions(data.questions || [])
        setAdvancePayment(data.advancePayment || false)
      } catch (err) {
        setError("Failed to load questions. Please try again later.")
        console.error("Error fetching service details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetails()
  }, [serviceId])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleContinue = () => {
    const allRequiredAnswered = questions
      .filter((q) => q.required)
      .every((q) => answers[q.id]?.trim())

    if (allRequiredAnswered) {
      const answersArray = questions
        .filter((q) => answers[q.id]?.trim())
        .map((q) => ({
          questionId: q.id,
          value: answers[q.id],
        }))

      const params = new URLSearchParams({
        service: serviceId || "",
        slotId: slotId || "",
        startTime: startTime || "",
        endTime: endTime || "",
        capacity: capacity || "1",
        answers: JSON.stringify(answersArray),
      })
      if (resourceId) params.append("resourceId", resourceId)

      if (advancePayment) {
        router.push(`/book/payment?${params.toString()}`)
      } else {
        // Skip payment and go directly to booking creation
        router.push(`/book/payment?${params.toString()}`)
      }
    }
  }

  const allRequiredFilled = questions
    .filter((q) => q.required)
    .every((q) => answers[q.id]?.trim())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
          Booking Details
        </h2>

        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          {loading && (
            <div className="py-12 text-center text-gray-600">Loading questions...</div>
          )}

          {error && (
            <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Details</h3>

              {questions.length === 0 ? (
                <div className="mb-6 py-8 text-center text-gray-600">
                  No additional information required
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
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
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinue}
                  disabled={!allRequiredFilled && questions.length > 0}
                  className={cn(
                    "rounded border px-8 py-3 transition-colors",
                    (allRequiredFilled || questions.length === 0)
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                      : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                  )}
                >
                  {advancePayment ? "Proceed to Payment" : "Confirm Booking"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
