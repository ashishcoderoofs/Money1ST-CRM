
-- This migration removes a restrictive RLS policy on the profiles table
-- that prevented new users from having a profile created automatically.
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;

-- This policy might also be causing issues in some contexts.
-- It is redundant with the trigger logic and the service_role policy for user creation.
DROP POLICY IF EXISTS "Enable insert for authenticated users during signup" ON public.profiles;

-- This policy ensures the trigger and admin functions can create profiles.
CREATE POLICY "Allow profile creation via trigger and for admins"
ON public.profiles FOR INSERT
TO service_role
WITH CHECK (true);
