import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon, Clock, Building2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarEvent {
  id: number;
  titulo: string;
  dataInicio: string;
  horaInicio: string;
  dataFim: string;
  horaFim: string;
  descricao: string;
  empresa: string;
  googleEventId?: string;
}

const CalendarioTab = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      titulo: "Reunião com Tech Solutions",
      dataInicio: "2025-01-25",
      horaInicio: "10:00",
      dataFim: "2025-01-25",
      horaFim: "11:00",
      descricao: "Apresentação de proposta de automação",
      empresa: "Tech Solutions",
      googleEventId: "google-event-1"
    },
    {
      id: 2,
      titulo: "Follow-up Digital Marketing",
      dataInicio: "2025-01-25",
      horaInicio: "14:30",
      dataFim: "2025-01-25",
      horaFim: "15:30",
      descricao: "Discussão sobre gestão de redes sociais",
      empresa: "Digital Marketing Co",
      googleEventId: "google-event-2"
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [formData, setFormData] = useState({
    titulo: "",
    dataInicio: format(new Date(), "yyyy-MM-dd"),
    horaInicio: "09:00",
    dataFim: format(new Date(), "yyyy-MM-dd"),
    horaFim: "10:00",
    descricao: "",
    empresa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de integração com Google Calendar
    const googleEventId = `google-${Date.now()}`;
    
    if (editingId) {
      setEvents(events.map(event => 
        event.id === editingId 
          ? { ...formData, id: editingId, googleEventId: event.googleEventId } 
          : event
      ));
      setEditingId(null);
    } else {
      const newEvent: CalendarEvent = {
        ...formData,
        id: Date.now(),
        googleEventId,
      };
      setEvents([...events, newEvent]);
    }
    
    // Resetar formulário
    setFormData({
      titulo: "",
      dataInicio: format(new Date(), "yyyy-MM-dd"),
      horaInicio: "09:00",
      dataFim: format(new Date(), "yyyy-MM-dd"),
      horaFim: "10:00",
      descricao: "",
      empresa: "",
    });
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingId(event.id);
    setFormData({
      titulo: event.titulo,
      dataInicio: event.dataInicio,
      horaInicio: event.horaInicio,
      dataFim: event.dataFim,
      horaFim: event.horaFim,
      descricao: event.descricao,
      empresa: event.empresa,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este evento? Ele também será removido do Google Calendar.")) {
      setEvents(events.filter(event => event.id !== id));
      // Aqui seria feita a chamada para remover do Google Calendar
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter(event => event.dataInicio === dateStr);
  };

  const todayEvents = getEventsForDate(selectedDate);

  const getDatesWithEvents = () => {
    return events.map(event => new Date(event.dataInicio));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendário de Reuniões</h2>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("daily")}
            className={viewMode === "daily" ? "bg-foreground text-background" : "border-border"}
          >
            Diário
          </Button>
          <Button
            variant={viewMode === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("weekly")}
            className={viewMode === "weekly" ? "bg-foreground text-background" : "border-border"}
          >
            Semanal
          </Button>
          <Button
            variant={viewMode === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("monthly")}
            className={viewMode === "monthly" ? "bg-foreground text-background" : "border-border"}
          >
            Mensal
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Reuniões Hoje</p>
          <p className="text-2xl font-bold">{todayEvents.length}</p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Total do Mês</p>
          <p className="text-2xl font-bold">
            {events.filter(e => e.dataInicio.startsWith(format(selectedDate, "yyyy-MM"))).length}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Próximas 7 dias</p>
          <p className="text-2xl font-bold">
            {events.filter(e => {
              const eventDate = new Date(e.dataInicio);
              const today = new Date();
              const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= today && eventDate <= nextWeek;
            }).length}
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
              modifiers={{
                hasEvent: getDatesWithEvents(),
              }}
              modifiersStyles={{
                hasEvent: {
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                },
              }}
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
                <div key={event.id} className="p-4 bg-secondary rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.titulo}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Building2 className="w-3 h-3" />
                        {event.empresa}
                      </p>
                    </div>
                    <Badge className="bg-foreground text-background">
                      {event.horaInicio} - {event.horaFim}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{event.descricao}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      className="border-border hover:bg-muted flex-1"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      className="border-border hover:bg-destructive hover:text-destructive-foreground flex-1"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Excluir
                    </Button>
                    {event.googleEventId && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-muted"
                        title="Abrir no Google Calendar"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sem reuniões hoje.</p>
                <p className="text-sm mt-1">Adicione um novo evento abaixo.</p>
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
              <Label htmlFor="titulo">Título do Evento *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Reunião com cliente"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Empresa (opcional)
              </Label>
              <Input
                id="empresa"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                placeholder="Nome da empresa"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                required
                className="bg-input border-border"
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
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Término *</Label>
              <Input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                required
                className="bg-input border-border"
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
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Evento</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes sobre a reunião..."
              rows={3}
              className="bg-input border-border resize-none"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
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
                    dataInicio: format(new Date(), "yyyy-MM-dd"),
                    horaInicio: "09:00",
                    dataFim: format(new Date(), "yyyy-MM-dd"),
                    horaFim: "10:00",
                    descricao: "",
                    empresa: "",
                  });
                }}
                className="border-border"
              >
                Cancelar
              </Button>
            )}
          </div>

          <div className="p-4 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>
                Este evento será sincronizado automaticamente com o Google Calendar. 
                Certifique-se de estar autenticado em sua conta Google.
              </span>
            </p>
          </div>
        </form>
      </Card>

      {/* Lista de Todos os Eventos */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Todos os Eventos</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {events.length > 0 ? (
            events
              .sort((a, b) => new Date(a.dataInicio + ' ' + a.horaInicio).getTime() - new Date(b.dataInicio + ' ' + b.horaInicio).getTime())
              .map((event) => (
                <div key={event.id} className="p-4 bg-secondary rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{event.titulo}</h4>
                      <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(event.dataInicio), "dd/MM/yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.horaInicio} - {event.horaFim}
                        </span>
                        {event.empresa && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {event.empresa}
                          </span>
                        )}
                      </div>
                      {event.descricao && (
                        <p className="text-sm text-muted-foreground mt-2">{event.descricao}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}
                        className="border-border hover:bg-muted"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        className="border-border hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum evento cadastrado.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CalendarioTab;
