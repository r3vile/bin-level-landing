import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import ResultsSection from "@/components/ResultsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const ScrollGlow = dynamic(() => import("@/components/three/ScrollGlow"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <ScrollGlow />
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ResultsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
