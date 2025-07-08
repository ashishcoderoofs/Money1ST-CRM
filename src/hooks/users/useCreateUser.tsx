import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { CreateUserData } from "./types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return { mutate: () => {} };
}
