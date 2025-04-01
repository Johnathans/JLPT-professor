-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tables
create table public.flashcards (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  item_id text not null,
  item_type text not null check (item_type in ('kanji', 'vocabulary', 'grammar')),
  level text not null check (level in ('N1', 'N2', 'N3', 'N4', 'N5')),
  next_review timestamp with time zone,
  srs_level integer default 0,
  correct_count integer default 0,
  incorrect_count integer default 0,
  created_at timestamp with time zone default now(),
  last_reviewed_at timestamp with time zone,
  notes text,
  is_known boolean default false,
  constraint unique_user_item unique (user_id, item_id, item_type)
);

create table public.review_history (
  id uuid primary key default uuid_generate_v4(),
  flashcard_id uuid references public.flashcards(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  result boolean not null,
  response_time_ms integer,
  review_type text check (review_type in ('initial', 'review', 'relearn')),
  reviewed_at timestamp with time zone default now()
);

create table public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  start_time timestamp with time zone default now(),
  end_time timestamp with time zone,
  cards_reviewed integer default 0,
  correct_answers integer default 0,
  session_type text check (session_type in ('learn', 'review', 'mixed')),
  level text check (level in ('N1', 'N2', 'N3', 'N4', 'N5')),
  item_type text check (item_type in ('kanji', 'vocabulary', 'grammar', 'mixed'))
);

-- Create indexes
create index flashcards_user_id_idx on public.flashcards(user_id);
create index flashcards_next_review_idx on public.flashcards(next_review);
create index review_history_user_id_idx on public.review_history(user_id);
create index review_history_flashcard_id_idx on public.review_history(flashcard_id);
create index study_sessions_user_id_idx on public.study_sessions(user_id);

-- Set up Row Level Security (RLS)
alter table public.flashcards enable row level security;
alter table public.review_history enable row level security;
alter table public.study_sessions enable row level security;

-- Create policies
create policy "Users can view their own flashcards"
  on public.flashcards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own flashcards"
  on public.flashcards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own flashcards"
  on public.flashcards for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own flashcards"
  on public.flashcards for delete
  using (auth.uid() = user_id);

create policy "Users can view their own review history"
  on public.review_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own review history"
  on public.review_history for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own study sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
