
-- Add new fields for personal information to the profiles table
ALTER TABLE public.profiles
ADD COLUMN dob DATE,
ADD COLUMN marital_status TEXT,
ADD COLUMN sex TEXT,
ADD COLUMN race TEXT,
ADD COLUMN spouse_name TEXT,
ADD COLUMN anniversary DATE,
ADD COLUMN spouse_occupation TEXT,
ADD COLUMN education_level TEXT,
ADD COLUMN drivers_license_number TEXT,
ADD COLUMN drivers_license_state TEXT,
ADD COLUMN employment_status TEXT,
ADD COLUMN employer TEXT,
ADD COLUMN occupation TEXT,
ADD COLUMN industry TEXT;

-- Create a dependents table
CREATE TABLE public.dependents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dob DATE,
  relationship TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to the dependents table
ALTER TABLE public.dependents ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view dependents they can access
CREATE POLICY "Users can view accessible dependents" 
  ON public.dependents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = dependents.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );

-- Create policy that allows users to manage dependents for profiles they can access
CREATE POLICY "Users can manage accessible dependents" 
  ON public.dependents 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = dependents.consultant_id 
      AND can_access_user_data(profiles.id)
    )
  );
