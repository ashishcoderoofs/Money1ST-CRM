import { useMutation, useQueryClient } from "@tanstack/react-query";
// Remove all supabase imports and code. Use REST API for users now.
import { toast } from "@/hooks/use-toast";
import { UpdateUserData } from "./types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return { mutate: () => {} };
}
