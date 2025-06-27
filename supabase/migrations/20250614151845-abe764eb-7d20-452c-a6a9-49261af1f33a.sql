
-- This migration fixes an issue where the team_lineage trigger would fire
-- even when a manager_id was not assigned to a new profile, causing a
-- foreign key violation.

-- Drop the existing trigger that fires on every profile insert/update
DROP TRIGGER IF EXISTS on_profile_manager_change ON public.profiles;

-- Recreate the trigger with a condition to only fire when manager_id is not null.
-- This ensures team lineage is only updated when there's a manager relationship.
CREATE TRIGGER on_profile_manager_change
  AFTER INSERT OR UPDATE OF manager_id ON public.profiles
  FOR EACH ROW
  WHEN (NEW.manager_id IS NOT NULL)
  EXECUTE FUNCTION public.update_team_lineage();

