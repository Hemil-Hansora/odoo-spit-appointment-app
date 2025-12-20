import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const items = [
  {
    title: "Real‑time availability",
    desc: "Live provider schedules with intelligent slot blocking. Prevent double‑bookings and always show accurate availability.",
  },
  {
    title: "Capacity management",
    desc: "Control how many customers per time slot. Perfect for group services, consultations, or limited resources.",
  },
  {
    title: "Custom workflows",
    desc: "Add pre‑booking questions, require advance payment, or set minimum notice periods — all configurable.",
  },
  {
    title: "Organiser dashboard",
    desc: "Manage services, resources, and teams from one place. Publish/unpublish bookings and track your business metrics.",
  },
  {
    title: "Customer profiles",
    desc: "Customers manage their bookings, view history, and get reminders — without needing your help.",
  },
  {
    title: "Share & embed",
    desc: "Generate shareable booking links or embed the calendar on your website. No coding required.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">Everything you need to book smarter</h2>
        <p className="mt-2 text-muted-foreground">Built for providers and customers alike</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title} className="border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-base">{i.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{i.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
