import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SplineScene } from "@/components/ui/spline-scene";
import { TrendingUp, Bot, FileText, Target, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    icon: Target,
    title: "Estratégias e Planejamento de Marketing",
    description: "Definição de posicionamento, identidade estratégica, funis e direcionamento comercial.",
    features: [
      "Análise de mercado e concorrência",
      "Definição de personas e jornada do cliente",
      "Planejamento de campanhas integradas",
      "KPIs e métricas de sucesso"
    ]
  },
  {
    icon: Bot,
    title: "Automação de Processos com IA",
    description: "Construção de fluxos automatizados, integrações, agentes inteligentes e otimização de atendimento.",
    features: [
      "Chatbots e assistentes virtuais",
      "Automação de workflows",
      "Integrações entre sistemas",
      "Análise preditiva com IA"
    ]
  },
  {
    icon: FileText,
    title: "Criação de Landing Pages",
    description: "Páginas otimizadas para conversão, copywriting técnico, design responsivo e integração com anúncios.",
    features: [
      "Design focado em conversão",
      "Copywriting persuasivo",
      "Integração com ferramentas de marketing",
      "Testes A/B e otimização contínua"
    ]
  },
  {
    icon: TrendingUp,
    title: "Gestão de Tráfego Pago",
    description: "Operação de campanhas Google/Meta, otimização de CPA/CTR/ROI e dashboards de acompanhamento.",
    features: [
      "Campanhas Google Ads e Meta Ads",
      "Otimização de budget e lances",
      "Relatórios detalhados de performance",
      "Remarketing e lookalike audiences"
    ]
  },
  {
    icon: Globe,
    title: "Criação de Sites",
    description: "Desenvolvimento completo com arquitetura, UI/UX, SEO e alta performance.",
    features: [
      "Design responsivo e moderno",
      "Otimização para SEO",
      "Performance e velocidade",
      "Manutenção e suporte contínuo"
    ]
  }
];

const Services = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      
      {/* Hero with Spline */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SplineScene 
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Nossos Serviços
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Soluções completas para transformar sua empresa digitalmente
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full bg-background/50 backdrop-blur-md border-border/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
