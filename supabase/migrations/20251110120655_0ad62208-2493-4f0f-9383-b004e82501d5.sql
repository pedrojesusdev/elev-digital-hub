-- Adicionar campos opcionais de faturamento mensal e alcance do Instagram
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS faturamento_mensal text,
ADD COLUMN IF NOT EXISTS alcance_instagram text;