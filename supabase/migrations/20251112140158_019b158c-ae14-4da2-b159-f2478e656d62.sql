-- Adicionar o tipo "nao_qualificado" ao enum lead_tipo
ALTER TYPE lead_tipo ADD VALUE IF NOT EXISTS 'nao_qualificado';