import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Lead {
  id: string;
  empresa: string;
  telefone: string;
  localidade: string;
  nota: "quente" | "medio" | "frio" | null;
  faturamento_estimado: string | null;
  alcance_estimado: string | null;
  faturamento_mensal: string | null;
  alcance_instagram: string | null;
  observacoes: string | null;
  tipo: "prospecto" | "lead" | "cliente";
  status_contato: "Leads" | "Conseguiu contato" | "Marcou reunião" | "Proposta enviada" | "Aguardando fechamento" | "Fechado";
  email: string | null;
  instagram: string | null;
  created_at: string;
  updated_at: string;
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
  const [monthlyLeadsCount, setMonthlyLeadsCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterData, setFilterData] = useState<string>("all");

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from('leads')
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

  const fetchMonthlyLeads = async () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from('leads')
      .select('id, created_at')
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth);

    if (error) {
      console.error("Erro ao carregar leads do mês:", error);
    } else {
      setMonthlyLeadsCount(data?.length || 0);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchMonthlyLeads();

    const channel = supabase
      .channel('leads_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          fetchLeads();
          fetchMonthlyLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'short' })
    .replace('.', '')
    .charAt(0).toUpperCase() + new Date().toLocaleDateString('pt-BR', { month: 'short' }).slice(1, 3);

  const chartData = [
    { mes: currentMonthName, leads: monthlyLeadsCount },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir lead");
      console.error(error);
    } else {
      toast.success("Lead excluído com sucesso!");
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filterStatus !== "all" && lead.status_contato !== filterStatus) return false;
    if (filterData === "month") {
      const now = new Date();
      const leadDate = new Date(lead.created_at);
      if (leadDate.getMonth() !== now.getMonth() || leadDate.getFullYear() !== now.getFullYear()) return false;
    } else if (filterData === "week") {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const leadDate = new Date(lead.created_at);
      if (leadDate < weekAgo) return false;
    }
    return true;
  });

  const statusCounts = {
    total: leads.length,
    leads: leads.filter(l => l.status_contato === "Leads").length,
    contato: leads.filter(l => l.status_contato === "Conseguiu contato").length,
    reuniao: leads.filter(l => l.status_contato === "Marcou reunião").length,
    proposta: leads.filter(l => l.status_contato === "Proposta enviada").length,
    aguardando: leads.filter(l => l.status_contato === "Aguardando fechamento").length,
    fechado: leads.filter(l => l.status_contato === "Fechado").length,
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
      <h2 className="text-2xl font-bold">Dashboard de Leads</h2>
      
      {/* Estatísticas por Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold">{statusCounts.total}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Leads</p>
          <p className="text-2xl font-bold">{statusCounts.leads}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Com Contato</p>
          <p className="text-2xl font-bold">{statusCounts.contato}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Reunião</p>
          <p className="text-2xl font-bold">{statusCounts.reuniao}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Proposta</p>
          <p className="text-2xl font-bold">{statusCounts.proposta}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Aguardando</p>
          <p className="text-2xl font-bold">{statusCounts.aguardando}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Fechado</p>
          <p className="text-2xl font-bold text-green-600">{statusCounts.fechado}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4 bg-card border-border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label>Status do Contato</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Leads">Leads</SelectItem>
                <SelectItem value="Conseguiu contato">Conseguiu contato</SelectItem>
                <SelectItem value="Marcou reunião">Marcou reunião</SelectItem>
                <SelectItem value="Proposta enviada">Proposta enviada</SelectItem>
                <SelectItem value="Aguardando fechamento">Aguardando fechamento</SelectItem>
                <SelectItem value="Fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label>Período</Label>
            <Select value={filterData} onValueChange={setFilterData}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      
      {/* Tabela de Leads */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Todos os Leads ({filteredLeads.length})</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-foreground">Empresa</TableHead>
                <TableHead className="text-foreground">E-mail / Telefone</TableHead>
                <TableHead className="text-foreground">Localidade</TableHead>
                <TableHead className="text-foreground">Tipo</TableHead>
                <TableHead className="text-foreground">Status do Contato</TableHead>
                <TableHead className="text-foreground">Nota</TableHead>
                <TableHead className="text-foreground">Data de Entrada</TableHead>
                <TableHead className="text-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                  <TableCell className="font-medium">{lead.empresa}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {lead.email && <p>{lead.email}</p>}
                      <p>{lead.telefone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{lead.localidade}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      lead.tipo === "prospecto" ? "bg-blue-500 text-white" :
                      lead.tipo === "lead" ? "bg-green-500 text-white" :
                      "bg-purple-500 text-white"
                    }>
                      {lead.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {lead.status_contato}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.nota && (
                      <Badge
                        variant={lead.nota === "quente" ? "default" : lead.nota === "medio" ? "secondary" : "outline"}
                        className={
                          lead.nota === "quente"
                            ? "bg-green-500 text-white"
                            : lead.nota === "medio"
                            ? "bg-yellow-500 text-white"
                            : "bg-blue-400 text-white"
                        }
                      >
                        {lead.nota === "quente" ? "Quente" : lead.nota === "medio" ? "Médio" : "Frio"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
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
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum lead encontrado com os filtros selecionados.
          </div>
        )}
      </Card>

      {/* Gráfico de Leads do Mês */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Leads Adquiridos Este Mês</h3>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="mes" 
                stroke="hsl(var(--foreground))"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis 
                stroke="hsl(var(--foreground))"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>
    </div>
  );
};

export default LeadsTab;
