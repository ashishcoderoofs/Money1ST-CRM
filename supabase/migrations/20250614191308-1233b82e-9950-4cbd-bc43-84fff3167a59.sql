
-- Create a new type for consultant status
CREATE TYPE public.consultant_status AS ENUM ('Active', 'Inactive', 'Pending');

-- Add a status column to the profiles table
ALTER TABLE public.profiles ADD COLUMN status public.consultant_status NOT NULL DEFAULT 'Pending';

-- Create a policy that allows Admins to update any profile
CREATE POLICY "Admins can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (get_current_user_role() = 'Admin') 
  WITH CHECK (get_current_user_role() = 'Admin');

-- Create a policy that allows Admins to delete profiles
CREATE POLICY "Admins can delete profiles" 
  ON public.profiles 
  FOR DELETE 
  USING (get_current_user_role() = 'Admin');
