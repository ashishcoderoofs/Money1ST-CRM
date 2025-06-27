
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log("Deleting user:", userId);
      
      // Delete from profiles first (this will cascade to auth.users)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Delete user error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });
}
