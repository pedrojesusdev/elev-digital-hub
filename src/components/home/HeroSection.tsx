"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate title on mount
    if (titleRef.current) {
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.opacity = '1';
          titleRef.current.style.transform = 'translateY(0) scale(1)';
        }
      }, 100);
    }

    // Parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroRef.current.style.opacity = `${Math.max(0, 1 - scrolled / 800)}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={cn(
      "relative bg-background text-foreground overflow-hidden",
      "min-h-screen flex items-center justify-center"
    )}>
      {/* Animated background particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-foreground/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

      <div ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:py-32 transition-all duration-300">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Badge with animation */}
          <Badge 
            variant="outline" 
            className="animate-fade-in gap-2 delay-100 hover:scale-110 transition-transform duration-300"
          >
            <span className="text-muted-foreground">Novidade</span>
            <a href="/servicos" className="flex items-center gap-1">
              Conheça nossos serviços
              <ArrowRight className="h-3 w-3" />
            </a>
          </Badge>

          {/* Main title with dynamic animation */}
          <h1 
            ref={titleRef}
            className={cn(
              "text-5xl sm:text-7xl md:text-9xl font-bold",
              "bg-gradient-to-r from-foreground via-muted-foreground to-foreground",
              "bg-clip-text text-transparent",
              "drop-shadow-2xl",
              "leading-tight transition-all duration-1000 ease-out"
            )}
            style={{ 
              opacity: 0,
              transform: 'translateY(50px) scale(0.9)'
            }}
          >
            Elev Business
          </h1>

          {/* Subtitle with stagger animation */}
          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl text-muted-foreground font-light animate-fade-in delay-300">
            Elevando sua empresa com tecnologia e automação. 
            <span className="block mt-2">
              Soluções administrativas, marketing digital e automações inteligentes.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in delay-500">
            <Button size="lg" className="group" asChild>
              <Link to="/contato-novo">
                Fale conosco
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/servicos">
                Ver serviços
              </Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-fade-in delay-700">
            <Button 
              variant="ghost"
              onClick={() => {
                const element = document.getElementById('sobre');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-muted-foreground hover:text-foreground group"
            >
              Saiba Mais
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
