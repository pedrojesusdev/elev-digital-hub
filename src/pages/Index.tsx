import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import CTASection from "@/components/home/CTASection";
import { AnimatedSection } from "@/components/home/AnimatedSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <AnimatedSection animation="fadeIn" delay={100}>
        <AboutSection />
      </AnimatedSection>
      <AnimatedSection animation="slideUp" delay={200}>
        <DifferentialsSection />
      </AnimatedSection>
      <AnimatedSection animation="scale" delay={100}>
        <CTASection />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default Index;
