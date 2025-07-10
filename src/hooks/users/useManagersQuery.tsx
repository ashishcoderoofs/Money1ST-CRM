// Remove all supabase imports and code. Use REST API for users now.
import { useQuery } from "@tanstack/react-query";

export function useManagers() {
  return { data: [], isLoading: false };
}
