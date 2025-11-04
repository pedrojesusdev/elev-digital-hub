-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL,
  localidade TEXT NOT NULL,
  telefone TEXT NOT NULL,
  instagram TEXT,
  email TEXT,
  observacoes TEXT,
  status TEXT NOT NULL DEFAULT 'Não contatado',
  origem TEXT NOT NULL DEFAULT 'formulario',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for contact form)
CREATE POLICY "Allow public insert" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow all operations for authenticated users (admin panel)
CREATE POLICY "Allow authenticated users full access" 
ON public.leads 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_timestamp
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_updated_at();

-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;