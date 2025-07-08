import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useToggleUserAccess() {
  const queryClient = useQueryClient();
  
  return { mutate: () => {} };
}
