import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Zap, BarChart3, Share2, LogOut } from "lucide-react";
import LeadsTab from "@/components/admin/LeadsTab";
import AutomationsTab from "@/components/admin/AutomationsTab";
import ReportsTab from "@/components/admin/ReportsTab";
import SocialMediaTab from "@/components/admin/SocialMediaTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("leads");

  return (
    <div className="min-h-screen bg-background relative">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel Elev Business</h1>
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-border hover:bg-muted">
                <LogOut className="mr-2" size={16} />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-[73px] container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 bg-secondary">
            <TabsTrigger value="leads" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
              <Users className="mr-2" size={16} />
              Leads
            </TabsTrigger>
            <TabsTrigger value="automations" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
              <Zap className="mr-2" size={16} />
              Automatizações
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
              <BarChart3 className="mr-2" size={16} />
              Relatórios
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-foreground data-[state=active]:text-background">
              <Share2 className="mr-2" size={16} />
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="mt-0">
            <LeadsTab />
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
