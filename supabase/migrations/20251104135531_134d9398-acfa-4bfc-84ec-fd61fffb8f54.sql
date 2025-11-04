-- Create tables for all admin dashboard data

-- Table for Leads Management (LeadsTab)
CREATE TABLE IF NOT EXISTS public.leads_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  nota TEXT NOT NULL CHECK (nota IN ('Quente', 'Médio', 'Frio')),
  faturamento TEXT NOT NULL,
  alcance TEXT NOT NULL,
  relatorio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for Monthly Reports (ReportsTab)
CREATE TABLE IF NOT EXISTS public.monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mes TEXT NOT NULL,
  clientes INTEGER NOT NULL DEFAULT 0,
  servicos INTEGER NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  faturamento INTEGER NOT NULL DEFAULT 0,
  analise TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for Automations (AutomationsTab)
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  tipo TEXT NOT NULL,
  detalhes TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Ativa', 'Pendente', 'Finalizada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for Calendar Events (CalendarioTab)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  data_fim DATE NOT NULL,
  hora_fim TIME NOT NULL,
  descricao TEXT,
  empresa TEXT,
  google_event_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for Social Media Services (SocialMediaTab)
CREATE TABLE IF NOT EXISTS public.social_media_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  campanha TEXT NOT NULL,
  descricao TEXT NOT NULL,
  periodo TEXT NOT NULL,
  metas TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Ativa', 'Pausada', 'Finalizada')),
  videos_gravados INTEGER NOT NULL DEFAULT 0,
  posts_publicados INTEGER NOT NULL DEFAULT 0,
  alcance_total INTEGER NOT NULL DEFAULT 0,
  engajamento_medio INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.leads_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads_management
CREATE POLICY "Admins can manage leads_management"
ON public.leads_management
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Readonly users can view leads_management"
ON public.leads_management
FOR SELECT
USING (has_role(auth.uid(), 'readonly'::app_role));

-- RLS Policies for monthly_reports
CREATE POLICY "Admins can manage monthly_reports"
ON public.monthly_reports
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Readonly users can view monthly_reports"
ON public.monthly_reports
FOR SELECT
USING (has_role(auth.uid(), 'readonly'::app_role));

-- RLS Policies for automations
CREATE POLICY "Admins can manage automations"
ON public.automations
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Readonly users can view automations"
ON public.automations
FOR SELECT
USING (has_role(auth.uid(), 'readonly'::app_role));

-- RLS Policies for calendar_events
CREATE POLICY "Admins can manage calendar_events"
ON public.calendar_events
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Readonly users can view calendar_events"
ON public.calendar_events
FOR SELECT
USING (has_role(auth.uid(), 'readonly'::app_role));

-- RLS Policies for social_media_services
CREATE POLICY "Admins can manage social_media_services"
ON public.social_media_services
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Readonly users can view social_media_services"
ON public.social_media_services
FOR SELECT
USING (has_role(auth.uid(), 'readonly'::app_role));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_management_updated_at
BEFORE UPDATE ON public.leads_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_reports_updated_at
BEFORE UPDATE ON public.monthly_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
BEFORE UPDATE ON public.automations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_services_updated_at
BEFORE UPDATE ON public.social_media_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads_management;
ALTER PUBLICATION supabase_realtime ADD TABLE public.monthly_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.automations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_media_services;