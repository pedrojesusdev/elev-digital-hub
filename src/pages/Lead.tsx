import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Lead = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Voltar ao início
            </Link>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Vamos conversar?
              </h1>
              <p className="text-xl text-muted-foreground">
                Preencha o formulário e receba um diagnóstico gratuito da sua
                empresa
              </p>
            </div>

            <Card className="p-8 shadow-lg">
              <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center text-muted-foreground p-8">
                  <p className="text-lg mb-2">
                    Formulário de contato será integrado aqui
                  </p>
                  <p className="text-sm">
                    (Integração com n8n será adicionada posteriormente)
                  </p>
                </div>
              </div>
            </Card>

            <div className="text-center mt-8">
              <Link to="/">
                <Button variant="outline" size="lg">
                  Voltar ao início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Lead;
