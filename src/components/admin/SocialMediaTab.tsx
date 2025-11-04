import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Video, FileText, TrendingUp, Users, Heart, MessageCircle, Share2, Plus, Pencil, Trash2 } from "lucide-react";

interface SocialMediaService {
  id: number;
  empresa: string;
  campanha: string;
  descricao: string;
  periodo: string;
  metas: string;
  status: "Ativa" | "Pausada" | "Finalizada";
  data: string;
}

const SocialMediaTab = () => {
  const [services, setServices] = useState<SocialMediaService[]>([
    { 
      id: 1, 
      empresa: "Tech Solutions", 
      campanha: "Campanha de Lançamento", 
      descricao: "Divulgação de novo produto",
      periodo: "Jan - Mar 2025",
      metas: "10k seguidores, 500k alcance",
      status: "Ativa",
      data: "15/01/2025" 
    },
    { 
      id: 2, 
      empresa: "Digital Marketing Co", 
      campanha: "Engajamento Q1", 
      descricao: "Aumentar interações nas redes",
      periodo: "Jan - Abr 2025",
      metas: "1000 posts, 50k curtidas",
      status: "Ativa",
      data: "10/01/2025" 
    },
  ]);

  const [selectedCompany, setSelectedCompany] = useState<string>("Tech Solutions");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    campanha: "",
    descricao: "",
    periodo: "",
    metas: "",
    status: "Ativa" as "Ativa" | "Pausada" | "Finalizada",
  });

  // Dados de métricas por empresa
  const metricsData = {
    "Tech Solutions": {
      videosGravados: 45,
      postsPublicados: 128,
      crescimento: [
        { mes: "Jan", valor: 3200 },
        { mes: "Fev", valor: 4500 },
        { mes: "Mar", valor: 5800 },
        { mes: "Abr", valor: 7200 },
        { mes: "Mai", valor: 8900 },
        { mes: "Jun", valor: 10500 },
      ],
      alcance: {
        total: 245000,
        semanal: 42000,
        mensal: 180000,
        variacao: "+12%"
      },
      engajamento: {
        curtidas: 15420,
        comentarios: 2845,
        compartilhamentos: 1230,
        media: 8650,
        variacao: "+8.5%"
      }
    },
    "Digital Marketing Co": {
      videosGravados: 32,
      postsPublicados: 96,
      crescimento: [
        { mes: "Jan", valor: 2800 },
        { mes: "Fev", valor: 3900 },
        { mes: "Mar", valor: 4600 },
        { mes: "Abr", valor: 6100 },
        { mes: "Mai", valor: 7800 },
        { mes: "Jun", valor: 9200 },
      ],
      alcance: {
        total: 198000,
        semanal: 35000,
        mensal: 150000,
        variacao: "+10%"
      },
      engajamento: {
        curtidas: 12800,
        comentarios: 2100,
        compartilhamentos: 980,
        media: 7200,
        variacao: "+6.2%"
      }
    }
  };

  const currentMetrics = metricsData[selectedCompany as keyof typeof metricsData] || metricsData["Tech Solutions"];
  const companies = Array.from(new Set(services.map(s => s.empresa)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setServices(services.map(service => 
        service.id === editingId 
          ? { ...formData, id: editingId, data: service.data } 
          : service
      ));
      setEditingId(null);
    } else {
      const newService = {
        ...formData,
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
      };
      setServices([...services, newService]);
    }
    setFormData({ empresa: "", campanha: "", descricao: "", periodo: "", metas: "", status: "Ativa" });
  };

  const handleEdit = (service: SocialMediaService) => {
    setEditingId(service.id);
    setFormData({
      empresa: service.empresa,
      campanha: service.campanha,
      descricao: service.descricao,
      periodo: service.periodo,
      metas: service.metas,
      status: service.status,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Ativa: "bg-foreground text-background",
      Pausada: "bg-muted text-foreground",
      Finalizada: "border-border text-muted-foreground",
    };
    return styles[status as keyof typeof styles] || "";
  };

  const chartConfig = {
    valor: { label: "Popularidade", color: "hsl(0 0% 85%)" },
    alcance: { label: "Alcance", color: "hsl(0 0% 70%)" },
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Social Media</h2>
      </div>

      {/* Seletor de Empresa */}
      <Card className="p-6 bg-card border-border hover-glow">
        <div className="space-y-2">
          <Label htmlFor="company-select">Selecionar Empresa</Label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-card border-border hover-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Video className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vídeos Gravados</p>
              <p className="text-2xl font-bold">{currentMetrics.videosGravados}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <FileText className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posts Publicados</p>
              <p className="text-2xl font-bold">{currentMetrics.postsPublicados}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Alcance Total</p>
              <p className="text-2xl font-bold">{(currentMetrics.alcance.total / 1000).toFixed(0)}k</p>
              <p className="text-xs text-foreground">{currentMetrics.alcance.variacao}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <Heart className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engajamento Médio</p>
              <p className="text-2xl font-bold">{(currentMetrics.engajamento.media / 1000).toFixed(1)}k</p>
              <p className="text-xs text-foreground">{currentMetrics.engajamento.variacao}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráficos de Desempenho */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Crescimento de Popularidade
          </h3>
          <div className="w-full h-[250px]">
            <ChartContainer config={{ valor: chartConfig.valor }} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentMetrics.crescimento} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(0 0% 85%)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Alcance Mensal
          </h3>
          <div className="w-full h-[250px]">
            <ChartContainer config={{ alcance: chartConfig.alcance }} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentMetrics.crescimento} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                  <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                  <YAxis stroke="hsl(0 0% 60%)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="valor" fill="hsl(0 0% 70%)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Detalhes de Engajamento */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Detalhes de Engajamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Heart className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Curtidas</p>
              <p className="text-xl font-bold">{currentMetrics.engajamento.curtidas.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Comentários</p>
              <p className="text-xl font-bold">{currentMetrics.engajamento.comentarios.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Share2 className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Compartilhamentos</p>
              <p className="text-xl font-bold">{currentMetrics.engajamento.compartilhamentos.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Formulário CRUD */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? "Editar Serviço" : "Adicionar Novo Serviço"}
        </h3>
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
              <Label htmlFor="campanha">Nome da Campanha</Label>
              <Input
                id="campanha"
                value={formData.campanha}
                onChange={(e) => setFormData({ ...formData, campanha: e.target.value })}
                placeholder="Ex: Campanha de Lançamento"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="periodo">Período</Label>
              <Input
                id="periodo"
                value={formData.periodo}
                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                placeholder="Ex: Jan - Mar 2025"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: "Ativa" | "Pausada" | "Finalizada") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Pausada">Pausada</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metas">Metas</Label>
            <Input
              id="metas"
              value={formData.metas}
              onChange={(e) => setFormData({ ...formData, metas: e.target.value })}
              placeholder="Ex: 10k seguidores, 500k alcance"
              required
              className="bg-input border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva a campanha ou serviço..."
              rows={4}
              required
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground">
              <Plus className="mr-2" size={16} />
              {editingId ? "Atualizar Serviço" : "Adicionar Serviço"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ empresa: "", campanha: "", descricao: "", periodo: "", metas: "", status: "Ativa" });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Lista de Serviços */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Serviços Cadastrados</h3>
        <div className="space-y-3">
          {services
            .filter(service => service.empresa === selectedCompany)
            .map((service) => (
              <div key={service.id} className="p-4 bg-secondary rounded-lg border border-border hover:bg-muted/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-lg">{service.campanha}</p>
                      <Badge className={getStatusBadge(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{service.empresa}</p>
                    <p className="text-sm text-muted-foreground mt-2">{service.descricao}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Período: {service.periodo}</span>
                      <span>Metas: {service.metas}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Criado em: {service.data}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(service)}
                      className="hover:bg-muted"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(service.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          {services.filter(service => service.empresa === selectedCompany).length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum serviço cadastrado para esta empresa.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SocialMediaTab;
