import { Card } from "@/components/ui/card";
import { Zap, TrendingUp, FileText } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Zap,
    title: "Criação de sites",
    description:
      "Sites modernos e responsivos com design personalizado e otimizado para conversão.",
  },
  {
    icon: FileText,
    title: "Criação de landing pages",
    description:
      "Páginas de alta conversão focadas em capturar leads e gerar resultados.",
  },
  {
    icon: TrendingUp,
    title: "Automação de processos",
    description:
      "Integramos ferramentas e sistemas para otimizar tarefas repetitivas e aumentar eficiência.",
  },
  {
    icon: TrendingUp,
    title: "Estratégias digitais e relatórios",
    description:
      "Análise de desempenho, métricas e estratégias para crescimento digital sustentável.",
  },
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="p-6 h-full hover:shadow-xl hover:scale-105 transition-all duration-300 bg-secondary border border-border cursor-pointer group">
        <div className="w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <service.icon size={24} />
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-foreground transition-colors">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground group-hover:drop-shadow-md transition-all">
          {service.description}
        </p>
      </Card>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section className="py-24 bg-card relative" id="servicos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up transition-all duration-500 hover:scale-105 cursor-pointer group">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 group-hover:text-foreground transition-colors">
            Serviços
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto group-hover:text-foreground group-hover:drop-shadow-lg transition-all">
            Soluções completas para transformar sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
