
-- Add has_access column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_access boolean NOT NULL DEFAULT true;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own has_access" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all has_access" ON public.profiles;  
DROP POLICY IF EXISTS "Admins can update has_access" ON public.profiles;

-- Users can view their own has_access status
CREATE POLICY "Users can view own has_access" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Admins can view all has_access statuses  
CREATE POLICY "Admins can view all has_access" 
  ON public.profiles 
  FOR SELECT 
  USING (public.get_user_role(auth.uid()) = 'Admin');

-- Admins can update has_access for all users
CREATE POLICY "Admins can update has_access" 
  ON public.profiles 
  FOR UPDATE 
  USING (public.get_user_role(auth.uid()) = 'Admin');
