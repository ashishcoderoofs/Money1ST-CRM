
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      console.log("Updating user status:", userId, status);
      
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: status as any })
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Update status error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update user status error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });
}
