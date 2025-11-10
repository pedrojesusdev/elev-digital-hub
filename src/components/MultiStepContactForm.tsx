import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100),
  company: z.string().min(2, "Nome da empresa muito curto").max(100),
  email: z.string().email("Email inválido").max(255),
  phone: z.string().min(10, "Telefone inválido").max(20),
  location: z.string().min(2).max(100),
  instagram: z.string().max(100).optional(),
  faturamentoMensal: z.string().max(100).optional(),
  alcanceInstagram: z.string().max(100).optional(),
  message: z.string().min(10, "Mensagem muito curta").max(1000),
  hasWebsite: z.enum(["sim", "nao"]),
});

const steps = [
  { id: 1, title: "Informações Pessoais", fields: ["name", "email"] },
  { id: 2, title: "Empresa", fields: ["company", "phone"] },
  { id: 3, title: "Informações Adicionais", fields: ["faturamentoMensal", "alcanceInstagram"] },
  { id: 4, title: "Localização & Redes", fields: ["location", "instagram"] },
  { id: 5, title: "Website", fields: ["hasWebsite"] },
  { id: 6, title: "Mensagem", fields: ["message"] },
];

export function MultiStepContactForm({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    location: "",
    instagram: "",
    faturamentoMensal: "",
    alcanceInstagram: "",
    message: "",
    hasWebsite: "sim" as "sim" | "nao",
  });

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    const currentFields = steps[currentStep].fields;
    
    for (const field of currentFields) {
      const value = formData[field as keyof typeof formData];
      const optionalFields = ['instagram', 'faturamentoMensal', 'alcanceInstagram'];
      
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        if (!optionalFields.includes(field)) {
          toast.error(`Por favor, preencha o campo ${field === 'name' ? 'Nome' : 
                       field === 'email' ? 'E-mail' : 
                       field === 'company' ? 'Empresa' : 
                       field === 'phone' ? 'Telefone' : 
                       field === 'location' ? 'Localização' : 
                       field === 'message' ? 'Mensagem' : field}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validar todos os campos obrigatórios
      if (!formData.name?.trim() || !formData.company?.trim() || 
          !formData.email?.trim() || !formData.phone?.trim() || 
          !formData.location?.trim() || !formData.message?.trim()) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      const validatedData = contactFormSchema.parse(formData);

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          name: validatedData.name,
          empresa: validatedData.company,
          localidade: validatedData.location,
          telefone: validatedData.phone,
          instagram: validatedData.instagram || null,
          email: validatedData.email,
          observacoes: validatedData.message,
          tem_site: validatedData.hasWebsite === "sim",
          faturamento_mensal: validatedData.faturamentoMensal || null,
          alcance_instagram: validatedData.alcanceInstagram || null,
        },
      });

      if (error) {
        console.error("Error submitting lead:", error);
        throw error;
      }

      toast.success("Mensagem enviada com sucesso!");
      
      // Redirecionar para página de agradecimento
      window.location.href = "/obrigado";
    } catch (error) {
      console.error("Error in form submission:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Erro ao enviar mensagem. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Qual é o seu nome?</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite seu nome completo"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Qual é o seu email?</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Nome da empresa</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Digite o nome da empresa"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Telefone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Faturamento Mensal (opcional)</label>
              <Input
                value={formData.faturamentoMensal}
                onChange={(e) => setFormData({ ...formData, faturamentoMensal: e.target.value })}
                placeholder="Ex: R$ 50.000"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Alcance Instagram / Seguidores (opcional)</label>
              <Input
                value={formData.alcanceInstagram}
                onChange={(e) => setFormData({ ...formData, alcanceInstagram: e.target.value })}
                placeholder="Ex: 10.000 seguidores"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Localização</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Cidade, Estado"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Instagram (opcional)</label>
              <Input
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@seuinstagram"
                className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <label className="text-sm text-muted-foreground mb-2 block">Sua empresa possui site?</label>
            <Select
              value={formData.hasWebsite}
              onValueChange={(value: "sim" | "nao") => setFormData({ ...formData, hasWebsite: value })}
            >
              <SelectTrigger className="text-2xl h-14 bg-background/50 border-border/50 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <label className="text-sm text-muted-foreground mb-2 block">Deixe sua mensagem</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Conte-nos mais sobre seu projeto..."
              rows={6}
              className="text-lg bg-background/50 border-border/50 backdrop-blur-sm resize-none"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border/30 z-50">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header with Close and Home buttons */}
      <div className="fixed top-6 right-6 flex gap-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/'}
          className="hover:scale-105 transition-all duration-300"
        >
          Voltar para a Home
        </Button>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Passo {currentStep + 1} de {totalSteps}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  {steps[currentStep].title}
                </h2>
              </div>

              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-12">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            )}
            
            <Button
              size="lg"
              onClick={handleNext}
              disabled={isSubmitting}
              className="gap-2 ml-auto"
            >
              {currentStep === totalSteps - 1 ? (
                <>
                  {isSubmitting ? "Enviando..." : "Enviar"}
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
