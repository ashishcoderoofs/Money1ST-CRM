
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Users fetched:", data);
      // Transform the data to include has_access with a default value if it doesn't exist
      const usersWithAccess = data.map((user: any) => ({
        ...user,
        has_access: user.has_access ?? true
      }));
      
      return usersWithAccess as User[];
    },
  });
}
