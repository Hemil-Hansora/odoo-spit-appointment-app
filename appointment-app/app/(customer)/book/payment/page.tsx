"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PaymentMethod = "credit" | "debit" | "upi"

interface ServiceData {
  title: string
  price: number
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")
  const slotId = searchParams.get("slotId")
  const startTime = searchParams.get("startTime")
  const endTime = searchParams.get("endTime")
  const capacity = searchParams.get("capacity")
  const resourceId = searchParams.get("resourceId")
  const answersJson = searchParams.get("answers")

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit")
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  })
  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
  })
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [serviceData, setServiceData] = useState<ServiceData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch service details to get price
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
        setServiceData({
          title: data.title,
          price: data.price || 0,
        })
      } catch (err) {
        console.error("Error fetching service:", err)
        setError("Failed to load service details")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetails()
  }, [serviceId])

  const handlePayment = async () => {
    try {
      setProcessing(true)
      setError("")

      const answers = answersJson ? JSON.parse(answersJson) : []

      // Extract guest email and name from answers
      const emailAnswer = answers.find((a: any) =>
        a.value.includes("@")
      )
      const guestEmail = emailAnswer?.value || ""
      const guestName = cardDetails.name || "Guest User"

      const response = await fetch("/api/customer/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          slotId,
          startTime,
          endTime,
          resourceId: resourceId || undefined,
          answers,
          capacity: parseInt(capacity || "1", 10),
          guestEmail,
          guestName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      const data = await response.json()
      router.push(`/book/confirmation?bookingId=${data.bookingId}`)
    } catch (err: any) {
      setError(err.message || "Failed to process booking. Please try again.")
      console.error("Error creating booking:", err)
    } finally {
      setProcessing(false)
    }
  }

  const isFormValid =
    paymentMethod === "upi"
      ? upiDetails.upiId.trim()
      : cardDetails.name.trim() &&
        cardDetails.number.trim() &&
        cardDetails.expiry.trim() &&
        cardDetails.cvv.trim()

  // Calculate pricing
  const subtotal = serviceData?.price || 0
  const taxRate = 0.10 // 10% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            Complete Your Booking
          </span>
        </h2>

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

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        ) : (

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Payment Methods */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-white">
                Choose a payment method
              </h3>

              <div className="space-y-4">
                {/* Credit Card */}
                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={() => setPaymentMethod("credit")}
                    className="h-4 w-4"
                  />
                  Credit Card
                </label>

                {paymentMethod === "credit" && (
                  <div
                    className="ml-7 space-y-4 rounded-2xl p-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        Name on Card <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="border-0 text-white placeholder:text-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        Card Number <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="border-0 text-white placeholder:text-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                          Expiration Date <span className="text-red-400">*</span>
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                          Security Code <span className="text-red-400">*</span>
                        </label>
                        <Input
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Debit Card */}
                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    type="radio"
                    name="payment"
                    value="debit"
                    checked={paymentMethod === "debit"}
                    onChange={() => setPaymentMethod("debit")}
                    className="h-4 w-4"
                  />
                  Debit Card
                </label>

                {paymentMethod === "debit" && (
                  <div
                    className="ml-7 space-y-4 rounded-2xl p-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        Name on Card <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="border-0 text-white placeholder:text-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        Card Number <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="border-0 text-white placeholder:text-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                          Expiration Date <span className="text-red-400">*</span>
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-400">
                          Security Code <span className="text-red-400">*</span>
                        </label>
                        <Input
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-0 text-white placeholder:text-gray-500"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)'
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Pay */}
                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="h-4 w-4"
                  />
                  UPI Pay
                </label>

                {paymentMethod === "upi" && (
                  <div
                    className="ml-7 space-y-4 rounded-2xl p-4"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-400">
                        UPI ID <span className="text-red-400">*</span>
                      </label>
                      <Input
                        placeholder="yourname@upi"
                        value={upiDetails.upiId}
                        onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                        className="border-0 text-white placeholder:text-gray-500"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)'
                        }}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <h3 className="mb-6 text-lg font-semibold text-white">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{serviceData?.title || "Service"}</span>
                  <span className="text-white">₹{subtotal.toFixed(2)}</span>
                </div>

                <div style={{borderTop: '1px solid rgba(255, 255, 255, 0.1)'}} className="pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-400">Taxes (10%)</span>
                    <span className="text-white">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div style={{borderTop: '1px solid rgba(255, 255, 255, 0.1)'}} className="pt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!isFormValid || processing}
                  className={cn(
                    "mt-6 w-full rounded-xl py-3 font-medium transition-all",
                    isFormValid && !processing
                      ? "text-white shadow-lg hover:shadow-xl"
                      : "cursor-not-allowed text-gray-500"
                  )}
                  style={{
                    background: isFormValid && !processing
                      ? 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(147, 51, 234) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isFormValid && !processing
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {processing ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
