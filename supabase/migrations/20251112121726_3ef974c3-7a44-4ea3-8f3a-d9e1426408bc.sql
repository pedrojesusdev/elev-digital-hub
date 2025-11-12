-- Atualizar todos os usuários com role 'admin' para 'readonly'
UPDATE public.user_roles 
SET role = 'readonly'::app_role 
WHERE role = 'admin'::app_role;

-- Atualizar a tabela leads para usar novos status
-- Primeiro, atualizar os valores existentes
UPDATE public.leads 
SET status_contato = CASE 
  WHEN status_contato = 'Não contatado' THEN 'Leads'
  WHEN status_contato = 'Contatado' THEN 'Conseguiu contato'
  WHEN status_contato = 'Em negociação' THEN 'Marcou reunião'
  WHEN status_contato = 'Convertido' THEN 'Fechado'
  ELSE status_contato
END;

-- Adicionar constraint para validar apenas os novos status
ALTER TABLE public.leads 
  DROP CONSTRAINT IF EXISTS leads_status_contato_check;

ALTER TABLE public.leads 
  ADD CONSTRAINT leads_status_contato_check 
  CHECK (status_contato IN ('Leads', 'Conseguiu contato', 'Marcou reunião', 'Proposta enviada', 'Aguardando fechamento', 'Fechado'));