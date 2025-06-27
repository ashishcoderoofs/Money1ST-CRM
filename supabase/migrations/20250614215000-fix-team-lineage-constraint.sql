
-- Fix the team lineage trigger and function to handle foreign key constraints properly

-- Drop the existing trigger first
DROP TRIGGER IF EXISTS on_profile_manager_change ON public.profiles;

-- Update the team lineage function to be more robust and handle foreign key constraints
CREATE OR REPLACE FUNCTION public.update_team_lineage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only proceed if manager_id is not null and the user exists in profiles
  IF NEW.manager_id IS NOT NULL THEN
    -- Verify that the manager exists in profiles table
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.manager_id) THEN
      -- Log the issue but don't fail the transaction
      RAISE LOG 'Manager ID % does not exist in profiles table for user %', NEW.manager_id, NEW.id;
      RETURN NEW;
    END IF;
    
    -- Close previous lineage record for this user
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
      COALESCE((
        SELECT path || ARRAY[NEW.manager_id::text] FROM public.team_lineage 
        WHERE user_id = NEW.manager_id AND effective_to IS NULL
      ), ARRAY[NEW.manager_id::text])
    );
  ELSE
    -- If manager_id is null, just close any existing lineage records
    UPDATE public.team_lineage 
    SET effective_to = NOW()
    WHERE user_id = NEW.id AND effective_to IS NULL;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error but don't fail the profile update
  RAISE LOG 'Error in update_team_lineage for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Recreate the trigger to only fire when manager_id actually changes
CREATE TRIGGER on_profile_manager_change
  AFTER UPDATE OF manager_id ON public.profiles
  FOR EACH ROW
  WHEN (OLD.manager_id IS DISTINCT FROM NEW.manager_id)
  EXECUTE FUNCTION public.update_team_lineage();

-- Also create a trigger for new profile inserts with manager_id
CREATE TRIGGER on_profile_insert_with_manager
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.manager_id IS NOT NULL)
  EXECUTE FUNCTION public.update_team_lineage();
