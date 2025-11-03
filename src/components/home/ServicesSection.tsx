import { Card } from "@/components/ui/card";
import { Zap, TrendingUp, FileText } from "lucide-react";

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

const ServicesSection = () => {
  return (
    <section className="py-24 bg-card relative" id="servicos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Serviços</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para transformar sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-xl hover-scale hover-glow transition-all bg-secondary border border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-foreground text-background rounded-lg flex items-center justify-center mb-4">
                <service.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
