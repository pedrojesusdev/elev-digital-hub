import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Obrigado!
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Recebemos sua mensagem com sucesso. Nossa equipe entrará em contato em breve.
          </p>
          
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default ThankYou;
