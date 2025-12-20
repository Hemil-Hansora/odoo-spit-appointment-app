"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function FAQ() {
  const faqs = [
    {
      q: "How quickly can I start taking bookings?",
      a: "Within 5 minutes of signing up. Create an account, add a service, and share your booking link. That's it.",
    },
    {
      q: "Do my customers need to create an account to book?",
      a: "No. Customers can book directly from the link without signing up. They only get an account if they want to manage future bookings.",
    },
    {
      q: "Can I block times or add holidays?",
      a: "Yes. Set working hours, block time for lunch or admin, and mark days off. All in your provider settings.",
    },
    {
      q: "What payment methods do you support?",
      a: "Currently, we handle capacity and booking workflows. Payment integration is coming soon—you can still collect payments manually or use your own processor.",
    },
    {
      q: "Can customers reschedule their own bookings?",
      a: "Yes. Customers can view and reschedule their bookings from their profile. You control whether rescheduling is allowed.",
    },
    {
      q: "Is there a free trial or startup plan?",
      a: "Yes! Start free and upgrade as you grow. We offer generous free tiers for single providers and small teams.",
    },
  ];

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
        <p className="mt-2 text-muted-foreground">Got questions? We have answers</p>
      </div>
      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((faq, idx) => {
          const id = idx.toString();
          return (
            <Card
              key={id}
              className="border-border/50 cursor-pointer overflow-hidden transition-all hover:border-primary/30"
              onClick={() => setExpanded(expanded === id ? null : id)}
            >
              <div className="p-4">
                <h3 className="font-semibold text-base">{faq.q}</h3>
                {expanded === id && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
