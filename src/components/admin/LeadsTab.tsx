import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lead {
  id: string;
  empresa: string;
  nota: "Quente" | "Médio" | "Frio";
  faturamento: string;
  alcance: string;
  relatorio: string | null;
}

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(0 0% 85%)",
  },
};

const LeadsTab = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    nota: "Médio" as "Quente" | "Médio" | "Frio",
    faturamento: "",
    alcance: "",
    relatorio: "",
  });

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads_management')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar leads");
      console.error(error);
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();

    const channel = supabase
      .channel('leads_management_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads_management' },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const chartData = [
    { mes: "Jan", leads: 0 },
    { mes: "Fev", leads: 0 },
    { mes: "Mar", leads: 0 },
    { mes: "Abr", leads: 0 },
    { mes: "Mai", leads: 0 },
    { mes: "Jun", leads: 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from('leads_management')
        .update({
          empresa: formData.empresa,
          nota: formData.nota,
          faturamento: formData.faturamento,
          alcance: formData.alcance,
          relatorio: formData.relatorio || null,
        })
        .eq('id', editingId);

      if (error) {
        toast.error("Erro ao atualizar lead");
        console.error(error);
      } else {
        toast.success("Lead atualizado com sucesso!");
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from('leads_management')
        .insert([{
          empresa: formData.empresa,
          nota: formData.nota,
          faturamento: formData.faturamento,
          alcance: formData.alcance,
          relatorio: formData.relatorio || null,
        }]);

      if (error) {
        toast.error("Erro ao adicionar lead");
        console.error(error);
      } else {
        toast.success("Lead adicionado com sucesso!");
      }
    }
    setFormData({ empresa: "", nota: "Médio", faturamento: "", alcance: "", relatorio: "" });
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setFormData({ 
      empresa: lead.empresa, 
      nota: lead.nota, 
      faturamento: lead.faturamento, 
      alcance: lead.alcance, 
      relatorio: lead.relatorio || "" 
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;

    const { error } = await supabase
      .from('leads_management')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir lead");
      console.error(error);
    } else {
      toast.success("Lead excluído com sucesso!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
      
      {/* Formulário CRUD */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Editar Lead" : "Adicionar Novo Lead"}</h3>
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
              <Label htmlFor="nota">Nota do Lead</Label>
              <Select value={formData.nota} onValueChange={(value: "Quente" | "Médio" | "Frio") => setFormData({ ...formData, nota: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quente">Quente</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Frio">Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faturamento">Faturamento</Label>
              <Input
                id="faturamento"
                value={formData.faturamento}
                onChange={(e) => setFormData({ ...formData, faturamento: e.target.value })}
                placeholder="Ex: R$ 500k"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcance">Alcance</Label>
              <Input
                id="alcance"
                value={formData.alcance}
                onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
                placeholder="Ex: 10k seguidores"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatorio">Relatório do Lead</Label>
            <Textarea
              id="relatorio"
              value={formData.relatorio}
              onChange={(e) => setFormData({ ...formData, relatorio: e.target.value })}
              placeholder="Observações e anotações sobre este lead..."
              rows={4}
              className="bg-input border-border resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground">
              <Plus className="mr-2" size={16} />
              {editingId ? "Atualizar Lead" : "Adicionar Lead"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ empresa: "", nota: "Médio", faturamento: "", alcance: "", relatorio: "" });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Tabela de Leads */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Leads Recebidos</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground">Empresa</TableHead>
              <TableHead className="text-foreground">Nota</TableHead>
              <TableHead className="text-foreground">Faturamento</TableHead>
              <TableHead className="text-foreground">Alcance</TableHead>
              <TableHead className="text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium">{lead.empresa}</TableCell>
                <TableCell>
                  <Badge
                    variant={lead.nota === "Quente" ? "default" : lead.nota === "Médio" ? "secondary" : "outline"}
                    className={
                      lead.nota === "Quente"
                        ? "bg-foreground text-background"
                        : lead.nota === "Médio"
                        ? "bg-muted text-foreground"
                        : "border-border text-muted-foreground"
                    }
                  >
                    {lead.nota}
                  </Badge>
                </TableCell>
                <TableCell>{lead.faturamento}</TableCell>
                <TableCell>{lead.alcance}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => navigate(`/admin/lead/${lead.id}`)}
                      className="hover:bg-muted"
                      title="Ver detalhes"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(lead)}
                      className="hover:bg-muted"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(lead.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                      title="Excluir"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Gráfico de Evolução */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-xl font-semibold mb-4">Evolução de Leads</h3>
        <div className="w-full h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(0 0% 85%)" 
                  strokeWidth={2} 
                  dot={{ fill: "hsl(0 0% 85%)" }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default LeadsTab;
