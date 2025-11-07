import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-background">
      <Navbar />
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          <Card className="p-8 md:p-12">
            <div className="space-y-8 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  1. Introdução
                </h2>
                <p className="leading-relaxed">
                  A Elev Business está comprometida em proteger a privacidade e segurança dos dados pessoais 
                  de nossos clientes e visitantes. Esta Política de Privacidade descreve como coletamos, 
                  usamos, armazenamos e protegemos suas informações pessoais.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  2. Informações Coletadas
                </h2>
                <p className="leading-relaxed mb-3">
                  Coletamos as seguintes informações quando você utiliza nossos serviços:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone</li>
                  <li>Nome da empresa</li>
                  <li>Localidade</li>
                  <li>Perfil do Instagram (opcional)</li>
                  <li>Informações sobre o site da empresa</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  3. Uso das Informações
                </h2>
                <p className="leading-relaxed mb-3">
                  Utilizamos suas informações pessoais para:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Entrar em contato e responder às suas solicitações</li>
                  <li>Fornecer nossos serviços de forma eficiente</li>
                  <li>Enviar informações sobre nossos produtos e serviços</li>
                  <li>Melhorar a experiência do usuário em nossa plataforma</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  4. Compartilhamento de Dados
                </h2>
                <p className="leading-relaxed">
                  A Elev Business não vende, aluga ou compartilha suas informações pessoais com terceiros, 
                  exceto quando necessário para a prestação de nossos serviços ou quando exigido por lei. 
                  Podemos compartilhar dados com parceiros de confiança que nos auxiliam na operação de 
                  nossos serviços, sempre mantendo padrões rigorosos de confidencialidade.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  5. Segurança dos Dados
                </h2>
                <p className="leading-relaxed">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações 
                  pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Utilizamos 
                  criptografia, controles de acesso e outros procedimentos de segurança para garantir a 
                  proteção de seus dados.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  6. Seus Direitos
                </h2>
                <p className="leading-relaxed mb-3">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                  <li>Solicitar a exclusão de seus dados pessoais</li>
                  <li>Revogar o consentimento para o uso de seus dados</li>
                  <li>Solicitar a portabilidade de seus dados</li>
                  <li>Obter informações sobre o compartilhamento de seus dados</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  7. Cookies
                </h2>
                <p className="leading-relaxed">
                  Nosso site utiliza cookies para melhorar sua experiência de navegação. Cookies são 
                  pequenos arquivos de texto armazenados em seu dispositivo que nos ajudam a entender 
                  como você usa nosso site e personalizar sua experiência. Você pode configurar seu 
                  navegador para recusar cookies, mas isso pode afetar algumas funcionalidades do site.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  8. Alterações na Política
                </h2>
                <p className="leading-relaxed">
                  Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. 
                  Quaisquer alterações serão publicadas nesta página com a data de atualização revisada. 
                  Recomendamos que você revise esta política regularmente para se manter informado sobre 
                  como estamos protegendo suas informações.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">
                  9. Contato
                </h2>
                <p className="leading-relaxed">
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus 
                  dados pessoais, entre em contato conosco através de nosso formulário de contato ou pelos 
                  canais disponibilizados em nosso site.
                </p>
              </section>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex-1 group"
              >
                <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={18} />
                Voltar ao Início
              </Button>
              <Button
                onClick={() => navigate("/contact")}
                className="flex-1 group"
              >
                <Mail className="mr-2" size={18} />
                Entre em Contato
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
