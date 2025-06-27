
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      console.log("Resetting password for user:", userId);
      
      const { data, error } = await supabase.functions.invoke('reset-user-password', {
        body: { userId, newPassword }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to reset password");
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error("Reset password error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    },
  });
}
