export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      automations: {
        Row: {
          created_at: string | null
          detalhes: string
          empresa: string
          id: string
          status: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detalhes: string
          empresa: string
          id?: string
          status: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detalhes?: string
          empresa?: string
          id?: string
          status?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          categoria_empresa:
            | Database["public"]["Enums"]["evento_categoria_empresa"]
            | null
          categoria_servicos:
            | Database["public"]["Enums"]["evento_categoria_servicos"]
            | null
          created_at: string | null
          data_fim: string
          data_inicio: string
          descricao: string | null
          empresa: string | null
          google_event_id: string | null
          hora_fim: string
          hora_inicio: string
          id: string
          tipo: Database["public"]["Enums"]["evento_tipo"]
          titulo: string
          updated_at: string | null
        }
        Insert: {
          categoria_empresa?:
            | Database["public"]["Enums"]["evento_categoria_empresa"]
            | null
          categoria_servicos?:
            | Database["public"]["Enums"]["evento_categoria_servicos"]
            | null
          created_at?: string | null
          data_fim: string
          data_inicio: string
          descricao?: string | null
          empresa?: string | null
          google_event_id?: string | null
          hora_fim: string
          hora_inicio: string
          id?: string
          tipo?: Database["public"]["Enums"]["evento_tipo"]
          titulo: string
          updated_at?: string | null
        }
        Update: {
          categoria_empresa?:
            | Database["public"]["Enums"]["evento_categoria_empresa"]
            | null
          categoria_servicos?:
            | Database["public"]["Enums"]["evento_categoria_servicos"]
            | null
          created_at?: string | null
          data_fim?: string
          data_inicio?: string
          descricao?: string | null
          empresa?: string | null
          google_event_id?: string | null
          hora_fim?: string
          hora_inicio?: string
          id?: string
          tipo?: Database["public"]["Enums"]["evento_tipo"]
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      funcionarios: {
        Row: {
          created_at: string
          empresa: string
          funcao: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa: string
          funcao: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa?: string
          funcao?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          alcance_estimado: string | null
          alcance_instagram: string | null
          created_at: string
          email: string | null
          empresa: string
          faturamento_estimado: string | null
          faturamento_mensal: string | null
          id: string
          instagram: string | null
          localidade: string
          nota: Database["public"]["Enums"]["lead_nota"] | null
          observacoes: string | null
          origem: string
          status_contato: string
          telefone: string
          tem_site: boolean | null
          tipo: Database["public"]["Enums"]["lead_tipo"]
          updated_at: string
        }
        Insert: {
          alcance_estimado?: string | null
          alcance_instagram?: string | null
          created_at?: string
          email?: string | null
          empresa: string
          faturamento_estimado?: string | null
          faturamento_mensal?: string | null
          id?: string
          instagram?: string | null
          localidade: string
          nota?: Database["public"]["Enums"]["lead_nota"] | null
          observacoes?: string | null
          origem?: string
          status_contato?: string
          telefone: string
          tem_site?: boolean | null
          tipo?: Database["public"]["Enums"]["lead_tipo"]
          updated_at?: string
        }
        Update: {
          alcance_estimado?: string | null
          alcance_instagram?: string | null
          created_at?: string
          email?: string | null
          empresa?: string
          faturamento_estimado?: string | null
          faturamento_mensal?: string | null
          id?: string
          instagram?: string | null
          localidade?: string
          nota?: Database["public"]["Enums"]["lead_nota"] | null
          observacoes?: string | null
          origem?: string
          status_contato?: string
          telefone?: string
          tem_site?: boolean | null
          tipo?: Database["public"]["Enums"]["lead_tipo"]
          updated_at?: string
        }
        Relationships: []
      }
      leads_management: {
        Row: {
          alcance: string
          created_at: string | null
          empresa: string
          faturamento: string
          id: string
          nota: string
          relatorio: string | null
          updated_at: string | null
        }
        Insert: {
          alcance: string
          created_at?: string | null
          empresa: string
          faturamento: string
          id?: string
          nota: string
          relatorio?: string | null
          updated_at?: string | null
        }
        Update: {
          alcance?: string
          created_at?: string | null
          empresa?: string
          faturamento?: string
          id?: string
          nota?: string
          relatorio?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      monthly_reports: {
        Row: {
          analise: string
          clientes: number
          created_at: string | null
          faturamento: number
          id: string
          leads: number
          mes: string
          servicos: number
          updated_at: string | null
        }
        Insert: {
          analise: string
          clientes?: number
          created_at?: string | null
          faturamento?: number
          id?: string
          leads?: number
          mes: string
          servicos?: number
          updated_at?: string | null
        }
        Update: {
          analise?: string
          clientes?: number
          created_at?: string | null
          faturamento?: number
          id?: string
          leads?: number
          mes?: string
          servicos?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string
          id: string
          updated_at: string
          user_company: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name: string
          id: string
          updated_at?: string
          user_company?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string
          id?: string
          updated_at?: string
          user_company?: string | null
        }
        Relationships: []
      }
      social_media_services: {
        Row: {
          alcance_total: number
          campanha: string
          created_at: string | null
          descricao: string
          empresa: string
          engajamento_medio: number
          id: string
          meta_carrosseis: number | null
          meta_posts_estaticos: number | null
          meta_posts_linkedin: number | null
          meta_videos_curtos: number | null
          meta_videos_longos: number | null
          metas: string
          periodo: string
          posts_publicados: number
          realizados_carrosseis: number | null
          realizados_posts_estaticos: number | null
          realizados_posts_linkedin: number | null
          realizados_videos_curtos: number | null
          realizados_videos_longos: number | null
          status: string
          updated_at: string | null
          videos_gravados: number
        }
        Insert: {
          alcance_total?: number
          campanha: string
          created_at?: string | null
          descricao: string
          empresa: string
          engajamento_medio?: number
          id?: string
          meta_carrosseis?: number | null
          meta_posts_estaticos?: number | null
          meta_posts_linkedin?: number | null
          meta_videos_curtos?: number | null
          meta_videos_longos?: number | null
          metas: string
          periodo: string
          posts_publicados?: number
          realizados_carrosseis?: number | null
          realizados_posts_estaticos?: number | null
          realizados_posts_linkedin?: number | null
          realizados_videos_curtos?: number | null
          realizados_videos_longos?: number | null
          status: string
          updated_at?: string | null
          videos_gravados?: number
        }
        Update: {
          alcance_total?: number
          campanha?: string
          created_at?: string | null
          descricao?: string
          empresa?: string
          engajamento_medio?: number
          id?: string
          meta_carrosseis?: number | null
          meta_posts_estaticos?: number | null
          meta_posts_linkedin?: number | null
          meta_videos_curtos?: number | null
          meta_videos_longos?: number | null
          metas?: string
          periodo?: string
          posts_publicados?: number
          realizados_carrosseis?: number | null
          realizados_posts_estaticos?: number | null
          realizados_posts_linkedin?: number | null
          realizados_videos_curtos?: number | null
          realizados_videos_longos?: number | null
          status?: string
          updated_at?: string | null
          videos_gravados?: number
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          data_conclusao: string | null
          descricao: string | null
          empresa: string
          funcionario_id: string | null
          id: string
          status: Database["public"]["Enums"]["task_status"]
          tipo: Database["public"]["Enums"]["task_tipo"]
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_conclusao?: string | null
          descricao?: string | null
          empresa: string
          funcionario_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          tipo: Database["public"]["Enums"]["task_tipo"]
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_conclusao?: string | null
          descricao?: string | null
          empresa?: string
          funcionario_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          tipo?: Database["public"]["Enums"]["task_tipo"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      trafego_pago: {
        Row: {
          created_at: string
          empresa: string
          google_ads_investido: number
          google_ads_texto: string | null
          id: string
          meta_ads_investido: number
          meta_ads_texto: string | null
          metas: string | null
          pecas_estatico: number
          pecas_video: number
          periodo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          empresa: string
          google_ads_investido?: number
          google_ads_texto?: string | null
          id?: string
          meta_ads_investido?: number
          meta_ads_texto?: string | null
          metas?: string | null
          pecas_estatico?: number
          pecas_video?: number
          periodo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          empresa?: string
          google_ads_investido?: number
          google_ads_texto?: string | null
          id?: string
          meta_ads_investido?: number
          meta_ads_texto?: string | null
          metas?: string | null
          pecas_estatico?: number
          pecas_video?: number
          periodo?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "readonly"
      evento_categoria_empresa:
        | "all_hands"
        | "comunicacao"
        | "magic_number"
        | "tecnologia"
        | "marketing"
        | "comercial"
        | "estrategia"
        | "diretoria"
        | "analise_metas"
      evento_categoria_servicos:
        | "reuniao_diagnostico"
        | "reuniao_fechamento"
        | "followup"
        | "relacionamento"
      evento_tipo: "servicos" | "empresa"
      lead_nota: "quente" | "medio" | "frio"
      lead_tipo: "prospecto" | "lead" | "cliente"
      task_status: "pendente" | "concluida"
      task_tipo: "diaria" | "semanal" | "mensal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "readonly"],
      evento_categoria_empresa: [
        "all_hands",
        "comunicacao",
        "magic_number",
        "tecnologia",
        "marketing",
        "comercial",
        "estrategia",
        "diretoria",
        "analise_metas",
      ],
      evento_categoria_servicos: [
        "reuniao_diagnostico",
        "reuniao_fechamento",
        "followup",
        "relacionamento",
      ],
      evento_tipo: ["servicos", "empresa"],
      lead_nota: ["quente", "medio", "frio"],
      lead_tipo: ["prospecto", "lead", "cliente"],
      task_status: ["pendente", "concluida"],
      task_tipo: ["diaria", "semanal", "mensal"],
    },
  },
} as const
