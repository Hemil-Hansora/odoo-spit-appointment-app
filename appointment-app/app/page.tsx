import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { number: "12", label: "Appointments", subtext: "5 Completed ✓", icon: "⭐" },
  { number: "18", label: "Services", subtext: "9 Published ✓", icon: "✏️" },
  { number: "23", label: "Providers", subtext: "11 Completed ✓", icon: "⚡" },
];

const features = [
  {
    category: "Smart Scheduling",
    color: "blue",
    title: "Real-time Availability",
    description: "Track appointments, manage slots, and monitor booking progress with intelligent scheduling.",
    link: "Explore more →",
  },
  {
    category: "Booking Management",
    color: "purple",
    title: "Professional Tasks",
    description: "Real world booking challenges that mirror industry expectations and build job-ready skills.",
    link: "Tasks →",
  },
  {
    category: "Provider Reviews",
    color: "orange",
    title: "Customer Feedback",
    description: "Give and receive constructive feedback to improve via collaborative learning.",
    link: "Code Reviews →",
  },
  {
    category: "Multi-Provider",
    color: "gray",
    title: "Team Support",
    description: "Get support from the community and manage multiple service providers efficiently.",
    link: "We vibe →",
  },
  {
    category: "Flexible Slots",
    color: "orange",
    title: "Smart Scheduling",
    description: "Learn from industry experts in live cohorts with flexible scheduling options.",
    link: "Start learning →",
  },
  {
    category: "Analytics",
    color: "teal",
    title: "Performance Insights",
    description: "We offer analytics for you to monitor your booking performance and growth.",
    link: "Udemy →",
  },
  {
    category: "Portfolio Builder",
    color: "pink",
    title: "Proof of work",
    description: "Everything you create builds a public portfolio you can proudly share with employers.",
    link: "Learn in public →",
  },
  {
    category: "Verified Providers",
    color: "green",
    title: "Peerlist Recommendation",
    description: "Get recommended by peerlist for your portfolio and stand out from crowd.",
    link: "Alumni Network →",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold">
              <span className="text-white">Book</span>
              <span className="text-orange-500">It</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            Book your <span className="text-orange-500">Appointments.</span>
            <br />
            Schedule for the Real World.
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl">
            Scheduling should be simple and rewarding. We're here to help you achieve seamless booking management.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/sign-up">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                Start your journey
              </Button>
            </Link>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 backdrop-blur"
            >
              <div className="absolute top-4 right-4 text-2xl opacity-50">{stat.icon}</div>
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm">
                <span className="text-green-500">{stat.subtext.split(" ")[0]} {stat.subtext.split(" ")[1]}</span>{" "}
                <span className="text-gray-500">{stat.subtext.split(" ").slice(2).join(" ")}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Big Stats */}
        <div className="mt-20 grid gap-8 md:grid-cols-3 text-center">
          <div>
            <div className="text-5xl font-bold">1000+</div>
            <div className="mt-2 text-gray-400">Bookings Made</div>
          </div>
          <div>
            <div className="text-5xl font-bold">500+</div>
            <div className="mt-2 text-gray-400">Providers Active</div>
          </div>
          <div>
            <div className="text-5xl font-bold">15+</div>
            <div className="mt-2 text-gray-400">Service Types</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Features</h2>
          <p className="mt-4 text-gray-400">
            Everything you need to transform booking into real-world efficiency.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-8 hover:border-gray-700 transition-all"
            >
              <Badge
                className={`mb-4 ${
                  feature.color === "blue"
                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                    : feature.color === "purple"
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    : feature.color === "orange"
                    ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    : feature.color === "teal"
                    ? "bg-teal-500/20 text-teal-400 border-teal-500/30"
                    : feature.color === "pink"
                    ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                    : feature.color === "green"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                }`}
              >
                {feature.category}
              </Badge>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <a href="#" className="text-orange-500 hover:text-orange-400 text-sm font-medium">
                {feature.link}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-orange-500/10 to-gray-900 p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their appointments efficiently with our platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg">
                Create Account
              </Button>
            </Link>
            <Link href="/customer">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 px-8 py-6 text-lg">
                Browse Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-xl font-bold mb-4">
                <span className="text-white">Book</span>
                <span className="text-orange-500">It</span>
              </div>
              <p className="text-gray-400 text-sm">
                The perfect booking system for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2025 BookIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}