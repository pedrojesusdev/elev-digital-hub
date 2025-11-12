-- Adicionar "Não qualificado" ao status_contato
-- Primeiro vamos ver se precisamos atualizar algum dado existente
UPDATE leads 
SET status_contato = 'Não qualificado' 
WHERE nota = 'nao_qualificado';

-- Atualizar as notas que eram nao_qualificado para null
UPDATE leads 
SET nota = NULL 
WHERE nota = 'nao_qualificado';