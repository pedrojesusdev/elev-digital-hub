import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Plus } from "lucide-react";

interface MonthlyData {
  mes: string;
  clientes: number;
  servicos: number;
  leads: number;
  faturamento: number;
}

const chartConfig = {
  clientes: { label: "Clientes", color: "hsl(0 0% 85%)" },
  servicos: { label: "Serviços", color: "hsl(0 0% 70%)" },
  leads: { label: "Leads", color: "hsl(0 0% 55%)" },
  faturamento: { label: "Faturamento", color: "hsl(0 0% 40%)" },
};

const ReportsTab = () => {
  const [data, setData] = useState<MonthlyData[]>([
    { mes: "Jan", clientes: 10, servicos: 15, leads: 30, faturamento: 50 },
    { mes: "Fev", clientes: 15, servicos: 20, leads: 45, faturamento: 75 },
    { mes: "Mar", clientes: 18, servicos: 25, leads: 50, faturamento: 90 },
    { mes: "Abr", clientes: 22, servicos: 30, leads: 60, faturamento: 110 },
    { mes: "Mai", clientes: 28, servicos: 35, leads: 70, faturamento: 140 },
    { mes: "Jun", clientes: 35, servicos: 42, leads: 85, faturamento: 180 },
  ]);

  const [formData, setFormData] = useState({
    mes: "",
    clientes: "",
    servicos: "",
    leads: "",
    faturamento: "",
  });

  const [analise, setAnalise] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newData: MonthlyData = {
      mes: formData.mes,
      clientes: parseInt(formData.clientes),
      servicos: parseInt(formData.servicos),
      leads: parseInt(formData.leads),
      faturamento: parseInt(formData.faturamento),
    };
    setData([...data, newData]);
    setFormData({ mes: "", clientes: "", servicos: "", leads: "", faturamento: "" });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Relatórios e Análises</h2>

      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Adicionar Dados Mensais</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Input value={formData.mes} onChange={(e) => setFormData({ ...formData, mes: e.target.value })} placeholder="Mês" required className="bg-input border-border" />
            <Input type="number" value={formData.clientes} onChange={(e) => setFormData({ ...formData, clientes: e.target.value })} placeholder="Clientes" required className="bg-input border-border" />
            <Input type="number" value={formData.servicos} onChange={(e) => setFormData({ ...formData, servicos: e.target.value })} placeholder="Serviços" required className="bg-input border-border" />
            <Input type="number" value={formData.leads} onChange={(e) => setFormData({ ...formData, leads: e.target.value })} placeholder="Leads" required className="bg-input border-border" />
            <Input type="number" value={formData.faturamento} onChange={(e) => setFormData({ ...formData, faturamento: e.target.value })} placeholder="Faturamento" required className="bg-input border-border" />
          </div>
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
        <h3 className="text-lg font-semibold mb-4">Análise Mensal</h3>
        <Textarea value={analise} onChange={(e) => setAnalise(e.target.value)} placeholder="Escreva sua análise mensal..." rows={6} className="bg-input border-border resize-none mb-4" />
        <Button className="bg-foreground text-background hover:bg-muted-foreground">Salvar Análise</Button>
      </Card>
    </div>
  );
};

export default ReportsTab;
