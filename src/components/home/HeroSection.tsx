import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-tech-bg.jpg";

const HeroSection = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Elev Business
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            Elevando sua empresa com tecnologia e automação
          </p>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Soluções administrativas, marketing digital e automações inteligentes
            para o seu negócio
          </p>
          <a href="/contact#contato">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 text-lg px-8"
            >
              Fale conosco
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
