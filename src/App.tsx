import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Login from "./pages/Login";
import ContactMultiStep from "./pages/ContactMultiStep";
import AdminDashboard from "./pages/AdminDashboard";
import LeadDetail from "./pages/LeadDetail";
import ThankYou from "./pages/ThankYou";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contato-novo" element={<ContactMultiStep />} />
            <Route path="/obrigado" element={<ThankYou />} />
            <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lead/:id" element={<LeadDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
