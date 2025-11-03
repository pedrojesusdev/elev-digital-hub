import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Vamos elevar o nível da sua empresa?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Comece sua transformação digital agora
          </p>
          <a href="/contact#contato">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8"
            >
              Solicitar contato
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
