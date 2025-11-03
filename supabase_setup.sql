-- YouSpace Supabase Database Setup
-- Run these commands in your Supabase SQL Editor

-- 1. Create the memories table
CREATE TABLE IF NOT EXISTS public.memories (
  id BIGSERIAL PRIMARY KEY,
  space_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  note TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster space_id lookups
CREATE INDEX IF NOT EXISTS idx_memories_space_id ON public.memories(space_id);

-- 2. Create the generated_stories table
CREATE TABLE IF NOT EXISTS public.generated_stories (
  id BIGSERIAL PRIMARY KEY,
  space_id TEXT NOT NULL UNIQUE,
  story_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster space_id lookups
CREATE INDEX IF NOT EXISTS idx_stories_space_id ON public.generated_stories(space_id);

-- 3. Enable Row Level Security (RLS) for both tables
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_stories ENABLE ROW LEVEL SECURITY;

-- 4. Create policies to allow public access (since we removed authentication)
-- Note: In production, you may want more restrictive policies

-- Allow anyone to read memories
CREATE POLICY "Allow public read access on memories" 
  ON public.memories FOR SELECT 
  USING (true);

-- Allow anyone to insert memories
CREATE POLICY "Allow public insert access on memories" 
  ON public.memories FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read stories
CREATE POLICY "Allow public read access on stories" 
  ON public.generated_stories FOR SELECT 
  USING (true);

-- Allow anyone to insert stories
CREATE POLICY "Allow public insert access on stories" 
  ON public.generated_stories FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update stories (for regenerating)
CREATE POLICY "Allow public update access on stories" 
  ON public.generated_stories FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Done! Tables are ready.
-- Next step: Create the storage bucket in Supabase Dashboard
