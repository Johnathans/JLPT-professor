import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

if (!SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

const supabaseUrl = SUPABASE_URL
const supabaseKey = SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Helper function to check if we have a user session
export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper function to get server-side session
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export type Database = {
  public: {
    Tables: {
      flashcards: {
        Row: {
          id: string
          user_id: string
          item_id: string
          item_type: 'kanji' | 'vocabulary' | 'grammar'
          level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          next_review: string | null
          srs_level: number
          correct_count: number
          incorrect_count: number
          created_at: string
          last_reviewed_at: string | null
          notes: string | null
          is_known: boolean
        }
        Insert: {
          id?: string
          user_id: string
          item_id: string
          item_type: 'kanji' | 'vocabulary' | 'grammar'
          level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          next_review?: string | null
          srs_level?: number
          correct_count?: number
          incorrect_count?: number
          created_at?: string
          last_reviewed_at?: string | null
          notes?: string | null
          is_known?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          item_id?: string
          item_type?: 'kanji' | 'vocabulary' | 'grammar'
          level?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          next_review?: string | null
          srs_level?: number
          correct_count?: number
          incorrect_count?: number
          created_at?: string
          last_reviewed_at?: string | null
          notes?: string | null
          is_known?: boolean
        }
      }
      review_history: {
        Row: {
          id: string
          flashcard_id: string
          user_id: string
          result: boolean
          response_time_ms: number | null
          review_type: 'initial' | 'review' | 'relearn'
          reviewed_at: string
        }
        Insert: {
          id?: string
          flashcard_id: string
          user_id: string
          result: boolean
          response_time_ms?: number | null
          review_type: 'initial' | 'review' | 'relearn'
          reviewed_at?: string
        }
        Update: {
          id?: string
          flashcard_id?: string
          user_id?: string
          result?: boolean
          response_time_ms?: number | null
          review_type?: 'initial' | 'review' | 'relearn'
          reviewed_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          start_time: string
          end_time: string | null
          cards_reviewed: number
          correct_answers: number
          session_type: 'learn' | 'review' | 'mixed'
          level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          item_type: 'kanji' | 'vocabulary' | 'grammar' | 'mixed'
        }
        Insert: {
          id?: string
          user_id: string
          start_time?: string
          end_time?: string | null
          cards_reviewed?: number
          correct_answers?: number
          session_type: 'learn' | 'review' | 'mixed'
          level: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          item_type: 'kanji' | 'vocabulary' | 'grammar' | 'mixed'
        }
        Update: {
          id?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          cards_reviewed?: number
          correct_answers?: number
          session_type?: 'learn' | 'review' | 'mixed'
          level?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
          item_type?: 'kanji' | 'vocabulary' | 'grammar' | 'mixed'
        }
      }
    }
  }
}
