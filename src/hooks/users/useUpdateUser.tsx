import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UpdateUserData } from "./types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return { mutate: () => {} };
}
