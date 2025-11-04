import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, UserX, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  email_verified: boolean;
  role?: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSuperAdmin } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const rolesMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);

      const usersWithRoles = profiles?.map((profile) => ({
        ...profile,
        role: rolesMap.get(profile.id),
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingRole) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId);

        if (error) throw error;
      }

      if (newRole !== "none") {
        const { error } = await supabase
          .from("user_roles")
          .insert([{ 
            user_id: userId, 
            role: newRole as "super_admin" | "admin" | "readonly"
          }]);

        if (error) throw error;
      }

      toast.success("Permissão atualizada com sucesso");
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Erro ao atualizar permissão");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast.success("Usuário excluído com sucesso");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao excluir usuário");
    }
  };

  const getRoleBadge = (role?: string) => {
    if (!role) {
      return <Badge variant="secondary">Sem permissão</Badge>;
    }

    const roleMap = {
      super_admin: { label: "Super Admin", variant: "default" as const },
      admin: { label: "Admin", variant: "default" as const },
      readonly: { label: "Somente Leitura", variant: "secondary" as const },
    };

    const roleInfo = roleMap[role as keyof typeof roleMap];
    return <Badge variant={roleInfo?.variant}>{roleInfo?.label}</Badge>;
  };

  if (!isSuperAdmin) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
          <p className="text-muted-foreground">
            Apenas Super Administradores podem gerenciar usuários.
          </p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Gerenciamento de Usuários</h2>
        <p className="text-muted-foreground">
          Gerencie permissões e acesso dos usuários do painel
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Cadastro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {user.email_verified ? (
                  <Badge variant="default">Verificado</Badge>
                ) : (
                  <Badge variant="secondary">Não verificado</Badge>
                )}
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={user.role || "none"}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem permissão</SelectItem>
                      <SelectItem value="readonly">Somente Leitura</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum usuário cadastrado
        </div>
      )}
    </Card>
  );
};

export default UsersTab;
