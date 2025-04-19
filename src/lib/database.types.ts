export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
      user_progress: {
        Row: {
          id: string
          user_id: string
          kanji_id: string
          level: string
          status: string
          last_reviewed: string
          next_review: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kanji_id: string
          level: string
          status: string
          last_reviewed?: string
          next_review?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kanji_id?: string
          level?: string
          status?: string
          last_reviewed?: string
          next_review?: string
          created_at?: string
          updated_at?: string
        }
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
  }
}
