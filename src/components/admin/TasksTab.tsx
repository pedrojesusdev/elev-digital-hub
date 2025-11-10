import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, User, CheckCircle2, Clock, TrendingUp, Eye, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Funcionario {
  id: string;
  nome: string;
  funcao: string;
}

interface Task {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'diaria' | 'semanal' | 'mensal';
  status: 'pendente' | 'concluida';
  funcionario_id: string | null;
  data_conclusao: string | null;
  data_prazo: string | null;
}

const TasksTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  
  // Estados para Tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'todas' | 'diaria' | 'semanal' | 'mensal'>('todas');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "diaria" as 'diaria' | 'semanal' | 'mensal',
    status: "pendente" as 'pendente' | 'concluida',
    funcionario_id: "" as string | null,
    data_prazo: "",
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Estados para Funcionários
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [editingFuncId, setEditingFuncId] = useState<string | null>(null);
  const [funcFormData, setFuncFormData] = useState({
    nome: "",
    funcao: "",
  });

  const [selectedFuncionario, setSelectedFuncionario] = useState<string | null>(null);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [loadingFunc, setLoadingFunc] = useState(true);

  // Funções auxiliares para conversão de data
  const formatDateBR = (isoDate: string | null): string => {
    if (!isoDate) return "";
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

  const isPrazoExpirado = (dataPrazo: string | null, status: string): boolean => {
    if (!dataPrazo || status === 'concluida') return false;
    const prazo = new Date(dataPrazo);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return prazo < hoje;
  };

  const getTaskStatusLabel = (task: Task): string => {
    if (task.status === 'concluida') return 'Concluída';
    if (isPrazoExpirado(task.data_prazo, task.status)) return 'Não Cumprida';
    return 'Pendente';
  };

  const getTaskStatusColor = (task: Task): string => {
    if (task.status === 'concluida') return 'text-green-600';
    if (isPrazoExpirado(task.data_prazo, task.status)) return 'text-red-600';
    return 'text-yellow-600';
  };

  useEffect(() => {
    fetchTasks();
    fetchFuncionarios();

    const tasksChannel = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchTasks)
      .subscribe();

    const funcChannel = supabase
      .channel('funcionarios-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'funcionarios' }, fetchFuncionarios)
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(funcChannel);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar tasks",
        description: error.message,
      });
    } finally {
      setLoadingTasks(false);
    }
  };

  const fetchFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('nome');

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar funcionários",
        description: error.message,
      });
    } finally {
      setLoadingFunc(false);
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_company')
        .eq('id', user?.id)
        .single();

      const taskData = {
        titulo: taskFormData.titulo,
        descricao: taskFormData.descricao,
        tipo: taskFormData.tipo,
        status: taskFormData.status,
        funcionario_id: taskFormData.funcionario_id || null,
        data_prazo: taskFormData.data_prazo ? formatDateISO(taskFormData.data_prazo) : null,
        empresa: profileData?.user_company || '',
      };

      if (editingTaskId) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', editingTaskId);

        if (error) throw error;
        toast({ title: "Task atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (error) throw error;
        toast({ title: "Task adicionada com sucesso!" });
      }

      setTaskFormData({
        titulo: "",
        descricao: "",
        tipo: "diaria",
        status: "pendente",
        funcionario_id: null,
        data_prazo: "",
      });
      setEditingTaskId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar task",
        description: error.message,
      });
    }
  };

  const handleFuncSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_company')
        .eq('id', user?.id)
        .single();

      const funcData = {
        nome: funcFormData.nome,
        funcao: funcFormData.funcao,
        empresa: profileData?.user_company || '',
      };

      if (editingFuncId) {
        const { error } = await supabase
          .from('funcionarios')
          .update(funcData)
          .eq('id', editingFuncId);

        if (error) throw error;
        toast({ title: "Funcionário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('funcionarios')
          .insert([funcData]);

        if (error) throw error;
        toast({ title: "Funcionário adicionado com sucesso!" });
      }

      setFuncFormData({ nome: "", funcao: "" });
      setEditingFuncId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar funcionário",
        description: error.message,
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta task?")) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Task excluída com sucesso!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir task",
        description: error.message,
      });
    }
  };

  const handleDeleteFunc = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

    try {
      const { error } = await supabase.from('funcionarios').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Funcionário excluído com sucesso!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir funcionário",
        description: error.message,
      });
    }
  };

  const tasksFiltradas = tasks.filter(t => 
    filtroTipo === 'todas' ? true : t.tipo === filtroTipo
  );

  const getFuncionarioStats = (funcId: string) => {
    const funcTasks = tasks.filter(t => t.funcionario_id === funcId);
    const concluidas = funcTasks.filter(t => t.status === 'concluida').length;
    const pendentes = funcTasks.filter(t => t.status === 'pendente').length;
    const total = funcTasks.length;
    const taxa = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return { total, concluidas, pendentes, taxa };
  };

  const funcionarioSelecionado = funcionarios.find(f => f.id === selectedFuncionario);
  const stats = funcionarioSelecionado ? getFuncionarioStats(funcionarioSelecionado.id) : null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingTaskId ? "Editar Task" : "Nova Task"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={taskFormData.titulo}
                      onChange={(e) => setTaskFormData({ ...taskFormData, titulo: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select value={taskFormData.tipo} onValueChange={(value: any) => setTaskFormData({ ...taskFormData, tipo: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diaria">Diária</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={taskFormData.status} onValueChange={(value: any) => setTaskFormData({ ...taskFormData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="funcionario">Funcionário</Label>
                    <Select 
                      value={taskFormData.funcionario_id || "nenhum"} 
                      onValueChange={(value) => setTaskFormData({ ...taskFormData, funcionario_id: value === "nenhum" ? null : value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
                        {funcionarios.map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={taskFormData.descricao}
                    onChange={(e) => setTaskFormData({ ...taskFormData, descricao: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="data_prazo">Prazo (dd/mm/aaaa)</Label>
                  <Input
                    id="data_prazo"
                    type="text"
                    placeholder="dd/mm/aaaa"
                    value={taskFormData.data_prazo}
                    onChange={(e) => setTaskFormData({ ...taskFormData, data_prazo: applyDateMask(e.target.value) })}
                    maxLength={10}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingTaskId ? "Atualizar" : "Adicionar"}
                  </Button>
                  {editingTaskId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingTaskId(null);
                        setTaskFormData({
                          titulo: "",
                          descricao: "",
                          tipo: "diaria",
                          status: "pendente",
                          funcionario_id: null,
                          data_prazo: "",
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Lista de Tasks</CardTitle>
              <Select value={filtroTipo} onValueChange={(value: any) => setFiltroTipo(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="diaria">Diárias</SelectItem>
                  <SelectItem value="semanal">Semanais</SelectItem>
                  <SelectItem value="mensal">Mensais</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <p>Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasksFiltradas.map((task) => {
                      const funcionarioNome = task.funcionario_id 
                        ? funcionarios.find(f => f.id === task.funcionario_id)?.nome || '-'
                        : '-';
                      
                      return (
                        <TableRow key={task.id}>
                          <TableCell>{task.titulo}</TableCell>
                          <TableCell className="capitalize">{task.tipo}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={getTaskStatusColor(task)}>
                                {getTaskStatusLabel(task)}
                              </span>
                              {isPrazoExpirado(task.data_prazo, task.status) && (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {task.data_prazo ? (
                              <span className={isPrazoExpirado(task.data_prazo, task.status) ? 'text-red-600 font-semibold' : ''}>
                                {formatDateBR(task.data_prazo)}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>{funcionarioNome}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTask(task)}
                                  >
                                    <Eye size={16} />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Detalhes da Task</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-muted-foreground">Título</Label>
                                      <p className="text-lg font-semibold">{task.titulo}</p>
                                    </div>
                                    <div>
                                      <Label className="text-muted-foreground">Descrição</Label>
                                      <p className="text-foreground whitespace-pre-wrap">{task.descricao || 'Sem descrição'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-muted-foreground">Tipo</Label>
                                        <p className="capitalize">{task.tipo}</p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Status</Label>
                                        <p className={getTaskStatusColor(task) + " font-semibold"}>
                                          {getTaskStatusLabel(task)}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Prazo</Label>
                                        <p className={isPrazoExpirado(task.data_prazo, task.status) ? 'text-red-600 font-semibold' : ''}>
                                          {task.data_prazo ? formatDateBR(task.data_prazo) : 'Sem prazo definido'}
                                        </p>
                                      </div>
                                      <div>
                                        <Label className="text-muted-foreground">Funcionário</Label>
                                        <p>{funcionarioNome}</p>
                                      </div>
                                    </div>
                                    {isPrazoExpirado(task.data_prazo, task.status) && (
                                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-red-600">
                                          <AlertCircle className="w-5 h-5" />
                                          <span className="font-semibold">Prazo Ultrapassado</span>
                                        </div>
                                        <p className="text-sm text-red-600 mt-1">
                                          Esta task não foi cumprida dentro do prazo estabelecido.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingTaskId(task.id);
                                  setTaskFormData({
                                    titulo: task.titulo,
                                    descricao: task.descricao || "",
                                    tipo: task.tipo,
                                    status: task.status,
                                    funcionario_id: task.funcionario_id,
                                    data_prazo: task.data_prazo ? formatDateBR(task.data_prazo) : "",
                                  });
                                }}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funcionarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingFuncId ? "Editar Funcionário" : "Novo Funcionário"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFuncSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={funcFormData.nome}
                      onChange={(e) => setFuncFormData({ ...funcFormData, nome: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="funcao">Função</Label>
                    <Input
                      id="funcao"
                      value={funcFormData.funcao}
                      onChange={(e) => setFuncFormData({ ...funcFormData, funcao: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingFuncId ? "Atualizar" : "Adicionar"}
                  </Button>
                  {editingFuncId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingFuncId(null);
                        setFuncFormData({ nome: "", funcao: "" });
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
              <CardTitle>Lista de Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFunc ? (
                <p>Carregando...</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {funcionarios.map((func) => (
                      <TableRow key={func.id}>
                        <TableCell>{func.nome}</TableCell>
                        <TableCell>{func.funcao}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingFuncId(func.id);
                                setFuncFormData({
                                  nome: func.nome,
                                  funcao: func.funcao,
                                });
                              }}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFunc(func.id)}
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
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selecione um Funcionário</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedFuncionario || ""} onValueChange={setSelectedFuncionario}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funcionário" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {stats && funcionarioSelecionado && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <User className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tasks Atribuídas</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Concluídas</p>
                      <p className="text-2xl font-bold">{stats.concluidas}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Clock className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pendentes</p>
                      <p className="text-2xl font-bold">{stats.pendentes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-2xl font-bold">{stats.taxa}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Progresso Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={stats.taxa} className="h-4" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {stats.concluidas} de {stats.total} tasks concluídas
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksTab;
