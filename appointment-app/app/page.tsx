import Hero from "@/components/marketing/Hero";
import Features from "@/components/marketing/Features";
import HowItWorks from "@/components/marketing/HowItWorks";
import UseCases from "@/components/marketing/UseCases";
import FAQ from "@/components/marketing/FAQ";
import CTA from "@/components/marketing/CTA";

export default function Page() {
  return (
    <div>
      <Hero />
      <Features />
      <HowItWorks />
      <UseCases />
      <FAQ />
      <CTA />
    </div>
  );
}