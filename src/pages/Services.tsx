import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SplineScene } from "@/components/ui/spline-scene";
import { Spotlight } from "@/components/ui/spotlight";
import { TrendingUp, Bot, FileText, Target, Globe, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/#contato');
    setTimeout(() => {
      const element = document.getElementById('contato');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      
      {/* Hero with Spline */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black/[0.96]">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        
        <div className="flex h-full w-full max-w-7xl mx-auto px-4">
          {/* Left content */}
          <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                Nossos Serviços
              </h1>
              <p className="mt-6 text-neutral-300 text-xl md:text-2xl max-w-lg">
                Soluções completas para transformar sua empresa digitalmente com tecnologia de ponta
              </p>
            </motion.div>
          </div>

          {/* Right content - 3D Scene */}
          <div className="flex-1 relative">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-card relative">
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
                <Card className="p-8 h-full bg-background/50 backdrop-blur-md border-border/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group flex flex-col">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon size={32} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleContactClick}
                    className="w-full group mt-auto"
                  >
                    Entrar em Contato
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
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
