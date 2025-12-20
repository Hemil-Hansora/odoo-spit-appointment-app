"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="mb-8">
        <p className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
          ✨ New
          <span className="mx-2">Appointment scheduling, simplified</span>
        </p>
      </div>
      <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl">
        Say hello to
        <span className="mx-3 inline-block rounded-lg bg-accent px-3 py-1 text-primary">
          smarter booking
        </span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        The modern scheduling platform for clinics, salons, consultants, and teams. Real‑time availability, capacity‑aware slots, and a delightful booking experience for your customers.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/auth/signup">
          <Button size="lg">Start free trial</Button>
        </Link>
        <Link href="/organiser">
          <Button size="lg" variant="outline">See features</Button>
        </Link>
      </div>
      <div className="mt-12 flex flex-wrap gap-8 text-sm">
        <div>
          <p className="text-2xl font-bold text-primary">10k+</p>
          <p className="text-muted-foreground">Bookings per month</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">500+</p>
          <p className="text-muted-foreground">Active providers</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-primary">99%</p>
          <p className="text-muted-foreground">Uptime guarantee</p>
        </div>
      </div>
    </section>
  );
}
