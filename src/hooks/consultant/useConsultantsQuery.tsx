
import { useQuery } from "@tanstack/react-query";

// Remove all supabase imports and code. Use REST API for consultants now.

// Hook to fetch all consultants (including inactive ones)
export function useConsultants() {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      // This function will need to be updated to use a REST API
      // For now, it will throw an error as supabase is removed.
      throw new Error("Supabase client not available for useConsultants");
    },
  });
}

// Hook to fetch a single consultant by ID
export function useConsultant(id: string | null) {
  return useQuery({
    queryKey: ["consultant", id],
    queryFn: async () => {
      if (!id) return null;
      // This function will need to be updated to use a REST API
      // For now, it will throw an error as supabase is removed.
      throw new Error("Supabase client not available for useConsultant");
    },
    enabled: !!id,
  });
}
