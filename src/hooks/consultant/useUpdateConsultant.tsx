
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import type { Database } from "@/integrations/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

// Hook to update a consultant
export function useUpdateConsultant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ProfileUpdate>) => {
      console.log("Updating consultant with data:", { id, ...updates });
      
      // Filter out undefined values and prepare the update object
      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );
      
      console.log("Cleaned updates:", cleanedUpdates);
      
      const { data, error } = await supabase
        .from("profiles")
        .update(cleanedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      
      console.log("Update successful:", data);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["consultants"] });
      queryClient.invalidateQueries({ queryKey: ["consultant", variables.id] });
      toast.success("Consultant updated successfully.");
    },
    onError: (error) => {
      console.error("Update mutation error:", error);
      toast.error(`Failed to update consultant: ${error.message}`);
    },
  });
}
