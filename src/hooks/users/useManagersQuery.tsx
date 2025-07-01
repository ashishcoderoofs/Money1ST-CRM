
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useManagers() {
  return useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, role")
        .in("role", ["Admin", "Field Builder", "Field Trainer", "Senior BMA", "BMA"])
        .order("first_name");

      if (error) {
        console.error("Error fetching managers:", error);
        throw error;
      }

      return data;
    },
  });
}
