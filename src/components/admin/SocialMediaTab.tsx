import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const engagementData = [
  { mes: "Jan", engajamento: 3200 },
  { mes: "Fev", engajamento: 4500 },
  { mes: "Mar", engajamento: 5800 },
  { mes: "Abr", engajamento: 7200 },
  { mes: "Mai", engajamento: 8900 },
  { mes: "Jun", engajamento: 10500 },
];

const chartConfig = {
  engajamento: { label: "Engajamento", color: "hsl(0 0% 85%)" },
  alcance: { label: "Alcance", color: "hsl(0 0% 70%)" },
};

const SocialMediaTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Social Media</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Engajamento</h3>
          <ChartContainer config={{ engajamento: chartConfig.engajamento }} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="engajamento" stroke="hsl(0 0% 85%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4">Alcance</h3>
          <ChartContainer config={{ alcance: chartConfig.alcance }} className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="engajamento" fill="hsl(0 0% 70%)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};

export default SocialMediaTab;
