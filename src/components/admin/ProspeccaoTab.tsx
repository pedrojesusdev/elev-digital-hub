import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Building2, MapPin, Phone, Instagram, Mail, Filter, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProspeccaoLead {
  id: string;
  empresa: string;
  localidade: string;
  telefone: string;
  instagram: string | null;
  email: string | null;
  observacoes: string | null;
  tem_site: boolean | null;
  status_contato: "Novo lead" | "Não contatado" | "Aguardando resposta" | "Recusado" | "Cliente";
  tipo: "prospecto" | "lead" | "cliente";
  nota: "quente" | "medio" | "frio" | null;
  faturamento_estimado: string | null;
  alcance_estimado: string | null;
  origem: string;
  created_at: string;
}

const ProspeccaoTab = () => {
  const [leads, setLeads] = useState<ProspeccaoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    empresa: "",
    localidade: "",
    telefone: "",
    instagram: "",
    email: "",
    observacoes: "",
    tem_site: false,
    status_contato: "Novo lead" as ProspeccaoLead["status_contato"],
    tipo: "prospecto" as ProspeccaoLead["tipo"],
    nota: null as ProspeccaoLead["nota"],
    faturamento_estimado: "",
    alcance_estimado: "",
  });

  // Fetch leads from database
  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads((data as ProspeccaoLead[]) || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast({
        title: "Erro ao carregar leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();

    // Setup realtime subscription for new leads
    const channel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          const newLead = payload.new as ProspeccaoLead;
          setLeads((prev) => [newLead, ...prev]);
          
          if (newLead.origem === "formulario") {
            toast({
              title: "Novo lead recebido!",
              description: `${newLead.empresa} enviou o formulário de contato`,
              action: (
                <Bell className="w-4 h-4 text-foreground" />
              ),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("leads")
          .update({
            empresa: formData.empresa,
            localidade: formData.localidade,
            telefone: formData.telefone,
            instagram: formData.instagram || null,
            email: formData.email || null,
            observacoes: formData.observacoes || null,
            tem_site: formData.tem_site,
            status_contato: formData.status_contato,
            tipo: formData.tipo,
            nota: formData.nota,
            faturamento_estimado: formData.faturamento_estimado || null,
            alcance_estimado: formData.alcance_estimado || null,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Lead atualizado!",
          description: "As informações foram atualizadas com sucesso.",
        });
        setEditingId(null);
      } else {
        const { error } = await supabase.from("leads").insert({
          empresa: formData.empresa,
          localidade: formData.localidade,
          telefone: formData.telefone,
          instagram: formData.instagram || null,
          email: formData.email || null,
          observacoes: formData.observacoes || null,
          tem_site: formData.tem_site,
          status_contato: formData.status_contato,
          tipo: formData.tipo,
          nota: formData.nota,
          faturamento_estimado: formData.faturamento_estimado || null,
          alcance_estimado: formData.alcance_estimado || null,
          origem: "manual",
        });

        if (error) throw error;

        toast({
          title: "Lead criado!",
          description: "Novo lead adicionado com sucesso.",
        });
      }

      setFormData({
        empresa: "",
        localidade: "",
        telefone: "",
        instagram: "",
        email: "",
        observacoes: "",
        tem_site: false,
        status_contato: "Novo lead",
        tipo: "prospecto",
        nota: null,
        faturamento_estimado: "",
        alcance_estimado: "",
      });

      fetchLeads();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o lead.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lead: ProspeccaoLead) => {
    setEditingId(lead.id);
    setFormData({
      empresa: lead.empresa,
      localidade: lead.localidade,
      telefone: lead.telefone,
      instagram: lead.instagram || "",
      email: lead.email || "",
      observacoes: lead.observacoes || "",
      tem_site: lead.tem_site || false,
      status_contato: lead.status_contato,
      tipo: lead.tipo,
      nota: lead.nota,
      faturamento_estimado: lead.faturamento_estimado || "",
      alcance_estimado: lead.alcance_estimado || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este lead?")) return;

    try {
      const { error } = await supabase.from("leads").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Lead excluído",
        description: "O lead foi removido com sucesso.",
      });

      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o lead.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: ProspeccaoLead["status_contato"]) => {
    const styles = {
      "Novo lead": "bg-foreground text-background",
      "Não contatado": "bg-muted text-foreground",
      "Aguardando resposta": "bg-accent text-accent-foreground",
      "Recusado": "border-border text-muted-foreground",
      "Cliente": "bg-foreground text-background",
    };
    return styles[status] || "";
  };

  const getTipoBadge = (tipo: ProspeccaoLead["tipo"]) => {
    const styles = {
      "prospecto": "bg-blue-500 text-white",
      "lead": "bg-green-500 text-white",
      "cliente": "bg-purple-500 text-white",
    };
    return styles[tipo] || "";
  };

  const handleConvertToLead = async (lead: ProspeccaoLead) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ tipo: "lead" })
        .eq("id", lead.id);

      if (error) throw error;

      toast({
        title: "Prospecto convertido em lead!",
        description: "Agora você pode editar os detalhes do lead.",
      });
      fetchLeads();
    } catch (error) {
      console.error("Error converting to lead:", error);
      toast({
        title: "Erro",
        description: "Não foi possível converter o prospecto.",
        variant: "destructive",
      });
    }
  };

  const filteredLeads = filterStatus === "all" 
    ? leads.filter(l => l.tipo !== 'cliente')
    : leads.filter(lead => lead.status_contato === filterStatus && lead.tipo !== 'cliente');

  const formularioLeads = leads.filter(lead => lead.origem === "formulario");

  const generateDescricao = (lead: ProspeccaoLead) => {
    let descricao = `Empresa localizada em ${lead.localidade}`;
    if (lead.instagram) descricao += `, com presença no Instagram ${lead.instagram}`;
    if (lead.telefone) descricao += `, contato via telefone ${lead.telefone}`;
    if (lead.email) descricao += `, e-mail ${lead.email}`;
    return descricao;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prospecção de Leads</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Prospectos</p>
          <p className="text-2xl font-bold">
            {leads.filter(l => l.tipo === "prospecto").length}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Leads</p>
          <p className="text-2xl font-bold">
            {leads.filter(l => l.tipo === "lead").length}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border hover-glow">
          <p className="text-sm text-muted-foreground mb-1">Clientes</p>
          <p className="text-2xl font-bold">
            {leads.filter(l => l.tipo === "cliente").length}
          </p>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="todos">Todos os Leads</TabsTrigger>
          <TabsTrigger value="formularios" className="relative">
            Formulários Recebidos
            {formularioLeads.length > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-foreground text-background">
                {formularioLeads.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-6 mt-6">
          {/* Formulário CRUD */}
          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingId ? "Editar Lead" : "Adicionar Novo Lead"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Nome da Empresa *
                  </Label>
                  <Input
                    id="empresa"
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Ex: Tech Solutions LTDA"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localidade" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Localidade *
                  </Label>
                  <Input
                    id="localidade"
                    value={formData.localidade}
                    onChange={(e) => setFormData({ ...formData, localidade: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                    required
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                    required
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@empresa"
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@empresa.com"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status_contato">Status de Contato *</Label>
                  <Select 
                    value={formData.status_contato} 
                    onValueChange={(value: ProspeccaoLead["status_contato"]) => setFormData({ ...formData, status_contato: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Novo lead">Novo lead</SelectItem>
                      <SelectItem value="Não contatado">Não contatado</SelectItem>
                      <SelectItem value="Aguardando resposta">Aguardando resposta</SelectItem>
                      <SelectItem value="Recusado">Recusado</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value: ProspeccaoLead["tipo"]) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospecto">Prospecto</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.tipo === "lead" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nota">Nota do Lead</Label>
                      <Select 
                        value={formData.nota || ""} 
                        onValueChange={(value) => setFormData({ ...formData, nota: value as ProspeccaoLead["nota"] })}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue placeholder="Selecione a nota" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quente">Quente</SelectItem>
                          <SelectItem value="medio">Médio</SelectItem>
                          <SelectItem value="frio">Frio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="faturamento_estimado">Faturamento Estimado</Label>
                        <Input
                          id="faturamento_estimado"
                          value={formData.faturamento_estimado}
                          onChange={(e) => setFormData({ ...formData, faturamento_estimado: e.target.value })}
                          placeholder="Ex: R$ 50.000,00/mês"
                          className="bg-input border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="alcance_estimado">Alcance Estimado</Label>
                        <Input
                          id="alcance_estimado"
                          value={formData.alcance_estimado}
                          onChange={(e) => setFormData({ ...formData, alcance_estimado: e.target.value })}
                          placeholder="Ex: 10k seguidores"
                          className="bg-input border-border"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Anotações sobre o lead..."
                  rows={3}
                  className="bg-input border-border resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tem_site">A empresa tem site?</Label>
                <Select 
                  value={formData.tem_site ? "sim" : "nao"} 
                  onValueChange={(value) => setFormData({ ...formData, tem_site: value === "sim" })}
                >
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90">
                  {editingId ? "Atualizar Lead" : "Adicionar Lead"}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        empresa: "",
                        localidade: "",
                        telefone: "",
                        instagram: "",
                        email: "",
                        observacoes: "",
                        tem_site: false,
                        status_contato: "Novo lead",
                        tipo: "prospecto",
                        nota: null,
                        faturamento_estimado: "",
                        alcance_estimado: "",
                      });
                    }}
                    className="border-border"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Filtro e Lista */}
          <Card className="p-6 bg-card border-border hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Leads Cadastrados</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[200px] bg-input border-border">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Novo lead">Novo lead</SelectItem>
                    <SelectItem value="Não contatado">Não contatado</SelectItem>
                    <SelectItem value="Aguardando resposta">Aguardando resposta</SelectItem>
                    <SelectItem value="Recusado">Recusado</SelectItem>
                    <SelectItem value="Cliente">Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Empresa</TableHead>
                    <TableHead>Localidade</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.empresa}</p>
                          <p className="text-sm text-muted-foreground">{generateDescricao(lead)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{lead.localidade}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {lead.telefone}
                          </p>
                          {lead.instagram && (
                            <p className="flex items-center gap-1">
                              <Instagram className="w-3 h-3" /> {lead.instagram}
                            </p>
                          )}
                          {lead.email && (
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={getTipoBadge(lead.tipo)}>
                            {lead.tipo}
                          </Badge>
                          <Badge className={getStatusBadge(lead.status_contato)}>
                            {lead.status_contato}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lead)}
                            className="border-border hover:bg-muted"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="border-border hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum lead encontrado com este filtro.
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="formularios" className="space-y-6 mt-6">
          <Card className="p-6 bg-card border-border hover-glow">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Leads do Formulário de Contato
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Aqui estão todos os leads que enviaram o formulário de contato do site.
            </p>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Empresa</TableHead>
                    <TableHead>Localidade</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formularioLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <p className="font-medium">{lead.empresa}</p>
                      </TableCell>
                      <TableCell>{lead.localidade}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {lead.telefone}
                          </p>
                          {lead.instagram && (
                            <p className="flex items-center gap-1">
                              <Instagram className="w-3 h-3" /> {lead.instagram}
                            </p>
                          )}
                          {lead.email && (
                            <p className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lead.observacoes || "Sem mensagem"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={getTipoBadge(lead.tipo)}>
                            {lead.tipo}
                          </Badge>
                          <Badge className={getStatusBadge(lead.status_contato)}>
                            {lead.status_contato}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')} às{" "}
                        {new Date(lead.created_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(lead)}
                            className="border-border hover:bg-muted"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(lead.id)}
                            className="border-border hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {formularioLeads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum formulário recebido ainda.</p>
                <p className="text-sm mt-2">Os leads do site aparecerão aqui automaticamente.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProspeccaoTab;
