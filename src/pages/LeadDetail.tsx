import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lead {
  id: string;
  empresa: string;
  telefone: string;
  localidade: string;
  instagram: string | null;
  email: string | null;
  observacoes: string | null;
  tem_site: boolean | null;
  tipo: "prospecto" | "lead" | "cliente";
  nota: "quente" | "medio" | "frio" | null;
  faturamento_estimado: string | null;
  alcance_estimado: string | null;
  origem: string;
  status_contato: string;
  created_at: string;
}

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Erro ao carregar detalhes do lead");
        console.error(error);
        setLoading(false);
        return;
      }

      setLead(data as Lead);
      setLoading(false);
    };

    fetchLead();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lead não encontrado</h2>
          <Button onClick={() => navigate("/admin-dashboard")}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  const getNotaLabel = (nota: string | null) => {
    if (!nota) return "Não definido";
    if (nota === "quente") return "Quente";
    if (nota === "medio") return "Médio";
    if (nota === "frio") return "Frio";
    return nota;
  };

  const getNotaColor = (nota: string | null) => {
    if (nota === "quente") return "bg-green-500 text-white";
    if (nota === "medio") return "bg-yellow-500 text-white";
    if (nota === "frio") return "bg-blue-400 text-white";
    return "bg-muted text-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin-dashboard")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Informações principais do Lead */}
        <Card className="p-8 mb-8 bg-card border-border hover-glow animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lead.empresa}</h1>
              <p className="text-muted-foreground">Lead ID: {lead.id.substring(0, 8)}</p>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getNotaColor(lead.nota)}`}>
              {getNotaLabel(lead.nota)}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tipo</p>
              <Badge className={
                lead.tipo === "prospecto" ? "bg-blue-500 text-white" :
                lead.tipo === "lead" ? "bg-green-500 text-white" :
                "bg-purple-500 text-white"
              }>
                {lead.tipo}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p className="text-lg font-medium">{lead.telefone}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Localidade</p>
              <p className="text-lg font-medium">{lead.localidade}</p>
            </div>
            {lead.email && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="text-lg font-medium">{lead.email}</p>
              </div>
            )}
            {lead.instagram && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Instagram</p>
                <p className="text-lg font-medium">{lead.instagram}</p>
              </div>
            )}
            {lead.faturamento_estimado && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Faturamento Estimado</p>
                <p className="text-2xl font-bold">{lead.faturamento_estimado}</p>
              </div>
            )}
            {lead.alcance_estimado && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Alcance Estimado</p>
                <p className="text-2xl font-bold">{lead.alcance_estimado}</p>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Possui Site</p>
              <p className="text-lg font-medium">{lead.tem_site ? "Sim" : "Não"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Origem</p>
              <p className="text-lg font-medium capitalize">{lead.origem}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status de Contato</p>
              <p className="text-lg font-medium">{lead.status_contato}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Data de Cadastro</p>
              <p className="text-lg font-medium">
                {new Date(lead.created_at).toLocaleDateString('pt-BR')} às{" "}
                {new Date(lead.created_at).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          {lead.observacoes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Observações</h3>
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {lead.observacoes}
                </p>
              </div>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};

export default LeadDetail;
