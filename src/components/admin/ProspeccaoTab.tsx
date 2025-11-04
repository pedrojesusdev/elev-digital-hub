import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Building2, MapPin, Phone, Instagram, Mail, Filter } from "lucide-react";

interface ProspeccaoLead {
  id: number;
  empresa: string;
  localidade: string;
  telefone: string;
  instagram: string;
  email: string;
  observacoes: string;
  descricao: string;
  status: "Novo lead" | "Não contatado" | "Aguardando resposta" | "Recusado" | "Cliente";
  dataCriacao: string;
}

const ProspeccaoTab = () => {
  const [leads, setLeads] = useState<ProspeccaoLead[]>([
    {
      id: 1,
      empresa: "Tech Solutions LTDA",
      localidade: "São Paulo, SP",
      telefone: "(11) 98765-4321",
      instagram: "@techsolutions",
      email: "contato@techsolutions.com",
      observacoes: "Interessado em automação de marketing",
      descricao: "Empresa localizada em São Paulo, SP, com presença no Instagram @techsolutions, contato via telefone (11) 98765-4321",
      status: "Aguardando resposta",
      dataCriacao: "15/01/2025"
    },
    {
      id: 2,
      empresa: "Digital Marketing Co",
      localidade: "Rio de Janeiro, RJ",
      telefone: "(21) 99876-5432",
      instagram: "@digitalmarketingco",
      email: "",
      observacoes: "Precisa de gestão de redes sociais",
      descricao: "Empresa localizada em Rio de Janeiro, RJ, com presença no Instagram @digitalmarketingco, contato via telefone (21) 99876-5432",
      status: "Novo lead",
      dataCriacao: "20/01/2025"
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [formData, setFormData] = useState({
    empresa: "",
    localidade: "",
    telefone: "",
    instagram: "",
    email: "",
    observacoes: "",
    status: "Novo lead" as ProspeccaoLead["status"],
  });

  const generateDescricao = (data: typeof formData) => {
    let descricao = `Empresa localizada em ${data.localidade}`;
    if (data.instagram) descricao += `, com presença no Instagram ${data.instagram}`;
    if (data.telefone) descricao += `, contato via telefone ${data.telefone}`;
    if (data.email) descricao += `, e-mail ${data.email}`;
    return descricao;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const descricao = generateDescricao(formData);
    
    if (editingId) {
      setLeads(leads.map(lead => 
        lead.id === editingId 
          ? { ...formData, id: editingId, descricao, dataCriacao: lead.dataCriacao } 
          : lead
      ));
      setEditingId(null);
    } else {
      const newLead: ProspeccaoLead = {
        ...formData,
        id: Date.now(),
        descricao,
        dataCriacao: new Date().toLocaleDateString('pt-BR'),
      };
      setLeads([...leads, newLead]);
    }
    
    setFormData({
      empresa: "",
      localidade: "",
      telefone: "",
      instagram: "",
      email: "",
      observacoes: "",
      status: "Novo lead",
    });
  };

  const handleEdit = (lead: ProspeccaoLead) => {
    setEditingId(lead.id);
    setFormData({
      empresa: lead.empresa,
      localidade: lead.localidade,
      telefone: lead.telefone,
      instagram: lead.instagram,
      email: lead.email,
      observacoes: lead.observacoes,
      status: lead.status,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      setLeads(leads.filter(lead => lead.id !== id));
    }
  };

  const getStatusBadge = (status: ProspeccaoLead["status"]) => {
    const styles = {
      "Novo lead": "bg-foreground text-background",
      "Não contatado": "bg-muted text-foreground",
      "Aguardando resposta": "bg-accent text-accent-foreground",
      "Recusado": "border-border text-muted-foreground",
      "Cliente": "bg-foreground text-background",
    };
    return styles[status] || "";
  };

  const filteredLeads = filterStatus === "all" 
    ? leads 
    : leads.filter(lead => lead.status === filterStatus);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prospecção de Leads</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {["Novo lead", "Não contatado", "Aguardando resposta", "Recusado", "Cliente"].map((status) => (
          <Card key={status} className="p-4 bg-card border-border hover-glow">
            <p className="text-sm text-muted-foreground mb-1">{status}</p>
            <p className="text-2xl font-bold">
              {leads.filter(l => l.status === status).length}
            </p>
          </Card>
        ))}
      </div>

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
                Instagram *
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@empresa"
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail (opcional)
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
              <Label htmlFor="status">Status do Lead *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: ProspeccaoLead["status"]) => setFormData({ ...formData, status: value })}
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
                    status: "Novo lead",
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
                      <p className="text-sm text-muted-foreground">{lead.descricao}</p>
                    </div>
                  </TableCell>
                  <TableCell>{lead.localidade}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {lead.telefone}
                      </p>
                      <p className="flex items-center gap-1">
                        <Instagram className="w-3 h-3" /> {lead.instagram}
                      </p>
                      {lead.email && (
                        <p className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {lead.email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.dataCriacao}</TableCell>
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
    </div>
  );
};

export default ProspeccaoTab;
