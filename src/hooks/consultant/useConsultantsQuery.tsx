
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Hook to fetch all consultants (including inactive ones)
export function useConsultants() {
  return useQuery({
    queryKey: ["consultants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Hook to fetch a single consultant by ID
export function useConsultant(id: string | null) {
  return useQuery({
    queryKey: ["consultant", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
