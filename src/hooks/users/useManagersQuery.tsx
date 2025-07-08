// import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useManagers() {
  return { data: [], isLoading: false };
}
