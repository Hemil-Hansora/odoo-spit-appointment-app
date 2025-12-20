import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UseCases() {
  const cases = [
    {
      industry: "Medical & Clinics",
      desc: "Doctor's offices, dentists, therapists use it to manage patient appointments without booking staff.",
      example: "Dermatology clinic managing 50+ patient slots per day",
    },
    {
      industry: "Salons & Spas",
      desc: "Hair salons, nail studios, massage spas reduce no-shows with reminders and online bookings.",
      example: "Beauty salon handling 30+ bookings per day across 5 providers",
    },
    {
      industry: "Fitness & Coaching",
      desc: "Personal trainers, yoga instructors, coaches sell classes and 1-on-1 sessions with ease.",
      example: "Online coach managing 25 client sessions across timezones",
    },
    {
      industry: "Professional Services",
      desc: "Consultants, lawyers, accountants schedule client meetings and consultations instantly.",
      example: "Consulting firm booking 40+ client calls per month",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">Built for every type of service</h2>
        <p className="mt-2 text-muted-foreground">From healthcare to wellness, consulting to coaching</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.industry} className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{c.industry}</CardTitle>
              <CardDescription className="mt-2 text-sm leading-relaxed">{c.desc}</CardDescription>
              <p className="mt-3 text-xs font-medium text-primary">
                Example: {c.example}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
