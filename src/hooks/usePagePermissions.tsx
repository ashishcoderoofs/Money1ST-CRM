
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PagePermission {
  id: string;
  page_name: string;
  role_name: "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";
  can_access: boolean;
  created_at: string;
  updated_at: string;
}

type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";

export function usePagePermissions() {
  return useQuery({
    queryKey: ["page-permissions"],
    queryFn: async () => {
      console.log("Fetching page permissions...");
      const { data, error } = await supabase
        .from("page_permissions")
        .select("*")
        .order("page_name", { ascending: true });

      if (error) {
        console.error("Error fetching page permissions:", error);
        throw error;
      }

      console.log("Fetched permissions:", data);
      return data as PagePermission[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - longer stale time for better performance
  });
}

export function useUpdatePagePermission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, can_access }: { id: string; can_access: boolean }) => {
      const { data, error } = await supabase
        .from("page_permissions")
        .update({ can_access })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating page permission:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Only invalidate page-permissions query to prevent multiple notifications
      queryClient.invalidateQueries({ queryKey: ["page-permissions"] });
      // Remove the user-page-access invalidation to prevent duplicate toasts
      // queryClient.invalidateQueries({ queryKey: ["user-page-access"] });
      
      // Show success toast only once
      toast({
        title: "Permission Updated",
        description: "Page access permission has been updated",
      });
    },
    onError: (error: any) => {
      console.error("Update page permission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update page permission",
        variant: "destructive",
      });
    },
  });
}

export function useUserPageAccess(userRole: UserRole | null, pageName: string) {
  return useQuery({
    queryKey: ["user-page-access", userRole, pageName],
    queryFn: async () => {
      console.log(`Checking access for role: ${userRole}, page: ${pageName}`);
      
      if (!userRole) {
        console.log("No user role provided");
        return false;
      }
      
      // Admin always has access to everything
      if (userRole === "Admin") {
        console.log("Admin user - granting full access");
        return true;
      }
      
      // First check if the current user has overall system access
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No authenticated user");
        return false;
      }

      const { data: userProfile, error: userError } = await supabase
        .from("profiles")
        .select("has_access")
        .eq("id", user.id)
        .maybeSingle();

      if (userError) {
        console.error("Error checking user access:", userError);
        return false;
      }

      // If user doesn't have system access, deny access regardless of page permissions
      const hasAccess = userProfile?.has_access ?? true;
      console.log(`User has system access: ${hasAccess}`);
      
      if (hasAccess === false) {
        console.log("User system access is disabled");
        return false;
      }
      
      // Check page-specific permissions
      const { data, error } = await supabase
        .from("page_permissions")
        .select("can_access")
        .eq("page_name", pageName)
        .eq("role_name", userRole)
        .maybeSingle();

      if (error) {
        console.error("Error checking page access:", error);
        // Fall back to default permissions on error
        const defaultAccess = getDefaultPermission(userRole, pageName);
        console.log(`Using default permission due to error: ${defaultAccess}`);
        return defaultAccess;
      }

      // If specific permission found, use it
      if (data !== null) {
        const canAccess = data.can_access;
        console.log(`Page access result: ${canAccess} for role ${userRole} on page ${pageName}`);
        return canAccess;
      }

      // If no specific permission found, use default permissions based on role
      console.log(`No permission record found for role ${userRole} on page ${pageName} - using defaults`);
      const defaultAccess = getDefaultPermission(userRole, pageName);
      console.log(`Using default permission for ${userRole} on ${pageName}: ${defaultAccess}`);
      return defaultAccess;
    },
    enabled: !!userRole,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
}

// Helper function to get default permissions - Updated with correct permissions
function getDefaultPermission(userRole: UserRole, pageName: string): boolean {
  const defaultPermissions: Record<UserRole, Record<string, boolean>> = {
    "Admin": {
      "Dashboard": true,
      "Securia": true,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": true,
      "FNA Training": true,
      "Admin": true,
      "Analytics": true
    },
    "Field Builder": {
      "Dashboard": true,
      "Securia": true,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": true,
      "FNA Training": true,
      "Admin": false,
      "Analytics": true
    },
    "Field Trainer": {
      "Dashboard": true,
      "Securia": true,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": true,
      "FNA Training": true,
      "Admin": false,
      "Analytics": true
    },
    "Sr. BMA": {
      "Dashboard": true,
      "Securia": true,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": false,
      "FNA Training": true,
      "Admin": false,
      "Analytics": true
    },
    "BMA": {
      "Dashboard": true,
      "Securia": false,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": false,
      "FNA Training": true,
      "Admin": false,
      "Analytics": false
    },
    "IBA": {
      "Dashboard": true,
      "Securia": false,
      "Reports": true,
      "Organizational Chart": true,
      "Branch Development": false,
      "FNA Training": true,
      "Admin": false,
      "Analytics": false
    }
  };
  
  return defaultPermissions[userRole]?.[pageName] || false;
}
