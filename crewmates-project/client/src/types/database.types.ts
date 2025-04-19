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
      crewmates: {
        Row: {
          id: number
          name: string
          speed: number
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          speed: number
          color: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          speed?: number
          color?: string
          created_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: number
          username: string
          password_hash: string
        }
        Insert: {
          id?: number
          username: string
          password_hash: string
        }
        Update: {
          id?: number
          username?: string
          password_hash?: string
        }
        Relationships: []
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']