"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PaymentMethod = "credit" | "debit" | "upi"

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
          Complete Your Booking
        </h2>

        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-center text-red-600">
            {error}
          </div>
        )}

        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Payment Methods */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Choose a payment method
              </h3>

              <div className="space-y-4">
                {/* Credit Card */}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={() => setPaymentMethod("credit")}
                    className="h-4 w-4 border-gray-300"
                  />
                  Credit Card
                </label>

                {paymentMethod === "credit" && (
                  <div className="ml-7 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name on Card <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="border-gray-300 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Security Code <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-gray-300 bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Debit Card */}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="debit"
                    checked={paymentMethod === "debit"}
                    onChange={() => setPaymentMethod("debit")}
                    className="h-4 w-4 border-gray-300"
                  />
                  Debit Card
                </label>

                {paymentMethod === "debit" && (
                  <div className="ml-7 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Name on Card <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="John Doe"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Card Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="border-gray-300 bg-white"
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Expiration Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="border-gray-300 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Security Code <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-gray-300 bg-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Pay */}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={() => setPaymentMethod("upi")}
                    className="h-4 w-4 border-gray-300"
                  />
                  UPI Pay
                </label>

                {paymentMethod === "upi" && (
                  <div className="ml-7 space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        UPI ID <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="yourname@upi"
                        value={upiDetails.upiId}
                        onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                        className="border-gray-300 bg-white"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dental care</span>
                  <span className="text-gray-900">1000</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">1000</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-900">100</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">1100</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!isFormValid || processing}
                  className={cn(
                    "mt-6 w-full rounded border py-3 transition-colors",
                    isFormValid && !processing
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                      : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                  )}
                >
                  {processing ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
