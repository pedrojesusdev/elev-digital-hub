import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  titulo: string;
  data_inicio: string;
  hora_inicio: string;
  data_fim: string;
  hora_fim: string;
  descricao: string | null;
  empresa: string | null;
  tipo: "servicos" | "empresa";
  categoria_servicos?: "reuniao_diagnostico" | "reuniao_fechamento" | "followup" | "relacionamento" | null;
  categoria_empresa?: "all_hands" | "comunicacao" | "magic_number" | "tecnologia" | "marketing" | "comercial" | "estrategia" | "diretoria" | "analise_metas" | null;
}

const CalendarioTab = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"servicos" | "empresa">("servicos");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    titulo: "",
    dataInicio: format(new Date(), "dd/MM/yyyy"),
    horaInicio: "09:00",
    dataFim: format(new Date(), "dd/MM/yyyy"),
    horaFim: "10:00",
    descricao: "",
    empresa: "",
    tipo: "servicos" as "servicos" | "empresa",
    categoriaServicos: "" as "reuniao_diagnostico" | "reuniao_fechamento" | "followup" | "relacionamento" | "",
    categoriaEmpresa: "" as "all_hands" | "comunicacao" | "magic_number" | "tecnologia" | "marketing" | "comercial" | "estrategia" | "diretoria" | "analise_metas" | "",
  });

  // Funções auxiliares para conversão de data
  const formatDateBR = (isoDate: string): string => {
    if (!isoDate || isoDate.length !== 10) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateISO = (brDate: string): string => {
    if (!brDate) return "";
    const cleanDate = brDate.replace(/\D/g, "");
    if (cleanDate.length !== 8) return "";
    const day = cleanDate.substring(0, 2);
    const month = cleanDate.substring(2, 4);
    const year = cleanDate.substring(4, 8);
    return `${year}-${month}-${day}`;
  };

  const applyDateMask = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
  };

  const categoriasServicos = [
    { value: "reuniao_diagnostico", label: "Reunião de diagnóstico", color: "bg-green-500" },
    { value: "reuniao_fechamento", label: "Reunião de fechamento", color: "bg-red-500" },
    { value: "followup", label: "Followup", color: "bg-yellow-500" },
    { value: "relacionamento", label: "Relacionamento", color: "bg-blue-500" },
  ];

  const categoriasEmpresa = [
    { value: "all_hands", label: "All hands", color: "bg-gray-500" },
    { value: "comunicacao", label: "Comunicação", color: "bg-pink-500" },
    { value: "magic_number", label: "Magic Number", color: "bg-orange-500" },
    { value: "tecnologia", label: "Tecnologia", color: "bg-white text-black" },
    { value: "marketing", label: "Marketing", color: "bg-purple-500" },
    { value: "comercial", label: "Comercial", color: "bg-red-600" },
    { value: "estrategia", label: "Estratégia", color: "bg-blue-600" },
    { value: "diretoria", label: "Diretoria", color: "bg-yellow-600" },
    { value: "analise_metas", label: "Análise de metas", color: "bg-green-600" },
  ];

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('data_inicio', { ascending: true });

    if (error) {
      toast.error("Erro ao carregar eventos");
      console.error(error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('calendar_events_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calendar_events' },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      titulo: formData.titulo,
      data_inicio: formatDateISO(formData.dataInicio),
      hora_inicio: formData.horaInicio,
      data_fim: formatDateISO(formData.dataFim),
      hora_fim: formData.horaFim,
      descricao: formData.descricao || null,
      empresa: formData.empresa || null,
      tipo: formData.tipo,
      categoria_servicos: formData.tipo === "servicos" ? formData.categoriaServicos || null : null,
      categoria_empresa: formData.tipo === "empresa" ? formData.categoriaEmpresa || null : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from('calendar_events')
        .update(eventData)
        .eq('id', editingId);

      if (error) {
        toast.error("Erro ao atualizar evento");
        console.error(error);
      } else {
        toast.success("Evento atualizado!");
        setEditingId(null);
      }
    } else {
      const { error } = await supabase
        .from('calendar_events')
        .insert([eventData]);

      if (error) {
        toast.error("Erro ao adicionar evento");
        console.error(error);
      } else {
        toast.success("Evento adicionado!");
      }
    }
    
    setFormData({
      titulo: "",
      dataInicio: format(new Date(), "dd/MM/yyyy"),
      horaInicio: "09:00",
      dataFim: format(new Date(), "dd/MM/yyyy"),
      horaFim: "10:00",
      descricao: "",
      empresa: "",
      tipo: "servicos",
      categoriaServicos: "",
      categoriaEmpresa: "",
    });
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setFormData({
      titulo: event.titulo,
      dataInicio: formatDateBR(event.data_inicio),
      horaInicio: event.hora_inicio,
      dataFim: formatDateBR(event.data_fim),
      horaFim: event.hora_fim,
      descricao: event.descricao || "",
      empresa: event.empresa || "",
      tipo: event.tipo,
      categoriaServicos: (event.categoria_servicos as any) || "",
      categoriaEmpresa: (event.categoria_empresa as any) || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao excluir evento");
      console.error(error);
    } else {
      toast.success("Evento excluído!");
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter(event => {
      const matchesDate = event.data_inicio === dateStr;
      const matchesTab = event.tipo === activeTab;
      const matchesCategory = selectedCategory === "all" || 
        (activeTab === "servicos" && event.categoria_servicos === selectedCategory) ||
        (activeTab === "empresa" && event.categoria_empresa === selectedCategory);
      return matchesDate && matchesTab && matchesCategory;
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesTab = event.tipo === activeTab;
    const matchesCategory = selectedCategory === "all" || 
      (activeTab === "servicos" && event.categoria_servicos === selectedCategory) ||
      (activeTab === "empresa" && event.categoria_empresa === selectedCategory);
    return matchesTab && matchesCategory;
  });

  const todayEvents = getEventsForDate(selectedDate);

  const getCategoryColor = (event: CalendarEvent) => {
    if (event.tipo === "servicos") {
      const cat = categoriasServicos.find(c => c.value === event.categoria_servicos);
      return cat?.color || "bg-gray-500";
    } else {
      const cat = categoriasEmpresa.find(c => c.value === event.categoria_empresa);
      return cat?.color || "bg-gray-500";
    }
  };

  const getCategoryLabel = (event: CalendarEvent) => {
    if (event.tipo === "servicos") {
      const cat = categoriasServicos.find(c => c.value === event.categoria_servicos);
      return cat?.label || "Sem categoria";
    } else {
      const cat = categoriasEmpresa.find(c => c.value === event.categoria_empresa);
      return cat?.label || "Sem categoria";
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
      <h2 className="text-2xl font-bold">Calendário de Reuniões</h2>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as any); setSelectedCategory("all"); }}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="servicos">Serviços</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
        </TabsList>

        <TabsContent value="servicos" className="space-y-6">
          <Card className="p-4 bg-card border-border">
            <Label htmlFor="category-filter">Filtrar por categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categoriasServicos.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </TabsContent>

        <TabsContent value="empresa" className="space-y-6">
          <Card className="p-4 bg-card border-border">
            <Label htmlFor="category-filter">Filtrar por categoria</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categoriasEmpresa.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Reuniões do Dia</p>
          <p className="text-2xl font-bold">{todayEvents.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Reuniões da Semana</p>
          <p className="text-2xl font-bold">
            {events.filter(e => {
              const eventDate = new Date(e.data_inicio);
              const today = new Date();
              const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= today && eventDate <= nextWeek && e.tipo === activeTab;
            }).length}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Total do Mês</p>
          <p className="text-2xl font-bold">
            {events.filter(e => e.data_inicio.startsWith(format(selectedDate, "yyyy-MM")) && e.tipo === activeTab).length}
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Visualização do Calendário
          </h3>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border border-border"
            />
          </div>
          <div className="mt-4 p-3 bg-secondary rounded-md">
            <p className="text-sm text-muted-foreground">
              Data selecionada: <span className="font-semibold text-foreground">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            </p>
          </div>
        </Card>

        {/* Reuniões do Dia */}
        <Card className="p-6 bg-card border-border hover-glow">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reuniões do Dia
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div key={event.id} className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.titulo}</h4>
                      <Badge className={`${getCategoryColor(event)} text-white mt-1`}>
                        {getCategoryLabel(event)}
                      </Badge>
                    </div>
                    <Badge className="bg-foreground text-background">
                      {event.hora_inicio} - {event.hora_fim}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.descricao}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sem reuniões hoje.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Formulário CRUD */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          {editingId ? "Editar Evento" : "Adicionar Novo Evento"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Evento</Label>
              <Select value={formData.tipo} onValueChange={(v: any) => setFormData({ ...formData, tipo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="empresa">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select 
                value={formData.tipo === "servicos" ? formData.categoriaServicos : formData.categoriaEmpresa} 
                onValueChange={(v: any) => formData.tipo === "servicos" 
                  ? setFormData({ ...formData, categoriaServicos: v }) 
                  : setFormData({ ...formData, categoriaEmpresa: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.tipo === "servicos" 
                    ? categoriasServicos.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))
                    : categoriasEmpresa.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa (opcional)</Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type="text"
                placeholder="dd/mm/aaaa"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: applyDateMask(e.target.value) })}
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaInicio">Horário de Início *</Label>
              <Input
                id="horaInicio"
                type="time"
                value={formData.horaInicio}
                onChange={(e) => setFormData({ ...formData, horaInicio: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Término *</Label>
              <Input
                id="dataFim"
                type="text"
                placeholder="dd/mm/aaaa"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: applyDateMask(e.target.value) })}
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaFim">Horário de Término *</Label>
              <Input
                id="horaFim"
                type="time"
                value={formData.horaFim}
                onChange={(e) => setFormData({ ...formData, horaFim: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Evento</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingId ? "Atualizar Evento" : "Adicionar Evento"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    titulo: "",
                    dataInicio: format(new Date(), "dd/MM/yyyy"),
                    horaInicio: "09:00",
                    dataFim: format(new Date(), "dd/MM/yyyy"),
                    horaFim: "10:00",
                    descricao: "",
                    empresa: "",
                    tipo: "servicos",
                    categoriaServicos: "",
                    categoriaEmpresa: "",
                  });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Lista de Todos os Eventos */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Todos os Eventos</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents
              .sort((a, b) => new Date(a.data_inicio + ' ' + a.hora_inicio).getTime() - new Date(b.data_inicio + ' ' + b.hora_inicio).getTime())
              .map((event) => (
                <div key={event.id} className="p-4 bg-secondary rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.titulo}</h4>
                      <Badge className={`${getCategoryColor(event)} text-white mt-1`}>
                        {getCategoryLabel(event)}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {format(new Date(event.data_inicio), "dd/MM/yyyy", { locale: ptBR })} • {event.hora_inicio} - {event.hora_fim}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{event.descricao}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)} className="hover:bg-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento encontrado
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalendarioTab;
