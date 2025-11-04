-- Remover policy de inserção pública insegura
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;

-- Criar policy para inserção apenas por usuários autenticados (admins)
CREATE POLICY "Authenticated admins can insert leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'super_admin') OR 
  public.has_role(auth.uid(), 'admin')
);