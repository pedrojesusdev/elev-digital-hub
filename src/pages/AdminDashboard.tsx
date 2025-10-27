import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Zap, BarChart3, LogOut } from "lucide-react";

const menuItems = [
  {
    icon: Users,
    title: "Leads recebidos",
    description: "Gerencie seus contatos",
  },
  {
    icon: Zap,
    title: "Automatizações",
    description: "Configure processos automatizados",
  },
  {
    icon: BarChart3,
    title: "Relatórios",
    description: "Visualize métricas e resultados",
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Painel Elev Business</h1>
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogOut className="mr-2" size={16} />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-73px)] border-r border-border bg-card p-6">
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
              >
                <item.icon size={20} className="text-muted-foreground" />
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
            <Link to="/login" className="block">
              <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-destructive">
                <LogOut size={20} />
                <span className="font-medium">Sair</span>
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold mb-8">Bem-vindo ao Painel</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mb-4">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                  <Button variant="link" className="px-0 mt-4">
                    Acessar →
                  </Button>
                </Card>
              ))}
            </div>

            <Card className="mt-8 p-8 bg-muted/50">
              <p className="text-center text-muted-foreground">
                Esta é uma versão simulada do painel administrativo.
                <br />
                As funcionalidades completas serão implementadas conforme necessário.
              </p>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
