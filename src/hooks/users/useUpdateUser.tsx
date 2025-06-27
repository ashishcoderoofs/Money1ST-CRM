
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UpdateUserData } from "./types";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUserData) => {
      console.log("Updating user:", id, userData);
      
      // Handle manager_id properly
      const managerId = userData.manager_id === "no-manager" ? null : userData.manager_id;
      
      const { data, error } = await supabase
        .from("profiles")
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          manager_id: managerId,
          phone: userData.phone || null,
          can_access_securia: userData.can_access_securia,
          has_access: userData.has_access,
        } as any)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Update user error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });
}
