
-- Add column for Securia portal access (if not already added).
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS can_access_securia boolean NOT NULL DEFAULT false;

-- Allow the user to update their own profile.
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow Admins to view all profiles.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'Admin');

-- Allow Admins to update all profiles.
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'Admin');
