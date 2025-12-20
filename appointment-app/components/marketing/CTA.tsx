import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="rounded-lg border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold">Start accepting appointments today</h2>
        <p className="mt-2 text-muted-foreground">
          Set up your services and share booking links in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/auth/signup">
            <Button>Create account</Button>
          </Link>
          <Link href="/book/general-consultation">
            <Button variant="outline">Browse services</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
