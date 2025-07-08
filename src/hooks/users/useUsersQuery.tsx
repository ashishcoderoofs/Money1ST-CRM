import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export function useUsers() {
  return { data: [], isLoading: false };
}

export function useUserById(userId: string | undefined) {
  return { data: {}, isLoading: false };
}
