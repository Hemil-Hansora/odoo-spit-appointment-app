export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Create your account",
      desc: "Sign up in minutes. Set up your provider profile and preferences.",
    },
    {
      step: "2",
      title: "Add your services",
      desc: "Create appointment types with durations, pricing, and capacity rules.",
    },
    {
      step: "3",
      title: "Share your link",
      desc: "Generate a booking link and share it with customers via email, SMS, or website.",
    },
    {
      step: "4",
      title: "Manage bookings",
      desc: "View all appointments in your dashboard and customer profiles manage their own bookings.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">How it works</h2>
        <p className="mt-2 text-muted-foreground">Get started in just a few steps</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.step} className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
              {s.step}
            </div>
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
