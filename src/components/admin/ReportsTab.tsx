import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const initialData = [
  { mes: "Jan", clientes: 10, servicos: 15, leads: 25, faturamento: 50 },
  { mes: "Fev", clientes: 12, servicos: 18, leads: 30, faturamento: 60 },
  { mes: "Mar", clientes: 15, servicos: 22, leads: 35, faturamento: 75 },
  { mes: "Abr", clientes: 18, servicos: 25, leads: 40, faturamento: 90 },
  { mes: "Mai", clientes: 22, servicos: 30, leads: 50, faturamento: 110 },
  { mes: "Jun", clientes: 25, servicos: 35, leads: 55, faturamento: 125 },
];

const chartConfig = {
  clientes: { label: "Clientes", color: "hsl(0 0% 85%)" },
  servicos: { label: "Serviços", color: "hsl(0 0% 70%)" },
  leads: { label: "Leads", color: "hsl(0 0% 55%)" },
  faturamento: { label: "Faturamento (k)", color: "hsl(0 0% 40%)" },
};

const ReportsTab = () => {
  const [data, setData] = useState(initialData);
  const [report, setReport] = useState("");

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Relatórios</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4">Crescimento de Clientes</h3>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                  <YAxis stroke="hsl(0 0% 65%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="clientes" stroke="hsl(0 0% 85%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4">Crescimento de Serviços</h3>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                  <YAxis stroke="hsl(0 0% 65%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="servicos" fill="hsl(0 0% 70%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4">Crescimento de Leads</h3>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                  <YAxis stroke="hsl(0 0% 65%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="leads" stroke="hsl(0 0% 55%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4">Crescimento de Faturamento</h3>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                  <YAxis stroke="hsl(0 0% 65%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="faturamento" fill="hsl(0 0% 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </div>
      </div>

      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Gráfico Consolidado</h3>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
              <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
              <YAxis stroke="hsl(0 0% 65%)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="clientes" stroke="hsl(0 0% 85%)" strokeWidth={2} />
              <Line type="monotone" dataKey="servicos" stroke="hsl(0 0% 70%)" strokeWidth={2} />
              <Line type="monotone" dataKey="leads" stroke="hsl(0 0% 55%)" strokeWidth={2} />
              <Line type="monotone" dataKey="faturamento" stroke="hsl(0 0% 40%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Card>

      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Relatório Mensal</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report" className="text-foreground">Análise e Descrição</Label>
            <Textarea
              id="report"
              placeholder="Escreva sua análise mensal aqui..."
              rows={8}
              value={report}
              onChange={(e) => setReport(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            />
          </div>
          <Button className="w-full bg-foreground text-background hover:bg-muted-foreground">
            Salvar Relatório
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportsTab;
