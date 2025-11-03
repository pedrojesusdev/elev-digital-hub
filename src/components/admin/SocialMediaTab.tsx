import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const engagementData = [
  { mes: "Jan", engajamento: 450 },
  { mes: "Fev", engajamento: 580 },
  { mes: "Mar", engajamento: 720 },
  { mes: "Abr", engajamento: 850 },
  { mes: "Mai", engajamento: 1100 },
  { mes: "Jun", engajamento: 1350 },
];

const reachData = [
  { mes: "Jan", alcance: 5000 },
  { mes: "Fev", alcance: 7500 },
  { mes: "Mar", alcance: 10000 },
  { mes: "Abr", alcance: 12500 },
  { mes: "Mai", alcance: 15000 },
  { mes: "Jun", alcance: 18000 },
];

const postsData = [
  { mes: "Jan", posts: 12 },
  { mes: "Fev", posts: 15 },
  { mes: "Mar", posts: 18 },
  { mes: "Abr", posts: 20 },
  { mes: "Mai", posts: 22 },
  { mes: "Jun", posts: 25 },
];

const chartConfig = {
  engajamento: { label: "Engajamento", color: "hsl(0 0% 85%)" },
  alcance: { label: "Alcance", color: "hsl(0 0% 70%)" },
  posts: { label: "Postagens", color: "hsl(0 0% 55%)" },
};

const SocialMediaTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Gestão de Social Media</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Engajamento</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                <YAxis stroke="hsl(0 0% 65%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="engajamento" stroke="hsl(0 0% 85%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Alcance</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reachData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                <YAxis stroke="hsl(0 0% 65%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="alcance" fill="hsl(0 0% 70%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Frequência de Postagens</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={postsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                <YAxis stroke="hsl(0 0% 65%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="posts" fill="hsl(0 0% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Crescimento Geral</h3>
          <ChartContainer config={chartConfig} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                <YAxis stroke="hsl(0 0% 65%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="engajamento" stroke="hsl(0 0% 85%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>

      <Card className="p-6 bg-secondary border-border">
        <h3 className="text-lg font-semibold mb-4">Campanhas Ativas</h3>
        <div className="space-y-3">
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Campanha de Lançamento</p>
                <p className="text-sm text-muted-foreground mt-1">15 postagens agendadas</p>
              </div>
              <span className="text-xs bg-foreground text-background px-2 py-1 rounded">Ativa</span>
            </div>
          </div>
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Stories Diários</p>
                <p className="text-sm text-muted-foreground mt-1">30 dias consecutivos</p>
              </div>
              <span className="text-xs bg-foreground text-background px-2 py-1 rounded">Ativa</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SocialMediaTab;
