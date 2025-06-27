
-- Drop the policy if it exists to ensure the script can be re-run
DROP POLICY IF EXISTS "Managers can view their team" ON public.profiles;

-- This policy allows managers to view the profiles of users in their hierarchy.
-- This version corrects a type mismatch error by casting auth.uid() to text.
CREATE POLICY "Managers can view their team"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.team_lineage
    WHERE team_lineage.user_id = profiles.id
      AND auth.uid()::text = ANY(team_lineage.path)
      AND team_lineage.effective_to IS NULL
  )
);
