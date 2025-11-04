import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pencil, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Automation {
  id: string;
  empresa: string;
  tipo: string;
  detalhes: string;
  status: "Ativa" | "Pendente" | "Finalizada";
  created_at?: string;
}

const AutomationsTab = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    tipo: "",
    detalhes: "",
    status: "Pendente" as "Ativa" | "Pendente" | "Finalizada",
  });

  const fetchAutomations = async () => {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar automatizações");
      console.error(error);
    } else {
      setAutomations((data as Automation[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAutomations();

    const channel = supabase
      .channel('automations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'automations' },
        () => {
          fetchAutomations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from('automations')
        .update({
          empresa: formData.empresa,
          tipo: formData.tipo,
          detalhes: formData.detalhes,
          status: formData.status,
        })
        .eq('id', editingId);

      if (error) {
        toast.error("Erro ao atualizar automatização");
        console.error(error);
      } else {
        toast.success("Automatização atualizada!");
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from('automations')
        .insert([{
          empresa: formData.empresa,
          tipo: formData.tipo,
          detalhes: formData.detalhes,
          status: formData.status,
        }]);

      if (error) {
        toast.error("Erro ao adicionar automatização");
        console.error(error);
      } else {
        toast.success("Automatização adicionada!");
      }
    }
    setFormData({ empresa: "", tipo: "", detalhes: "", status: "Pendente" });
  };

  const handleEdit = (automation: Automation) => {
    setEditingId(automation.id);
    setFormData({
      empresa: automation.empresa,
      tipo: automation.tipo,
      detalhes: automation.detalhes,
      status: automation.status,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta automatização?")) return;

    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir automatização");
      console.error(error);
    } else {
      toast.success("Automatização excluída!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Ativa: "bg-foreground text-background",
      Pendente: "bg-muted text-foreground",
      Finalizada: "border-border text-muted-foreground",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Automatizações</h2>
        <Button
          variant="outline"
          className="border-border hover:bg-muted"
          onClick={() => window.open("https://n8n.io", "_blank")}
        >
          <ExternalLink className="mr-2" size={16} />
          Abrir n8n
        </Button>
      </div>

      {/* Formulário CRUD */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "Editar Automação" : "Adicionar Nova Automação"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Automação</Label>
              <Input
                id="tipo"
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                placeholder="Ex: Integração CRM, Envio de emails"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "Ativa" | "Pendente" | "Finalizada") => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativa">Ativa</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detalhes">Detalhes da Automação</Label>
            <Textarea
              id="detalhes"
              value={formData.detalhes}
              onChange={(e) => setFormData({ ...formData, detalhes: e.target.value })}
              placeholder="Descreva o fluxo de automação..."
              rows={4}
              required
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground">
              <Plus className="mr-2" size={16} />
              {editingId ? "Atualizar Automação" : "Adicionar Automação"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ empresa: "", tipo: "", detalhes: "", status: "Pendente" });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Lista de Automatizações */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Automatizações Cadastradas</h3>
        <div className="space-y-3">
          {automations.map((automation) => (
            <div key={automation.id} className="p-4 bg-secondary rounded-lg border border-border hover:bg-muted/50 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-lg">{automation.empresa}</p>
                    <Badge className={getStatusBadge(automation.status)}>
                      {automation.status}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{automation.tipo}</p>
                  <p className="text-sm text-muted-foreground mt-2">{automation.detalhes}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Criado em: {automation.created_at ? new Date(automation.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(automation)}
                    className="hover:bg-muted"
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(automation.id)}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AutomationsTab;
