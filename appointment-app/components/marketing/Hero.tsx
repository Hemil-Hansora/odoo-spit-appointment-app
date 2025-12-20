"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
        New
        <span className="mx-2">Appointment system that works the way you do</span>
      </p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        Say hello to
        <span className="mx-2 rounded-md bg-accent px-2 py-1 text-primary">
          smarter booking
        </span>
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        A modern scheduling platform for services, clinics and teams. Real‑time availability, capacity aware slots, and
        clean, professional UI built with shadcn.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/auth/signup">
          <Button className="">Try for free</Button>
        </Link>
        <Link href="/organiser">
          <Button variant="outline">Get a demo</Button>
        </Link>
      </div>
    </section>
  );
}
