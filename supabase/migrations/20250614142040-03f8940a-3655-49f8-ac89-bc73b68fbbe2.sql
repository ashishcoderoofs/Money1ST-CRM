
-- Clean up duplicate and conflicting RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin and Field Builder can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin and Field Builder can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view accessible profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create simplified, non-conflicting RLS policies for profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() 
    AND p.role IN ('Admin', 'Field Builder')
  )
);

-- Keep the existing policy for first user creation
-- "Allow first user creation when no profiles exist" is already created

-- Update the trigger function to handle role assignment properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    CASE 
      WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'Admin'::user_role
      ELSE 'IBA'::user_role
    END
  );
  RETURN NEW;
END;
$$;
