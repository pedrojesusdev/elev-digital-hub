import { Users, Boxes, BarChart3 } from "lucide-react";

const differentials = [
  {
    icon: Users,
    title: "Atendimento personalizado",
    description: "Cada cliente recebe uma solução sob medida",
  },
  {
    icon: Boxes,
    title: "Integração com ERPs e CRMs",
    description: "Conexão perfeita com seus sistemas existentes",
  },
  {
    icon: BarChart3,
    title: "Resultados mensuráveis",
    description: "Acompanhe o retorno de cada investimento",
  },
];

const DifferentialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Diferenciais</h2>
          <p className="text-lg text-muted-foreground">
            O que nos torna únicos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {differentials.map((item, index) => (
            <div
              key={index}
              className="text-center animate-slide-up transition-all duration-500 hover:scale-105 cursor-pointer group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-foreground transition-colors">{item.title}</h3>
              <p className="text-muted-foreground group-hover:text-foreground group-hover:drop-shadow-lg transition-all">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
