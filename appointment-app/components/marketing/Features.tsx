import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const items = [
  {
    title: "Real‑time slots",
    desc: "Live provider schedules with capacity aware booking to prevent double‑booking.",
  },
  {
    title: "Organiser tools",
    desc: "Publish/unpublish services, manage resources, and share booking links easily.",
  },
  {
    title: "Customer friendly",
    desc: "Clean forms, reminders, and a profile area to manage upcoming appointments.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title} className="">
            <CardHeader>
              <CardTitle className="text-lg">{i.title}</CardTitle>
              <CardDescription>{i.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
