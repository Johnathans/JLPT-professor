import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/database.types'

// SRS intervals in hours
const SRS_INTERVALS = {
  0: 4,    // 4 hours
  1: 8,    // 8 hours
  2: 24,   // 1 day
  3: 48,   // 2 days
  4: 96,   // 4 days
  5: 168,  // 1 week
  6: 336,  // 2 weeks
  7: 730,  // 1 month
  8: 2920, // 4 months
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const json = await request.json()
  const { flashcard_id, result, response_time_ms, review_type } = json

  // Start a transaction
  const { data: flashcard, error: flashcardError } = await supabase
    .from('flashcards')
    .select('srs_level, correct_count, incorrect_count')
    .eq('id', flashcard_id)
    .eq('user_id', session.user.id)
    .single()

  if (flashcardError) {
    return NextResponse.json({ error: flashcardError.message }, { status: 500 })
  }

  // Calculate new SRS level based on result
  let newSrsLevel = flashcard.srs_level
  if (result) {
    newSrsLevel = Math.min(8, flashcard.srs_level + 1)
  } else {
    newSrsLevel = Math.max(0, flashcard.srs_level - 1)
  }

  // Calculate next review time
  const hoursToAdd = SRS_INTERVALS[newSrsLevel as keyof typeof SRS_INTERVALS]
  const nextReview = new Date()
  nextReview.setHours(nextReview.getHours() + hoursToAdd)

  // Update flashcard
  const { error: updateError } = await supabase
    .from('flashcards')
    .update({
      srs_level: newSrsLevel,
      next_review: nextReview.toISOString(),
      correct_count: result ? flashcard.correct_count + 1 : flashcard.correct_count,
      incorrect_count: result ? flashcard.incorrect_count : flashcard.incorrect_count + 1,
      last_reviewed_at: new Date().toISOString(),
    })
    .eq('id', flashcard_id)
    .eq('user_id', session.user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Create review history entry
  const { data: review, error: reviewError } = await supabase
    .from('review_history')
    .insert({
      flashcard_id,
      user_id: session.user.id,
      result,
      response_time_ms,
      review_type,
    })
    .select()
    .single()

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 })
  }

  return NextResponse.json(review)
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const flashcardId = searchParams.get('flashcard_id')

  let query = supabase
    .from('review_history')
    .select('*')
    .eq('user_id', session.user.id)
    .order('reviewed_at', { ascending: false })

  if (flashcardId) {
    query = query.eq('flashcard_id', flashcardId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
