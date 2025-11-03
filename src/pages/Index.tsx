import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";

import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <DifferentialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
