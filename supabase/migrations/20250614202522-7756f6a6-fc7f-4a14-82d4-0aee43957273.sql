
-- Add missing fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS mi text,
ADD COLUMN IF NOT EXISTS suffix text;
