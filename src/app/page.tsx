import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about";
import { FoundersSection } from "@/components/landing/founders";
import { CTASection } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <AboutSection />
        <FoundersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
