import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, DollarSign, Video, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface Trafego {
  id: string;
  periodo: string;
  google_ads_texto?: string | null;
  meta_ads_investido: number;
  meta_ads_texto?: string | null;
  pecas_video: number;
  pecas_estatico: number;
  metas: string;
  created_at?: string;
}

const TrafegoTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [trafegos, setTrafegos] = useState<Trafego[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metricFilter, setMetricFilter] = useState<"geral" | "anual" | "mensal">("geral");
  const [formData, setFormData] = useState({
    periodo: "",
    google_ads_texto: "",
    meta_ads_investido: "",
    meta_ads_texto: "",
    pecas_video: "",
    pecas_estatico: "",
    metas: "",
  });

  useEffect(() => {
    fetchTrafegos();

    const channel = supabase
      .channel('trafego-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trafego_pago' }, fetchTrafegos)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTrafegos = async () => {
    try {
      const { data, error } = await supabase
        .from('trafego_pago')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrafegos(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_company')
        .eq('id', user?.id)
        .single();

      const trafegoData = {
        periodo: formData.periodo,
        google_ads_investido: 0,
        google_ads_texto: formData.google_ads_texto || '',
        meta_ads_investido: parseFloat(formData.meta_ads_investido) || 0,
        meta_ads_texto: formData.meta_ads_texto || '',
        pecas_video: parseInt(formData.pecas_video) || 0,
        pecas_estatico: parseInt(formData.pecas_estatico) || 0,
        metas: formData.metas,
        empresa: profileData?.user_company || '',
      };

      if (editingId) {
        const { error } = await supabase
          .from('trafego_pago')
          .update(trafegoData)
          .eq('id', editingId);

        if (error) throw error;
        toast({ title: "Dados atualizados com sucesso!" });
      } else {
        const { error } = await supabase
          .from('trafego_pago')
          .insert([trafegoData]);

        if (error) throw error;
        toast({ title: "Dados adicionados com sucesso!" });
      }

      setFormData({
        periodo: "",
        google_ads_texto: "",
        meta_ads_investido: "",
        meta_ads_texto: "",
        pecas_video: "",
        pecas_estatico: "",
        metas: "",
      });
      setEditingId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar dados",
        description: error.message,
      });
    }
  };

  const handleEdit = (trafego: Trafego) => {
    setEditingId(trafego.id);
    setFormData({
      periodo: trafego.periodo,
      google_ads_texto: trafego.google_ads_texto || trafego.google_ads_texto === null ? "" : trafego.google_ads_texto,
      meta_ads_investido: trafego.meta_ads_investido.toString(),
      meta_ads_texto: trafego.meta_ads_texto || trafego.meta_ads_texto === null ? "" : trafego.meta_ads_texto,
      pecas_video: trafego.pecas_video.toString(),
      pecas_estatico: trafego.pecas_estatico.toString(),
      metas: trafego.metas || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      const { error } = await supabase.from('trafego_pago').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Registro excluído com sucesso!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir registro",
        description: error.message,
      });
    }
  };

  const now = new Date();
  const filteredTrafegos = trafegos.filter((t: any) => {
    const createdAt = t.created_at ? new Date(t.created_at) : null;
    if (metricFilter === "mensal") {
      if (!createdAt) return false;
      return createdAt.getFullYear() === now.getFullYear() && createdAt.getMonth() === now.getMonth();
    }
    if (metricFilter === "anual") {
      if (!createdAt) return false;
      return createdAt.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const chartData = filteredTrafegos.map(t => ({
    periodo: t.periodo,
    'Meta Ads': t.meta_ads_investido,
  }));

  const totalInvestido = filteredTrafegos.reduce((sum, t) => sum + t.meta_ads_investido, 0);
  const totalPecasVideo = filteredTrafegos.reduce((sum, t) => sum + t.pecas_video, 0);
  const totalPecasEstatico = filteredTrafegos.reduce((sum, t) => sum + t.pecas_estatico, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label className="text-sm">Filtrar métricas</Label>
          <ToggleGroup type="single" value={metricFilter} onValueChange={(v) => v && setMetricFilter(v as any)}>
            <ToggleGroupItem value="mensal" aria-label="Mensal">Mensal</ToggleGroupItem>
            <ToggleGroupItem value="anual" aria-label="Anual">Anual</ToggleGroupItem>
            <ToggleGroupItem value="geral" aria-label="Geral">Geral</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Investido</p>
                <p className="text-2xl font-bold">R$ {totalInvestido.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Video className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Peças de Vídeo</p>
                <p className="text-2xl font-bold">{totalPecasVideo}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <ImageIcon className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Peças Estáticas</p>
                <p className="text-2xl font-bold">{totalPecasEstatico}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Editar Registro" : "Novo Registro"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="periodo">Período</Label>
              <Input
                id="periodo"
                placeholder="Ex: Janeiro 2024"
                value={formData.periodo}
                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="meta_ads">Meta Ads - Valor Investido (R$)</Label>
              <Input
                id="meta_ads"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="bg-input border-border"
                value={formData.meta_ads_investido}
                onChange={(e) => setFormData({ ...formData, meta_ads_investido: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="google_ads_texto">Texto do Anúncio Google Ads</Label>
                <Textarea
                  id="google_ads_texto"
                  value={formData.google_ads_texto}
                  onChange={(e) => setFormData({ ...formData, google_ads_texto: e.target.value })}
                  rows={3}
                  placeholder="Texto do anúncio Google Ads..."
                />
              </div>

              <div>
                <Label htmlFor="meta_ads_texto">Texto do Anúncio Meta Ads</Label>
                <Textarea
                  id="meta_ads_texto"
                  value={formData.meta_ads_texto}
                  onChange={(e) => setFormData({ ...formData, meta_ads_texto: e.target.value })}
                  rows={3}
                  placeholder="Texto do anúncio Meta Ads..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pecas_video">Peças de Vídeo</Label>
                <Input
                  id="pecas_video"
                  type="number"
                  placeholder="0"
                  value={formData.pecas_video}
                  onChange={(e) => setFormData({ ...formData, pecas_video: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="pecas_estatico">Peças Estáticas</Label>
                <Input
                  id="pecas_estatico"
                  type="number"
                  placeholder="0"
                  value={formData.pecas_estatico}
                  onChange={(e) => setFormData({ ...formData, pecas_estatico: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="metas">Metas e Observações</Label>
              <Textarea
                id="metas"
                value={formData.metas}
                onChange={(e) => setFormData({ ...formData, metas: e.target.value })}
                rows={3}
                placeholder="Descreva as metas e observações deste período..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingId ? "Atualizar" : "Adicionar"}
              </Button>
              {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        periodo: "",
                        google_ads_texto: "",
                        meta_ads_investido: "",
                        meta_ads_texto: "",
                        pecas_video: "",
                        pecas_estatico: "",
                        metas: "",
                      });
                    }}
                  >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investimento por Período</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="periodo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Meta Ads" fill="#1877f2" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Registros</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Meta Ads</TableHead>
                  <TableHead>Peças Vídeo</TableHead>
                  <TableHead>Peças Estático</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrafegos.map((trafego) => (
                  <TableRow key={trafego.id}>
                    <TableCell>{trafego.periodo}</TableCell>
                    <TableCell>R$ {trafego.meta_ads_investido.toFixed(2)}</TableCell>
                    <TableCell>{trafego.pecas_video}</TableCell>
                    <TableCell>{trafego.pecas_estatico}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(trafego)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(trafego.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrafegoTab;
