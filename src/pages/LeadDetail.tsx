import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Lead {
  id: number;
  empresa: string;
  nota: "Quente" | "Médio" | "Frio";
  faturamento: string;
  alcance: string;
  relatorio: string;
}

// Mock data - em produção, isso viria de um estado global ou API
const mockLeads: Lead[] = [
  { id: 1, empresa: "Tech Solutions", nota: "Quente", faturamento: "R$ 500k", alcance: "10k seguidores", relatorio: "Lead com alto potencial de conversão. Cliente demonstrou grande interesse em nossos serviços de automação. Próximo passo: Apresentação técnica agendada para próxima semana." },
  { id: 2, empresa: "Digital Marketing Co", nota: "Médio", faturamento: "R$ 250k", alcance: "5k seguidores", relatorio: "Aguardando retorno do cliente após envio da proposta inicial. Cliente solicitou mais informações sobre cases de sucesso." },
  { id: 3, empresa: "E-commerce Plus", nota: "Frio", faturamento: "R$ 100k", alcance: "2k seguidores", relatorio: "Lead em fase inicial de prospecção. Primeiro contato realizado, aguardando agendamento de reunião." },
  { id: 4, empresa: "Startup Innovation", nota: "Quente", faturamento: "R$ 750k", alcance: "15k seguidores", relatorio: "Negociação avançada, proposta comercial enviada e aprovada pelo board. Aguardando apenas assinatura do contrato." },
];

const chartConfig = {
  value: { label: "Valor", color: "hsl(0 0% 85%)" },
};

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const currentLead = mockLeads.find(lead => lead.id === Number(id));
  const currentIndex = mockLeads.findIndex(lead => lead.id === Number(id));
  
  if (!currentLead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Lead não encontrado</h2>
          <Button onClick={() => navigate("/admin")}>Voltar ao Dashboard</Button>
        </Card>
      </div>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/admin/lead/${mockLeads[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < mockLeads.length - 1) {
      navigate(`/admin/lead/${mockLeads[currentIndex + 1].id}`);
    }
  };

  // Dados de exemplo para gráficos específicos do lead
  const leadChartData = [
    { mes: "Jan", faturamento: 100, alcance: 2000 },
    { mes: "Fev", faturamento: 150, alcance: 3500 },
    { mes: "Mar", faturamento: 200, alcance: 5000 },
    { mes: "Abr", faturamento: 300, alcance: 7500 },
    { mes: "Mai", faturamento: 400, alcance: 9000 },
    { mes: "Jun", faturamento: parseInt(currentLead.faturamento.replace(/\D/g, '')), alcance: parseInt(currentLead.alcance.replace(/\D/g, '')) },
  ];

  const notaValue = currentLead.nota === "Quente" ? 90 : currentLead.nota === "Médio" ? 60 : 30;
  const avaliacaoData = [
    { categoria: "Interesse", valor: notaValue },
    { categoria: "Budget", valor: notaValue - 10 },
    { categoria: "Timing", valor: notaValue + 5 },
    { categoria: "Autoridade", valor: notaValue - 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header com navegação */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="hover:bg-muted"
          >
            <ArrowLeft className="mr-2" size={16} />
            Voltar ao Dashboard
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="hover:bg-muted"
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === mockLeads.length - 1}
              className="hover:bg-muted"
            >
              Próximo
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        {/* Informações principais do Lead */}
        <Card className="p-8 mb-8 bg-card border-border hover-glow animate-fade-in">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentLead.empresa}</h1>
              <p className="text-muted-foreground">ID: #{currentLead.id}</p>
            </div>
            <Badge
              variant={currentLead.nota === "Quente" ? "default" : currentLead.nota === "Médio" ? "secondary" : "outline"}
              className={
                currentLead.nota === "Quente"
                  ? "bg-foreground text-background text-lg px-4 py-2"
                  : currentLead.nota === "Médio"
                  ? "bg-muted text-foreground text-lg px-4 py-2"
                  : "border-border text-muted-foreground text-lg px-4 py-2"
              }
            >
              {currentLead.nota}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold">{currentLead.faturamento}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Alcance</p>
              <p className="text-2xl font-bold">{currentLead.alcance}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Relatório do Lead</h3>
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {currentLead.relatorio}
              </p>
            </div>
          </div>
        </Card>

        {/* Gráficos específicos do lead */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-card border-border hover-glow animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Evolução de Faturamento</h3>
            <div className="w-full h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                    <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                    <YAxis stroke="hsl(0 0% 60%)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="faturamento" 
                      stroke="hsl(0 0% 85%)" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(0 0% 85%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover-glow animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Evolução de Alcance</h3>
            <div className="w-full h-[300px]">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadChartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                    <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                    <YAxis stroke="hsl(0 0% 60%)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="alcance" fill="hsl(0 0% 70%)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        </div>

        {/* Avaliação do Lead */}
        <Card className="p-6 bg-card border-border hover-glow animate-fade-in">
          <h3 className="text-lg font-semibold mb-4">Avaliação de Qualificação (BANT)</h3>
          <div className="w-full h-[300px]">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={avaliacaoData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                  <XAxis type="number" stroke="hsl(0 0% 60%)" domain={[0, 100]} />
                  <YAxis dataKey="categoria" type="category" stroke="hsl(0 0% 60%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="hsl(0 0% 85%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LeadDetail;
