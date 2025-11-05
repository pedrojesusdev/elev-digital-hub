-- 1. Criar enum para nota do lead
CREATE TYPE public.lead_nota AS ENUM ('quente', 'medio', 'frio');

-- 2. Criar enum para tipo de lead
CREATE TYPE public.lead_tipo AS ENUM ('prospecto', 'lead', 'cliente');

-- 3. Atualizar tabela leads com novos campos
ALTER TABLE public.leads
ADD COLUMN tipo public.lead_tipo NOT NULL DEFAULT 'prospecto',
ADD COLUMN nota public.lead_nota,
ADD COLUMN faturamento_estimado text,
ADD COLUMN alcance_estimado text;

-- Renomear coluna status para status_contato para clareza
ALTER TABLE public.leads
RENAME COLUMN status TO status_contato;

-- 4. Criar tabela de funcionários
CREATE TABLE public.funcionarios (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  funcao text NOT NULL,
  empresa text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view funcionarios from their company"
ON public.funcionarios
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) 
  OR (
    (has_role(auth.uid(), 'readonly'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
    AND empresa = get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage funcionarios for their company"
ON public.funcionarios
FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
);

-- 5. Criar tabela de tasks
CREATE TYPE public.task_tipo AS ENUM ('diaria', 'semanal', 'mensal');
CREATE TYPE public.task_status AS ENUM ('pendente', 'concluida');

CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo text NOT NULL,
  descricao text,
  tipo public.task_tipo NOT NULL,
  status public.task_status NOT NULL DEFAULT 'pendente',
  funcionario_id uuid REFERENCES public.funcionarios(id) ON DELETE SET NULL,
  empresa text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  data_conclusao timestamp with time zone
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view tasks from their company"
ON public.tasks
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    (has_role(auth.uid(), 'readonly'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
    AND empresa = get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage tasks for their company"
ON public.tasks
FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
);

-- 6. Criar tabela de tráfego pago
CREATE TABLE public.trafego_pago (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  periodo text NOT NULL,
  google_ads_investido numeric(10, 2) NOT NULL DEFAULT 0,
  meta_ads_investido numeric(10, 2) NOT NULL DEFAULT 0,
  pecas_video integer NOT NULL DEFAULT 0,
  pecas_estatico integer NOT NULL DEFAULT 0,
  metas text,
  empresa text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.trafego_pago ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view trafego from their company"
ON public.trafego_pago
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (
    (has_role(auth.uid(), 'readonly'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
    AND empresa = get_user_company(auth.uid())
  )
);

CREATE POLICY "Admins can manage trafego for their company"
ON public.trafego_pago
FOR ALL
USING (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
)
WITH CHECK (
  has_role(auth.uid(), 'super_admin'::app_role)
  OR (has_role(auth.uid(), 'admin'::app_role) AND empresa = get_user_company(auth.uid()))
);

-- 7. Atualizar tabela social_media_services com campos de metas detalhadas
ALTER TABLE public.social_media_services
ADD COLUMN meta_videos_longos integer DEFAULT 0,
ADD COLUMN meta_videos_curtos integer DEFAULT 0,
ADD COLUMN meta_posts_estaticos integer DEFAULT 0,
ADD COLUMN meta_carrosseis integer DEFAULT 0,
ADD COLUMN meta_posts_linkedin integer DEFAULT 0,
ADD COLUMN realizados_videos_longos integer DEFAULT 0,
ADD COLUMN realizados_videos_curtos integer DEFAULT 0,
ADD COLUMN realizados_posts_estaticos integer DEFAULT 0,
ADD COLUMN realizados_carrosseis integer DEFAULT 0,
ADD COLUMN realizados_posts_linkedin integer DEFAULT 0;

-- 8. Criar enum para categorias de eventos
CREATE TYPE public.evento_categoria_servicos AS ENUM (
  'reuniao_diagnostico',
  'reuniao_fechamento',
  'followup',
  'relacionamento'
);

CREATE TYPE public.evento_categoria_empresa AS ENUM (
  'all_hands',
  'comunicacao',
  'magic_number',
  'tecnologia',
  'marketing',
  'comercial',
  'estrategia',
  'diretoria',
  'analise_metas'
);

CREATE TYPE public.evento_tipo AS ENUM ('servicos', 'empresa');

-- 9. Atualizar tabela calendar_events
ALTER TABLE public.calendar_events
ADD COLUMN tipo public.evento_tipo NOT NULL DEFAULT 'servicos',
ADD COLUMN categoria_servicos public.evento_categoria_servicos,
ADD COLUMN categoria_empresa public.evento_categoria_empresa;

-- 10. Criar triggers para updated_at
CREATE TRIGGER update_funcionarios_updated_at
  BEFORE UPDATE ON public.funcionarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trafego_pago_updated_at
  BEFORE UPDATE ON public.trafego_pago
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();