
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
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
  const { apiCall } = useAuth();
  
  return useQuery({
    queryKey: ["page-permissions"],
    queryFn: async () => {
      console.log("Fetching page permissions...");
      const response = await apiCall('/api/admin/permissions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch page permissions');
      }
      
      const data = await response.json();
      console.log("Fetched permissions:", data.permissions);
      return data.permissions as PagePermission[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - longer stale time for better performance
  });
}

export function useUpdatePagePermission() {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, can_access }: { id: string; can_access: boolean }) => {
      const response = await apiCall(`/api/admin/permissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ can_access })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update permission');
      }

      return response.json();
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
  const { user, apiCall } = useAuth();
  
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
      
      // Check if current user is authenticated and active
      if (!user) {
        console.log("No authenticated user");
        return false;
      }

      // Check if user is active (assuming isActive field exists in user object)
      if (user.status !== 'active') {
        console.log("User is not active");
        return false;
      }
      
      // Check page-specific permissions via API
      try {
        const response = await apiCall(`/api/admin/permissions/check?role=${userRole}&page=${pageName}`);
        
        if (!response.ok) {
          console.error("Error checking page access");
          // Fall back to default permissions on error
          const defaultAccess = getDefaultPermission(userRole, pageName);
          console.log(`Using default permission due to error: ${defaultAccess}`);
          return defaultAccess;
        }

        const data = await response.json();
        
        // If specific permission found, use it
        if (data.hasPermission !== undefined) {
          const canAccess = data.hasPermission;
          console.log(`Page access result: ${canAccess} for role ${userRole} on page ${pageName}`);
          return canAccess;
        }

        // If no specific permission found, use default permissions based on role
        console.log(`No permission record found for role ${userRole} on page ${pageName} - using defaults`);
        const defaultAccess = getDefaultPermission(userRole, pageName);
        console.log(`Using default permission for ${userRole} on ${pageName}: ${defaultAccess}`);
        return defaultAccess;
      } catch (error) {
        console.error("Error checking page access:", error);
        // Fall back to default permissions on error
        const defaultAccess = getDefaultPermission(userRole, pageName);
        console.log(`Using default permission due to error: ${defaultAccess}`);
        return defaultAccess;
      }
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
