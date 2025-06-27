
-- Add all the missing applicant fields to the clients table
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_title text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_first_name text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_mi text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_last_name text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_suffix text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_maiden_name text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_is_consultant boolean DEFAULT false;

-- Address fields
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_city text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_county text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_state text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_zip_code text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_time_at_address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_address_time text;

-- Contact fields
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_home_phone text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_other_phone text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_fax text;

-- Employment fields
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employment_status text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_business_owner text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_name text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_city text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_state text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_zip text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_occupation text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_monthly_salary numeric DEFAULT 0;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_employer_phone text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_start_date date;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_end_date date;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_additional_income numeric DEFAULT 0;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_additional_income_source text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_employer text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_employer_address text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_occupation text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_employment_from date;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_previous_employment_to date;

-- Demographics fields
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_dob date;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_ssn text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_birth_place text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_race text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_marital_status text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_anniversary date;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_spouse_name text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_spouse_occupation text;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS applicant_dependents_count integer DEFAULT 0;
