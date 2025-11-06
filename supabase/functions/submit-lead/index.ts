import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// SECURITY NOTE: This endpoint is publicly accessible (verify_jwt: false in config.toml)
// Consider implementing:
// 1. Rate limiting per IP (e.g., 5 submissions per hour)
// 2. CAPTCHA verification (hCaptcha/reCAPTCHA)
// 3. Honeypot fields to catch bots
// 4. IP-based submission logging for abuse detection

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadSubmission {
  name?: string;
  empresa: string;
  localidade: string;
  telefone: string;
  instagram?: string;
  email?: string;
  observacoes?: string;
  tem_site?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadSubmission = await req.json();

    console.log('Received lead submission:', { empresa: leadData.empresa, localidade: leadData.localidade });

    // Validação básica
    if (!leadData.empresa || !leadData.localidade || !leadData.telefone) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios faltando: empresa, localidade e telefone' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validação de tamanho dos campos
    if (leadData.empresa.length > 200 || 
        leadData.localidade.length > 200 || 
        leadData.telefone.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Um ou mais campos excedem o tamanho máximo permitido' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validação de email se fornecido
    if (leadData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(leadData.email) || leadData.email.length > 255) {
        return new Response(
          JSON.stringify({ error: 'Email inválido' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Criar cliente Supabase com service role para inserir dados
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Inserir lead no banco de dados
    const observacoesCompletas = leadData.name 
      ? `Nome: ${leadData.name}\n\n${leadData.observacoes || ''}`
      : leadData.observacoes;

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          empresa: leadData.empresa.trim(),
          localidade: leadData.localidade.trim(),
          telefone: leadData.telefone.trim(),
          instagram: leadData.instagram?.trim() || null,
          email: leadData.email?.trim() || null,
          observacoes: observacoesCompletas?.trim() || null,
          tem_site: leadData.tem_site ?? false,
          status_contato: 'Não contatado',
          origem: 'formulario',
          tipo: 'lead',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting lead:', error);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar lead' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Lead inserted successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in submit-lead function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
