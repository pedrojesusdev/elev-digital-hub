import brandingImage from "@/assets/branding-image.png";
import teamPhoto from "@/assets/team-photo.jpg";
import { AnimatedSection } from "./AnimatedSection";

const AboutSection = () => {
  return (
    <section className="py-24 bg-background" id="sobre">
      <div className="container mx-auto px-4 max-w-6xl space-y-24">
        {/* Sobre nós - Imagem e Título no topo */}
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <AnimatedSection animation="slideRight" delay={100}>
              <div className="relative">
                <img 
                  src={teamPhoto} 
                  alt="Equipe Elev Business - Parceiros estratégicos da sua empresa" 
                  className="w-full h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl pointer-events-none" />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="slideLeft" delay={200}>
              <div className="flex items-center h-full">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Sobre nós
                </h2>
              </div>
            </AnimatedSection>
          </div>

          {/* Texto abaixo */}
          <AnimatedSection animation="fadeIn" delay={300}>
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                A Elev Business nasceu da visão de que toda empresa, 
                independentemente do seu tamanho, merece ter acesso a 
                tecnologia de ponta e estratégias eficientes de marketing digital.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Somos especialistas em transformar ideias em resultados concretos. 
                Nossa equipe une expertise técnica com criatividade estratégica 
                para criar soluções que realmente fazem a diferença no dia a dia 
                das empresas.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Acreditamos que crescimento sustentável vem da combinação perfeita 
                entre automação inteligente, design impactante e estratégia bem 
                estruturada. Por isso, oferecemos um ecossistema completo de 
                serviços integrados.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* O Poder do Branding */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="slideRight" delay={100}>
            <div className="border-l-4 border-primary pl-6 space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                O Poder do Branding
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Se a sua marca sumisse hoje, alguém sentiria falta dela? 
                Essa é a pergunta que deve guiar toda estratégia de branding.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Construímos marcas memoráveis que criam conexão emocional com 
                seu público. Não é apenas sobre ter um logo bonito - é sobre 
                criar uma identidade que comunica valores, gera reconhecimento 
                e constrói lealdade.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Uma marca forte é um ativo valioso que diferencia você da 
                concorrência e justifica suas escolhas no mercado.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slideLeft" delay={200}>
            <img 
              src={brandingImage} 
              alt="Branding - Se a sua marca sumisse hoje, alguém sentiria falta dela?" 
              className="w-full h-auto rounded-xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
