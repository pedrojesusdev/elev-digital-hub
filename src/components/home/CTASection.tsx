import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import operacaoImage from "@/assets/operacao-vr.png";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="animate-fade-in order-2 md:order-1">
            <img 
              src={operacaoImage} 
              alt="Quando a operação flui, a mente do líder respira - Elev Business" 
              className="w-full h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="text-center md:text-left animate-fade-in order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Vamos elevar o nível da sua empresa?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Comece sua transformação digital agora
            </p>
            <a href="/contact">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 group"
              >
                Solicitar contato
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
