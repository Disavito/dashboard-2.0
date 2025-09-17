export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cuentas: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      ingresos: {
        Row: {
          id: number
          created_at: string
          account: string
          amount: number
          transaction_type: string // 'Ingreso' | 'Anulacion' | 'Devolucion'
          receipt_number: string | null
          dni: string | null
          full_name: string | null
          numeroOperacion: string | null
          date: string // ¡NUEVO! Añadido para la fecha de la transacción
        }
        Insert: {
          id?: number
          created_at?: string
          account: string
          amount: number
          transaction_type: string
          receipt_number?: string | null
          dni?: string | null
          full_name?: string | null
          numeroOperacion?: string | null
          date: string // ¡NUEVO!
        }
        Update: {
          id?: number
          created_at?: string
          account?: string
          amount?: number
          transaction_type?: string
          receipt_number?: string | null
          dni?: string | null
          full_name?: string | null
          numeroOperacion?: string | null
          date?: string // ¡NUEVO!
        }
        Relationships: []
      }
      gastos: {
        Row: {
          id: number
          created_at: string
          account: string
          amount: number
          date: string
          description: string | null
          category: string | null
          sub_category: string | null
          numero_gasto: string | null
          colaborador_id: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          account: string
          amount: number
          date: string
          description?: string | null
          category?: string | null
          sub_category?: string | null
          numero_gasto?: string | null
          colaborador_id?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          account?: string
          amount?: number
          date?: string
          description?: string | null
          category?: string | null
          sub_category?: string | null
          numero_gasto?: string | null
          colaborador_id?: string | null
        }
        Relationships: []
      }
      socio_titulares: {
        Row: {
          id: string // Changed to string (UUID)
          created_at: string
          dni: string
          nombres: string
          apellidoPaterno: string
          apellidoMaterno: string
          fechaNacimiento: string
          edad: number | null
          celular: string | null
          situacionEconomica: string // 'Pobre' | 'Extremo Pobre'
          direccionDNI: string
          regionDNI: string
          provinciaDNI: string
          distritoDNI: string
          localidad: string
          regionVivienda: string | null
          provinciaVivienda: string | null
          distritoVivienda: string | null
          direccionVivienda: string | null
          mz: string | null
          lote: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          dni: string
          nombres: string
          apellidoPaterno: string
          apellidoMaterno: string
          fechaNacimiento: string
          edad?: number | null
          celular?: string | null
          situacionEconomica: string
          direccionDNI: string
          regionDNI: string
          provinciaDNI: string
          distritoDNI: string
          localidad: string
          regionVivienda?: string | null
          provinciaVivienda?: string | null
          distritoVivienda?: string | null
          direccionVivienda?: string | null
          mz?: string | null
          lote?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          dni?: string
          nombres?: string
          apellidoPaterno?: string
          apellidoMaterno?: string
          fechaNacimiento?: string
          edad?: number | null
          celular?: string | null
          situacionEconomica?: string
          direccionDNI?: string
          regionDNI?: string
          provinciaDNI?: string
          distritoDNI?: string
          localidad?: string
          regionVivienda?: string | null
          provinciaVivienda?: string | null
          distritoVivienda?: string | null
          direccionVivienda?: string | null
          mz?: string | null
          lote?: string | null
        }
        Relationships: []
      }
      colaboradores: {
        Row: {
          id: string // UUID
          created_at: string
          name: string
          apellidos: string
          dni: string
          email: string | null
          phone: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          apellidos: string
          dni: string
          email?: string | null
          phone?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          apellidos?: string
          dni?: string
          email?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string // UUID, references auth.users
          created_at: string
          role: string // 'Admin' | 'Engineer'
        }
        Insert: {
          id: string
          created_at?: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      socio_documentos: {
        Row: {
          id: string // UUID
          socio_id: string // UUID, references socio_titulares
          tipo_documento: 'Ficha' | 'Contrato' | 'Declaración jurada del terreno' | 'Declaración jurada de la prohibición venta 10 años' | 'Memoria descriptiva' | 'Planos de ubicación' | 'Plano perimétrico'
          link_documento: string | null
          subido_manual: boolean | null
          impreso: boolean | null
          confirmado: boolean | null
          created_at: string // Added for consistency
        }
        Insert: {
          id?: string
          socio_id: string
          tipo_documento: 'Ficha' | 'Contrato' | 'Declaración jurada del terreno' | 'Declaración jurada de la prohibición venta 10 años' | 'Memoria descriptiva' | 'Planos de ubicación' | 'Plano perimétrico'
          link_documento?: string | null
          subido_manual?: boolean | null
          impreso?: boolean | null
          confirmado?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          socio_id?: string
          tipo_documento?: 'Ficha' | 'Contrato' | 'Declaración jurada del terreno' | 'Declaración jurada de la prohibición venta 10 años' | 'Memoria descriptiva' | 'Planos de ubicación' | 'Plano perimétrico'
          link_documento?: string | null
          subido_manual?: boolean | null
          impreso?: boolean | null
          confirmado?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "socio_documentos_socio_id_fkey"
            columns: ["socio_id"]
            isOneToOne: false
            referencedRelation: "socio_titulares"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
