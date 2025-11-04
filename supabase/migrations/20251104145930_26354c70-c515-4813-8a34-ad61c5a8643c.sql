-- Add tem_site column to leads table
ALTER TABLE public.leads 
ADD COLUMN tem_site boolean DEFAULT false;