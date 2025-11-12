import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MonthlyData {
  id: string;
  mes: string;
  clientes: number;
  servicos: number;
  leads: number;
  faturamento: number;
  analise: string;
}

const chartConfig = {
  clientes: { label: "Clientes", color: "hsl(0 0% 85%)" },
  servicos: { label: "Serviços", color: "hsl(0 0% 70%)" },
  leads: { label: "Leads", color: "hsl(0 0% 55%)" },
  faturamento: { label: "Faturamento", color: "hsl(0 0% 40%)" },
};

const ReportsTab = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mes: "",
    clientes: "",
    servicos: "",
    leads: "",
    faturamento: "",
    analise: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<MonthlyData | null>(null);

  const fetchData = async () => {
    const { data: reports, error } = await supabase
      .from('monthly_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar relatórios");
      console.error(error);
    } else {
      setData(reports || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const channel = supabase
      .channel('monthly_reports_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'monthly_reports' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('monthly_reports')
      .insert([{
        mes: formData.mes,
        clientes: parseInt(formData.clientes),
        servicos: parseInt(formData.servicos),
        leads: parseInt(formData.leads),
        faturamento: parseInt(formData.faturamento),
        analise: formData.analise,
      }]);

    if (error) {
      toast.error("Erro ao adicionar dados");
      console.error(error);
    } else {
      toast.success("Dados adicionados com sucesso!");
      setFormData({ mes: "", clientes: "", servicos: "", leads: "", faturamento: "", analise: "" });
    }
  };

  const handleEdit = (report: MonthlyData) => {
    setEditingId(report.id);
    setEditData({ ...report });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (editingId && editData) {
      const { error } = await supabase
        .from('monthly_reports')
        .update({
          mes: editData.mes,
          clientes: editData.clientes,
          servicos: editData.servicos,
          leads: editData.leads,
          faturamento: editData.faturamento,
          analise: editData.analise,
        })
        .eq('id', editingId);

      if (error) {
        toast.error("Erro ao atualizar dados");
        console.error(error);
      } else {
        toast.success("Dados atualizados com sucesso!");
        setEditingId(null);
        setEditData(null);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    const { error } = await supabase
      .from('monthly_reports')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir registro");
      console.error(error);
    } else {
      toast.success("Registro excluído com sucesso!");
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
        <Button 
          onClick={() => {
            setLoading(true);
            fetchData();
          }}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          Atualizar Dados
        </Button>
      </div>

      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Adicionar Dados e Análise Mensal</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input value={formData.mes} onChange={(e) => setFormData({ ...formData, mes: e.target.value })} placeholder="Mês" required className="bg-input border-border" />
            <Input type="number" value={formData.clientes} onChange={(e) => setFormData({ ...formData, clientes: e.target.value })} placeholder="Clientes" required className="bg-input border-border" />
            <Input type="number" value={formData.servicos} onChange={(e) => setFormData({ ...formData, servicos: e.target.value })} placeholder="Serviços" required className="bg-input border-border" />
            <Input type="number" value={formData.leads} onChange={(e) => setFormData({ ...formData, leads: e.target.value })} placeholder="Leads" required className="bg-input border-border" />
            <Input type="number" value={formData.faturamento} onChange={(e) => setFormData({ ...formData, faturamento: e.target.value })} placeholder="Faturamento" required className="bg-input border-border" />
          </div>
          <Textarea value={formData.analise} onChange={(e) => setFormData({ ...formData, analise: e.target.value })} placeholder="Análise do mês..." rows={4} className="bg-input border-border resize-none" required />
          <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground"><Plus className="mr-2" size={16} />Adicionar</Button>
        </form>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Clientes</h3>
          <div className="w-full h-[250px]">
            <ChartContainer config={{ clientes: chartConfig.clientes }} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="clientes" stroke="hsl(0 0% 85%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
        
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Faturamento</h3>
          <div className="w-full h-[250px]">
            <ChartContainer config={{ faturamento: chartConfig.faturamento }} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="hsl(0 0% 40%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Histórico de Análises</h3>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="p-4 bg-muted/50 rounded-lg border border-border">
              {editingId === item.id && editData ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-3">
                    <Input
                      value={editData.mes}
                      onChange={(e) => setEditData({ ...editData, mes: e.target.value })}
                      placeholder="Mês"
                      className="bg-input border-border"
                    />
                    <Input
                      type="number"
                      value={editData.clientes}
                      onChange={(e) => setEditData({ ...editData, clientes: parseInt(e.target.value) || 0 })}
                      placeholder="Clientes"
                      className="bg-input border-border"
                    />
                    <Input
                      type="number"
                      value={editData.servicos}
                      onChange={(e) => setEditData({ ...editData, servicos: parseInt(e.target.value) || 0 })}
                      placeholder="Serviços"
                      className="bg-input border-border"
                    />
                    <Input
                      type="number"
                      value={editData.leads}
                      onChange={(e) => setEditData({ ...editData, leads: parseInt(e.target.value) || 0 })}
                      placeholder="Leads"
                      className="bg-input border-border"
                    />
                    <Input
                      type="number"
                      value={editData.faturamento}
                      onChange={(e) => setEditData({ ...editData, faturamento: parseInt(e.target.value) || 0 })}
                      placeholder="Faturamento"
                      className="bg-input border-border"
                    />
                  </div>
                  <Textarea
                    value={editData.analise}
                    onChange={(e) => setEditData({ ...editData, analise: e.target.value })}
                    placeholder="Análise do mês..."
                    rows={3}
                    className="bg-input border-border resize-none"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit} size="sm" className="bg-foreground text-background hover:bg-muted-foreground">
                      <Check className="mr-1" size={16} />
                      Salvar
                    </Button>
                    <Button onClick={handleCancelEdit} size="sm" variant="outline">
                      <X className="mr-1" size={16} />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.mes}</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        C: {item.clientes} | S: {item.servicos} | L: {item.leads} | F: {item.faturamento}k
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(item)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.id)}
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.analise}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ReportsTab;
