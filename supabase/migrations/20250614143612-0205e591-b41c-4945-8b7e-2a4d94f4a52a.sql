
-- First, let's completely reset the RLS policies and fix the underlying issues

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Allow profile creation via trigger" ON public.profiles;
DROP POLICY IF EXISTS "Allow first user creation when no profiles exist" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Disable RLS temporarily to fix the trigger
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Fix the team lineage function that's causing the array_append error
CREATE OR REPLACE FUNCTION public.update_team_lineage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Close previous lineage record
  UPDATE public.team_lineage 
  SET effective_to = NOW()
  WHERE user_id = NEW.id AND effective_to IS NULL;

  -- Create new lineage record with proper type casting
  INSERT INTO public.team_lineage (user_id, manager_id, level, path)
  VALUES (
    NEW.id,
    NEW.manager_id,
    COALESCE((
      SELECT level + 1 FROM public.team_lineage 
      WHERE user_id = NEW.manager_id AND effective_to IS NULL
    ), 1),
    CASE 
      WHEN NEW.manager_id IS NOT NULL THEN
        COALESCE((
          SELECT path || ARRAY[NEW.manager_id::text] FROM public.team_lineage 
          WHERE user_id = NEW.manager_id AND effective_to IS NULL
        ), ARRAY[NEW.manager_id::text])
      ELSE
        NULL
    END
  );

  RETURN NEW;
END;
$$;

-- Create a simple, non-recursive function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id LIMIT 1;
$$;

-- Recreate the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_count INTEGER;
BEGIN
  -- Count existing profiles
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  
  -- Insert new profile
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    CASE 
      WHEN profile_count = 0 THEN 'Admin'::user_role
      ELSE 'IBA'::user_role
    END
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "Enable insert for authenticated users during signup" 
ON public.profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert for service role" 
ON public.profiles FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow admins to view all profiles using the function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.get_user_role(auth.uid()) = 'Admin');
