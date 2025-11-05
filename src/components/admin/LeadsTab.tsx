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
  telefone: string;
  localidade: string;
  nota: "quente" | "medio" | "frio" | null;
  faturamento_estimado: string | null;
  alcance_estimado: string | null;
  observacoes: string | null;
  tipo: "prospecto" | "lead" | "cliente";
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
      .from('leads')
      .select('*')
      .eq('tipo', 'lead')
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
      .channel('leads_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
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

  const handleConvertToClient = async (id: string) => {
    if (!confirm("Converter este lead em cliente?")) return;

    const { error } = await supabase
      .from('leads')
      .update({ tipo: 'cliente' })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao converter lead");
      console.error(error);
    } else {
      toast.success("Lead convertido em cliente!");
    }
  };

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
      
      {/* Tabela de Leads */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Leads Ativos</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground">Empresa</TableHead>
              <TableHead className="text-foreground">Telefone</TableHead>
              <TableHead className="text-foreground">Localidade</TableHead>
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
                <TableCell>{lead.telefone}</TableCell>
                <TableCell>{lead.localidade}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{lead.faturamento_estimado || "-"}</TableCell>
                <TableCell>{lead.alcance_estimado || "-"}</TableCell>
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
                      variant="default" 
                      onClick={() => handleConvertToClient(lead.id)}
                      className="bg-green-600 hover:bg-green-700"
                      title="Converter em cliente"
                    >
                      Cliente
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
