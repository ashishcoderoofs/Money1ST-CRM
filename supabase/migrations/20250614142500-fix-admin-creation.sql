

-- Fix the trigger function to properly handle first user creation
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger that calls our function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

