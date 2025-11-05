import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Zap, BarChart3, Share2, LogOut, Search, Calendar as CalendarIcon, Shield, CheckSquare, TrendingUp } from "lucide-react";
import LeadsTab from "@/components/admin/LeadsTab";
import AutomationsTab from "@/components/admin/AutomationsTab";
import ReportsTab from "@/components/admin/ReportsTab";
import SocialMediaTab from "@/components/admin/SocialMediaTab";
import ProspeccaoTab from "@/components/admin/ProspeccaoTab";
import CalendarioTab from "@/components/admin/CalendarioTab";
import UsersTab from "@/components/admin/UsersTab";
import TasksTab from "@/components/admin/TasksTab";
import TrafegoTab from "@/components/admin/TrafegoTab";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const { signOut, user, isSuperAdmin } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background relative">
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Painel Elev Business</h1>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border hover:bg-muted"
                onClick={signOut}
              >
                <LogOut className="mr-2" size={16} />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <div className="pt-[57px] container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="max-w-6xl mx-auto mb-8 mt-6 space-y-2">
              <TabsList className="grid w-full bg-secondary grid-cols-5">
                <TabsTrigger value="leads" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <Users className="mr-2" size={16} />
                  Leads
                </TabsTrigger>
                <TabsTrigger value="prospeccao" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <Search className="mr-2" size={16} />
                  Prospecção
                </TabsTrigger>
                <TabsTrigger value="calendario" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <CalendarIcon className="mr-2" size={16} />
                  Calendário
                </TabsTrigger>
                <TabsTrigger value="automations" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <Zap className="mr-2" size={16} />
                  Automações
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <CheckSquare className="mr-2" size={16} />
                  Tasks
                </TabsTrigger>
              </TabsList>
              
              <TabsList className={`grid w-full bg-secondary ${isSuperAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="reports" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <BarChart3 className="mr-2" size={16} />
                  Relatórios
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <Share2 className="mr-2" size={16} />
                  Social Media
                </TabsTrigger>
                <TabsTrigger value="trafego" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                  <TrendingUp className="mr-2" size={16} />
                  Tráfego
                </TabsTrigger>
                {isSuperAdmin && (
                  <TabsTrigger value="users" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
                    <Shield className="mr-2" size={16} />
                    Usuários
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

          <TabsContent value="leads" className="mt-0">
            <LeadsTab />
          </TabsContent>

          <TabsContent value="prospeccao" className="mt-0">
            <ProspeccaoTab />
          </TabsContent>

          <TabsContent value="calendario" className="mt-0">
            <CalendarioTab />
          </TabsContent>

          <TabsContent value="automations" className="mt-0">
            <AutomationsTab />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="social" className="mt-0">
            <SocialMediaTab />
          </TabsContent>

          <TabsContent value="tasks" className="mt-0">
            <TasksTab />
          </TabsContent>

          <TabsContent value="trafego" className="mt-0">
            <TrafegoTab />
          </TabsContent>

          {isSuperAdmin && (
            <TabsContent value="users" className="mt-0">
              <UsersTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
