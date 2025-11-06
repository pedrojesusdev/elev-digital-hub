"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Mockup, MockupFrame } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { cn } from "@/lib/utils";
import heroImage from "@/assets/hero-marketing.png";

const HeroSection = () => {
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-4",
      "fade-bottom overflow-hidden pb-0"
    )}>
      <div className="mx-auto flex max-w-7xl flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {/* Badge */}
          <Badge variant="outline" className="animate-fade-in gap-2 delay-100">
            <span className="text-muted-foreground">Novidade</span>
            <a href="/servicos" className="flex items-center gap-1">
              Conheça nossos serviços
              <ArrowRight className="h-3 w-3" />
            </a>
          </Badge>

          {/* Title */}
          <h1 className="relative z-10 inline-block animate-fade-in bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight delay-200">
            Elev Business
          </h1>

          {/* Description */}
          <p className="text-md relative z-10 max-w-[550px] animate-fade-in font-medium text-muted-foreground delay-300 sm:text-xl">
            Elevando sua empresa com tecnologia e automação. Soluções administrativas, marketing digital e automações inteligentes para o seu negócio.
          </p>

          {/* Actions */}
          <div className="relative z-10 flex animate-fade-in justify-center gap-4 delay-500">
            <Button size="lg" asChild>
              <a href="/contact" className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Fale conosco
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/servicos">
                Ver serviços
              </a>
            </Button>
          </div>

          {/* Image with Glow */}
          <div className="relative pt-12 w-full animate-fade-in delay-700">
            <MockupFrame size="small">
              <Mockup type="responsive">
                <img 
                  src={heroImage} 
                  alt="Elev Business Dashboard" 
                  className="w-full h-auto"
                />
              </Mockup>
            </MockupFrame>
            <Glow variant="top" className="animate-scale-in delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
