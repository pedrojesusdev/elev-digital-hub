-- Fix update_leads_updated_at function to have immutable search_path
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;