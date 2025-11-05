-- Add text fields for Google Ads and Meta Ads to trafego_pago table
ALTER TABLE public.trafego_pago
ADD COLUMN google_ads_texto text,
ADD COLUMN meta_ads_texto text;