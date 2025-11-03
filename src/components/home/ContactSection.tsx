import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ContactSection = () => {
  return (
    <section className="py-24 bg-background" id="contato">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-lg text-muted-foreground">
              Preencha o formulário e nossa equipe entrará em contato
            </p>
          </div>

          <Card className="p-8 bg-card border-border shadow-xl hover-glow animate-scale-in">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Empresa</Label>
                <Input
                  id="company"
                  placeholder="Nome da sua empresa"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">Localização</Label>
                <Input
                  id="location"
                  placeholder="Cidade, Estado"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Mensagem</Label>
                <Textarea
                  id="message"
                  placeholder="Como podemos ajudar sua empresa?"
                  rows={4}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-background text-foreground border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  Enviar Mensagem
                </Button>
                <Button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  variant="outline"
                  className="flex-1 border-border hover:bg-muted transition-all duration-300"
                >
                  Voltar à Home
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
