import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock API.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Типи для таблиць
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'active' | 'archived' | 'planned'
          createdAt: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status: 'active' | 'archived' | 'planned'
          createdAt?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: 'active' | 'archived' | 'planned'
          createdAt?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          projectId: string
          title: string
          assignee: string | null
          status: 'todo' | 'in_progress' | 'done'
          dueDate: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          projectId: string
          title: string
          assignee?: string | null
          status: 'todo' | 'in_progress' | 'done'
          dueDate: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          projectId?: string
          title?: string
          assignee?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          dueDate?: string
          order?: number
          created_at?: string
        }
      }
    }
  }
}
