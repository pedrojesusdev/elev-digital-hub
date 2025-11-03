import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Lead {
  id: number;
  empresa: string;
  nota: "Quente" | "Médio" | "Frio";
  faturamento: string;
  alcance: string;
}

const chartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(0 0% 85%)",
  },
};

const LeadsTab = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, empresa: "Tech Solutions", nota: "Quente", faturamento: "R$ 500k", alcance: "10k seguidores" },
    { id: 2, empresa: "Digital Marketing Co", nota: "Médio", faturamento: "R$ 250k", alcance: "5k seguidores" },
    { id: 3, empresa: "E-commerce Plus", nota: "Frio", faturamento: "R$ 100k", alcance: "2k seguidores" },
    { id: 4, empresa: "Startup Innovation", nota: "Quente", faturamento: "R$ 750k", alcance: "15k seguidores" },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    empresa: "",
    nota: "Médio" as "Quente" | "Médio" | "Frio",
    faturamento: "",
    alcance: "",
  });

  const chartData = [
    { mes: "Jan", leads: leads.length > 0 ? 12 : 0 },
    { mes: "Fev", leads: leads.length > 1 ? 19 : 0 },
    { mes: "Mar", leads: leads.length > 2 ? 15 : 0 },
    { mes: "Abr", leads: leads.length > 3 ? 25 : 0 },
    { mes: "Mai", leads: leads.length },
    { mes: "Jun", leads: leads.length + 5 },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLeads(leads.map(lead => 
        lead.id === editingId ? { ...formData, id: editingId } : lead
      ));
      setEditingId(null);
    } else {
      const newLead = { ...formData, id: Date.now() };
      setLeads([...leads, newLead]);
    }
    setFormData({ empresa: "", nota: "Médio", faturamento: "", alcance: "" });
  };

  const handleEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setFormData({ empresa: lead.empresa, nota: lead.nota, faturamento: lead.faturamento, alcance: lead.alcance });
  };

  const handleDelete = (id: number) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold">Gerenciamento de Leads</h2>
      
      {/* Formulário CRUD */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Editar Lead" : "Adicionar Novo Lead"}</h3>
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
              <Label htmlFor="nota">Nota do Lead</Label>
              <Select value={formData.nota} onValueChange={(value: "Quente" | "Médio" | "Frio") => setFormData({ ...formData, nota: value })}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quente">Quente</SelectItem>
                  <SelectItem value="Médio">Médio</SelectItem>
                  <SelectItem value="Frio">Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faturamento">Faturamento</Label>
              <Input
                id="faturamento"
                value={formData.faturamento}
                onChange={(e) => setFormData({ ...formData, faturamento: e.target.value })}
                placeholder="Ex: R$ 500k"
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alcance">Alcance</Label>
              <Input
                id="alcance"
                value={formData.alcance}
                onChange={(e) => setFormData({ ...formData, alcance: e.target.value })}
                placeholder="Ex: 10k seguidores"
                required
                className="bg-input border-border"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="bg-foreground text-background hover:bg-muted-foreground">
              <Plus className="mr-2" size={16} />
              {editingId ? "Atualizar Lead" : "Adicionar Lead"}
            </Button>
            {editingId && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditingId(null);
                  setFormData({ empresa: "", nota: "Médio", faturamento: "", alcance: "" });
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Tabela de Leads */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-lg font-semibold mb-4">Leads Recebidos</h3>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-foreground">Empresa</TableHead>
              <TableHead className="text-foreground">Nota</TableHead>
              <TableHead className="text-foreground">Faturamento</TableHead>
              <TableHead className="text-foreground">Alcance</TableHead>
              <TableHead className="text-foreground">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
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
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(lead)}
                      className="hover:bg-muted"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(lead.id)}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Gráfico de Evolução */}
      <Card className="p-6 bg-card border-border hover-glow">
        <h3 className="text-xl font-semibold mb-4">Evolução de Leads</h3>
        <div className="w-full h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 28%)" />
                <XAxis dataKey="mes" stroke="hsl(0 0% 60%)" />
                <YAxis stroke="hsl(0 0% 60%)" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="hsl(0 0% 85%)" 
                  strokeWidth={2} 
                  dot={{ fill: "hsl(0 0% 85%)" }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default LeadsTab;
