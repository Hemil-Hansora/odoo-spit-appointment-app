"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PaymentMethod = "credit" | "debit" | "upi" | "paypal"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("service")

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit")
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  })

  const handlePayment = () => {
    // Mock payment processing
    router.push(`/customer/book/confirmation?service=${serviceId}&paid=true`)
  }

  const isFormValid = 
    cardDetails.name.trim() &&
    cardDetails.number.trim() &&
    cardDetails.expiry.trim() &&
    cardDetails.cvv.trim()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
          Payment
        </h2>

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
                      <label className="mb-2 block text-sm font-medium text-gray-700">Name on Card</label>
                      <Input
                        placeholder="Placeholder"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                        className="border-gray-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">Card Number</label>
                      <Input
                        placeholder="•••• •••• •••• ••••"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                        className="border-gray-300 bg-white"
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Expiration Date</label>
                        <Input
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="border-gray-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Security Code</label>
                        <Input
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="border-gray-300 bg-white"
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

                {/* PayPal */}
                <label className="flex items-center gap-3 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="h-4 w-4 border-gray-300"
                  />
                  Paypal
                </label>
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
                  disabled={!isFormValid}
                  className={cn(
                    "mt-6 w-full rounded border py-3 transition-colors",
                    isFormValid
                      ? "border-gray-900 bg-gray-900 text-white hover:bg-gray-800"
                      : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                  )}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
