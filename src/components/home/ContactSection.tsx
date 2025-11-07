import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  company: z.string().trim().min(1, "Empresa é obrigatória").max(200, "Nome da empresa muito longo"),
  email: z.string().trim().email("E-mail inválido").max(255, "E-mail muito longo").optional().or(z.literal("")),
  phone: z.string().trim().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20, "Telefone muito longo"),
  location: z.string().trim().min(1, "Localização é obrigatória").max(200, "Localização muito longa"),
  instagram: z.string().trim().max(100, "Instagram muito longo").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "Mensagem muito longa").optional().or(z.literal("")),
  hasSite: z.boolean(),
});

const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    instagram: "",
    hasSite: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form data with zod
      const validatedData = contactFormSchema.parse(formData);

      const { data, error } = await supabase.functions.invoke('submit-lead', {
        body: {
          empresa: validatedData.company || validatedData.name,
          localidade: validatedData.location,
          telefone: validatedData.phone,
          instagram: validatedData.instagram || null,
          email: validatedData.email || null,
          observacoes: validatedData.message || null,
          tem_site: validatedData.hasSite,
        },
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });

      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        location: "",
        message: "",
        instagram: "",
        hasSite: false,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Display validation errors to user
        const firstError = error.errors[0];
        toast({
          title: "Erro de validação",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome completo"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Nome da sua empresa"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Cidade, Estado"
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-foreground">Instagram (opcional)</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@seuinstagram"
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground">Mensagem</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Como podemos ajudar sua empresa?"
                  rows={4}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasSite" className="text-foreground">Sua empresa tem site?</Label>
                <Select 
                  value={formData.hasSite ? "sim" : "nao"} 
                  onValueChange={(value) => setFormData({ ...formData, hasSite: value === "sim" })}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-background text-foreground border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
              >
                {loading ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
