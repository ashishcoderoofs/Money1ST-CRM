
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useToggleUserAccess() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, hasAccess }: { userId: string; hasAccess: boolean }) => {
      console.log("Toggling user access:", userId, hasAccess);
      
      const { data, error } = await supabase
        .from("profiles")
        .update({ has_access: hasAccess } as any)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Toggle access error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User access updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Toggle user access error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user access",
        variant: "destructive",
      });
    },
  });
}
