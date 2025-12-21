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
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-8 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Booking Details
          </span>
        </h2>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500"></div>
              <p className="mt-4 text-gray-400">Loading questions...</p>
            </div>
          )}

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

          {!loading && !error && (
            <>
              <h3 className="mb-6 text-lg font-semibold text-white">Details</h3>

              {questions.length === 0 ? (
                <div className="mb-6 py-8 text-center text-gray-400">
                  No additional information required
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question.id}>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        {question.label}
                        {question.required && <span className="ml-1 text-red-400">*</span>}
                      </label>
                      {question.type === "textarea" ? (
                        <Textarea
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                          rows={3}
                        />
                      ) : (
                        <Input
                          type={question.type}
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswer(question.id, e.target.value)}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
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
                    "rounded-xl px-8 py-3 font-medium transition-all",
                    (allRequiredFilled || questions.length === 0)
                      ? "text-white shadow-lg hover:shadow-xl"
                      : "cursor-not-allowed text-gray-500"
                  )}
                  style={{
                    background: (allRequiredFilled || questions.length === 0)
                      ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: (allRequiredFilled || questions.length === 0)
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
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
