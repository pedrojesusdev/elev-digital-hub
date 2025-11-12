-- Adicionar "nao_qualificado" ao enum de nota
ALTER TYPE lead_nota ADD VALUE IF NOT EXISTS 'nao_qualificado';

-- Adicionar novos campos opcionais
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ticket_medio TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quantidade_funcionarios INTEGER;

-- Remover a coluna tipo (primeiro atualizar todos os registros para um valor padrão)
ALTER TABLE leads ALTER COLUMN tipo DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN tipo SET DEFAULT NULL;