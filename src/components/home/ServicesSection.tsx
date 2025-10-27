import { Card } from "@/components/ui/card";
import { Zap, TrendingUp, FileText } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "Automação de processos",
    description:
      "Integramos ferramentas e sistemas para otimizar tarefas repetitivas.",
  },
  {
    icon: TrendingUp,
    title: "Marketing digital",
    description:
      "Estratégias de tráfego pago, redes sociais e posicionamento de marca.",
  },
  {
    icon: FileText,
    title: "Soluções administrativas",
    description:
      "Organização financeira, relatórios e planejamento operacional.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-24 bg-secondary" id="servicos">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Serviços</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções completas para transformar sua empresa
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="p-8 hover:shadow-lg transition-shadow bg-card border-border animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-6">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
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
