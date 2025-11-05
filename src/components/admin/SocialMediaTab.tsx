import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SocialMediaService {
  id: string;
  empresa: string;
  campanha: string;
  descricao: string;
  periodo: string;
  metas: string;
  status: "Ativa" | "Pausada" | "Finalizada";
  created_at?: string;
  videos_gravados: number;
  posts_publicados: number;
  alcance_total: number;
  engajamento_medio: number;
  meta_videos_longos: number;
  meta_videos_curtos: number;
  meta_posts_estaticos: number;
  meta_carrosseis: number;
  meta_posts_linkedin: number;
  realizados_videos_longos: number;
  realizados_videos_curtos: number;
  realizados_posts_estaticos: number;
  realizados_carrosseis: number;
  realizados_posts_linkedin: number;
}

const SocialMediaTab = () => {
  const [services, setServices] = useState<SocialMediaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    campanha: "",
    descricao: "",
    periodo: "",
    metas: "",
    status: "Ativa" as "Ativa" | "Pausada" | "Finalizada",
    videosGravados: 0,
    postsPublicados: 0,
    alcanceTotal: 0,
    engajamentoMedio: 0,
    metaVideosLongos: 0,
    metaVideosCurtos: 0,
    metaPostsEstaticos: 0,
    metaCarrosseis: 0,
    metaPostsLinkedin: 0,
    realizadosVideosLongos: 0,
    realizadosVideosCurtos: 0,
    realizadosPostsEstaticos: 0,
    realizadosCarrosseis: 0,
    realizadosPostsLinkedin: 0,
  });

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('social_media_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } else {
      const typedData = (data as SocialMediaService[]) || [];
      setServices(typedData);
      if (typedData.length > 0 && !selectedCompany) {
        const companies = Array.from(new Set(typedData.map(s => s.empresa)));
        setSelectedCompany(companies[0]);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();

    const channel = supabase
      .channel('social_media_services_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'social_media_services' },
        () => {
          fetchServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calcular métricas dinamicamente por empresa
  const companies = Array.from(new Set(services.map(s => s.empresa)));
  
  const calculateMetrics = (company: string) => {
    const companyServices = services.filter(s => s.empresa === company);
    
    const totalVideos = companyServices.reduce((sum, s) => sum + s.videos_gravados, 0);
    const totalPosts = companyServices.reduce((sum, s) => sum + s.posts_publicados, 0);
    const totalAlcance = companyServices.reduce((sum, s) => sum + s.alcance_total, 0);
    const avgEngajamento = companyServices.length > 0 
      ? Math.round(companyServices.reduce((sum, s) => sum + s.engajamento_medio, 0) / companyServices.length)
      : 0;
    
    // Gerar dados de crescimento baseados nas métricas
    const crescimentoData = [
      { mes: "Jan", valor: Math.round(totalAlcance * 0.5) },
      { mes: "Fev", valor: Math.round(totalAlcance * 0.65) },
      { mes: "Mar", valor: Math.round(totalAlcance * 0.75) },
      { mes: "Abr", valor: Math.round(totalAlcance * 0.85) },
      { mes: "Mai", valor: Math.round(totalAlcance * 0.95) },
      { mes: "Jun", valor: totalAlcance },
    ];
    
    return {
      videosGravados: totalVideos,
      postsPublicados: totalPosts,
      alcanceTotal: totalAlcance,
      engajamentoMedio: avgEngajamento,
      crescimento: crescimentoData,
      variacao: "+12%"
    };
  };
  
  const currentMetrics = calculateMetrics(selectedCompany);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { error } = await supabase
        .from('social_media_services')
        .update({
          empresa: formData.empresa,
          campanha: formData.campanha,
          descricao: formData.descricao,
          periodo: formData.periodo,
          metas: formData.metas,
          status: formData.status,
          videos_gravados: formData.videosGravados,
          posts_publicados: formData.postsPublicados,
          alcance_total: formData.alcanceTotal,
          engajamento_medio: formData.engajamentoMedio,
        })
        .eq('id', editingId);

      if (error) {
        toast.error("Erro ao atualizar serviço");
        console.error(error);
      } else {
        toast.success("Serviço atualizado!");
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from('social_media_services')
        .insert([{
          empresa: formData.empresa,
          campanha: formData.campanha,
          descricao: formData.descricao,
          periodo: formData.periodo,
          metas: formData.metas,
          status: formData.status,
          videos_gravados: formData.videosGravados,
          posts_publicados: formData.postsPublicados,
          alcance_total: formData.alcanceTotal,
          engajamento_medio: formData.engajamentoMedio,
        }]);

      if (error) {
        toast.error("Erro ao adicionar serviço");
        console.error(error);
      } else {
        toast.success("Serviço adicionado!");
      }
    }
    setFormData({ 
      empresa: "", 
      campanha: "", 
      descricao: "", 
      periodo: "", 
      metas: "", 
      status: "Ativa",
      videosGravados: 0,
      postsPublicados: 0,
      alcanceTotal: 0,
      engajamentoMedio: 0,
      metaVideosLongos: 0,
      metaVideosCurtos: 0,
      metaPostsEstaticos: 0,
      metaCarrosseis: 0,
      metaPostsLinkedin: 0,
      realizadosVideosLongos: 0,
      realizadosVideosCurtos: 0,
      realizadosPostsEstaticos: 0,
      realizadosCarrosseis: 0,
      realizadosPostsLinkedin: 0,
    });
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
      videosGravados: service.videos_gravados,
      postsPublicados: service.posts_publicados,
      alcanceTotal: service.alcance_total,
      engajamentoMedio: service.engajamento_medio,
      metaVideosLongos: service.meta_videos_longos,
      metaVideosCurtos: service.meta_videos_curtos,
      metaPostsEstaticos: service.meta_posts_estaticos,
      metaCarrosseis: service.meta_carrosseis,
      metaPostsLinkedin: service.meta_posts_linkedin,
      realizadosVideosLongos: service.realizados_videos_longos,
      realizadosVideosCurtos: service.realizados_videos_curtos,
      realizadosPostsEstaticos: service.realizados_posts_estaticos,
      realizadosCarrosseis: service.realizados_carrosseis,
      realizadosPostsLinkedin: service.realizados_posts_linkedin,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    const { error } = await supabase
      .from('social_media_services')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir serviço");
      console.error(error);
    } else {
      toast.success("Serviço excluído!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

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
              <p className="text-xs text-muted-foreground mt-1">Total de todos os serviços</p>
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
              <p className="text-xs text-muted-foreground mt-1">Total de todos os serviços</p>
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
              <p className="text-2xl font-bold">{(currentMetrics.alcanceTotal / 1000).toFixed(0)}k</p>
              <p className="text-xs text-foreground">{currentMetrics.variacao}</p>
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
              <p className="text-2xl font-bold">{(currentMetrics.engajamentoMedio / 1000).toFixed(1)}k</p>
              <p className="text-xs text-muted-foreground mt-1">Média por serviço</p>
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

      {/* Resumo de Métricas */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Resumo de Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Video className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Média de Vídeos</p>
              <p className="text-xl font-bold">
                {services.filter(s => s.empresa === selectedCompany).length > 0 
                  ? Math.round(currentMetrics.videosGravados / services.filter(s => s.empresa === selectedCompany).length)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">por campanha</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <FileText className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Média de Posts</p>
              <p className="text-xl font-bold">
                {services.filter(s => s.empresa === selectedCompany).length > 0 
                  ? Math.round(currentMetrics.postsPublicados / services.filter(s => s.empresa === selectedCompany).length)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">por campanha</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <Users className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Campanhas Ativas</p>
              <p className="text-xl font-bold">
                {services.filter(s => s.empresa === selectedCompany && s.status === "Ativa").length}
              </p>
              <p className="text-xs text-muted-foreground">em andamento</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total de Serviços</p>
              <p className="text-xl font-bold">
                {services.filter(s => s.empresa === selectedCompany).length}
              </p>
              <p className="text-xs text-muted-foreground">cadastrados</p>
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

          {/* Campos de Métricas */}
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="text-sm font-semibold mb-3">Métricas da Campanha</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="videosGravados">Vídeos Gravados</Label>
                <Input
                  id="videosGravados"
                  type="number"
                  min="0"
                  value={formData.videosGravados}
                  onChange={(e) => setFormData({ ...formData, videosGravados: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="0"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postsPublicados">Posts Publicados</Label>
                <Input
                  id="postsPublicados"
                  type="number"
                  min="0"
                  value={formData.postsPublicados}
                  onChange={(e) => setFormData({ ...formData, postsPublicados: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="0"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcanceTotal">Alcance Total</Label>
                <Input
                  id="alcanceTotal"
                  type="number"
                  min="0"
                  value={formData.alcanceTotal}
                  onChange={(e) => setFormData({ ...formData, alcanceTotal: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="0"
                  required
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engajamentoMedio">Engajamento Médio</Label>
                <Input
                  id="engajamentoMedio"
                  type="number"
                  min="0"
                  value={formData.engajamentoMedio}
                  onChange={(e) => setFormData({ ...formData, engajamentoMedio: Math.max(0, parseInt(e.target.value) || 0) })}
                  placeholder="0"
                  required
                  className="bg-input border-border"
                />
              </div>
            </div>
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
                  setFormData({ 
                    empresa: "", 
                    campanha: "", 
                    descricao: "", 
                    periodo: "", 
                    metas: "", 
                    status: "Ativa",
                    videosGravados: 0,
                    postsPublicados: 0,
                    alcanceTotal: 0,
                    engajamentoMedio: 0,
                    metaVideosLongos: 0,
                    metaVideosCurtos: 0,
                    metaPostsEstaticos: 0,
                    metaCarrosseis: 0,
                    metaPostsLinkedin: 0,
                    realizadosVideosLongos: 0,
                    realizadosVideosCurtos: 0,
                    realizadosPostsEstaticos: 0,
                    realizadosCarrosseis: 0,
                    realizadosPostsLinkedin: 0,
                  });
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 p-3 bg-background rounded border border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Vídeos</p>
                        <p className="text-sm font-semibold">{service.videos_gravados}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Posts</p>
                        <p className="text-sm font-semibold">{service.posts_publicados}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Alcance</p>
                        <p className="text-sm font-semibold">{(service.alcance_total / 1000).toFixed(0)}k</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Engajamento</p>
                        <p className="text-sm font-semibold">{(service.engajamento_medio / 1000).toFixed(1)}k</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Criado em: {service.created_at ? new Date(service.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
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
