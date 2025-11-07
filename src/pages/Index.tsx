import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import CTASection from "@/components/home/CTASection";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <AboutSection />
      <DifferentialsSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
