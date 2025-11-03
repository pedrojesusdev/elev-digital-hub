import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const mockLeads = [
  { id: 1, empresa: "Tech Solutions", nota: "Quente", faturamento: "R$ 500k", alcance: "10k seguidores" },
  { id: 2, empresa: "Digital Marketing Co", nota: "Médio", faturamento: "R$ 250k", alcance: "5k seguidores" },
  { id: 3, empresa: "E-commerce Plus", nota: "Frio", faturamento: "R$ 100k", alcance: "2k seguidores" },
  { id: 4, empresa: "Startup Innovation", nota: "Quente", faturamento: "R$ 750k", alcance: "15k seguidores" },
];

const chartData = [
  { mes: "Jan", leads: 12 },
  { mes: "Fev", leads: 19 },
  { mes: "Mar", leads: 15 },
  { mes: "Abr", leads: 25 },
  { mes: "Mai", leads: 22 },
  { mes: "Jun", leads: 30 },
];

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(0 0% 85%)",
  },
};

const LeadsTab = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold mb-6">Leads Recebidos</h2>
        
        <Card className="p-6 bg-card border-border hover-glow">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-foreground">Empresa</TableHead>
                <TableHead className="text-foreground">Nota</TableHead>
                <TableHead className="text-foreground">Faturamento</TableHead>
                <TableHead className="text-foreground">Alcance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLeads.map((lead) => (
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Evolução de Leads</h3>
        <Card className="p-6 bg-card border-border hover-glow">
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 25%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 65%)" />
                <YAxis stroke="hsl(0 0% 65%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="leads" stroke="hsl(0 0% 85%)" strokeWidth={2} dot={{ fill: "hsl(0 0% 85%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};

export default LeadsTab;
