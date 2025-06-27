
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { CreateUserData } from "./types";

export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: CreateUserData) => {
      console.log("Creating user via edge function:", userData);
      
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: userData
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to create user");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully! Default password is 'TempPass123!' - they should change it on first login.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });
}
