import { MarketingHeader } from "@/components/landing/MarketingHeader";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AboutSection } from "@/components/landing/AboutSection";
import { MarketingFooter } from "@/components/landing/MarketingFooter";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <AboutSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
