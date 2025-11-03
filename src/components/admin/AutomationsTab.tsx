import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink } from "lucide-react";

const AutomationsTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Automatizações</h2>
        <Button
          variant="outline"
          className="border-border hover:bg-muted"
          onClick={() => window.open("https://n8n.io", "_blank")}
        >
          <ExternalLink className="mr-2" size={16} />
          Abrir n8n
        </Button>
      </div>

      <Card className="p-8 bg-card border-border hover-glow">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="empresa" className="text-foreground">Empresa</Label>
            <Input
              id="empresa"
              placeholder="Nome da empresa"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo" className="text-foreground">Tipo de Automação</Label>
            <Input
              id="tipo"
              placeholder="Ex: Integração CRM, Envio de emails, etc."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detalhes" className="text-foreground">Detalhes da Automação</Label>
            <Textarea
              id="detalhes"
              placeholder="Descreva o fluxo de automação..."
              rows={6}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>

          <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
            Salvar Automação
          </Button>
        </form>
      </Card>

      <Card className="p-6 bg-secondary border-border">
        <h3 className="text-lg font-semibold mb-4">Automatizações Recentes</h3>
        <div className="space-y-3">
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="font-medium">Tech Solutions - Integração CRM</p>
            <p className="text-sm text-muted-foreground mt-1">Criado em 15/01/2025</p>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <p className="font-medium">Digital Marketing Co - Email Marketing</p>
            <p className="text-sm text-muted-foreground mt-1">Criado em 10/01/2025</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AutomationsTab;
