
-- Add a policy to allow the first user (admin) to be created when no users exist
-- This policy allows profile creation when there are no existing profiles (first user scenario)
CREATE POLICY "Allow first user creation when no profiles exist" 
ON public.profiles FOR INSERT 
WITH CHECK (
  (SELECT COUNT(*) FROM public.profiles) = 0
);
