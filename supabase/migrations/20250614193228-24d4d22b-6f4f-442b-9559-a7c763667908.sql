
ALTER TABLE public.profiles
ADD COLUMN comment TEXT,
ADD COLUMN remarks TEXT,
ADD COLUMN maiden_name TEXT,
ADD COLUMN address TEXT,
ADD COLUMN city TEXT,
ADD COLUMN county TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT,
ADD COLUMN mobile_phone TEXT,
ADD COLUMN work_phone TEXT,
ADD COLUMN other_phone TEXT,
ADD COLUMN fax TEXT,
ADD COLUMN membership_type TEXT,
ADD COLUMN amount NUMERIC,
ADD COLUMN joint_member_name TEXT,
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_relationship TEXT,
ADD COLUMN emergency_contact_phone TEXT;
