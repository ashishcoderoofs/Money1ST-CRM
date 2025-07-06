import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Senior BMA" | "BMA" | "IBA";

const pages = [
  "Dashboard",
  "Contacts",
  "Deals",
  "Tasks",
  "Reports",
  "User Management",
  "Securia Access",
  "Securia"
];

const roles: UserRole[] = ["Admin", "Field Builder", "Field Trainer", "Senior BMA", "BMA", "IBA"];

// Define updated default permissions for each role to match requirements
const defaultPermissions: Record<UserRole, Record<string, boolean>> = {
  "Admin": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": true,
    "User Management": true,
    "Securia Access": true,
    "Securia": true
  },
  "Field Builder": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": true,
    "User Management": true,
    "Securia Access": false,
    "Securia": false
  },
  "Field Trainer": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": true,
    "User Management": false,
    "Securia Access": false,
    "Securia": false
  },
  "Senior BMA": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": true,
    "User Management": false,
    "Securia Access": false,
    "Securia": false
  },
  "BMA": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": false,
    "User Management": false,
    "Securia Access": false,
    "Securia": false
  },
  "IBA": {
    "Dashboard": true,
    "Contacts": true,
    "Deals": true,
    "Tasks": true,
    "Reports": false,
    "User Management": false,
    "Securia Access": false,
    "Securia": false
  }
};

export function usePopulatePermissions() {
  const queryClient = useQueryClient();
  const { user, apiCall } = useAuth();
  
  // Use isAdmin for permission logic
  const isAdmin = user.isAdmin;
  
  return useMutation({
    mutationFn: async ({ forceRefresh = false }: { forceRefresh?: boolean } = {}) => {
      console.log("Starting permission population...");
      console.log("User state:", user);
      console.log("User authenticated:", !!user);
      console.log("User role:", user?.role);
      
      // Check if user is authenticated
      if (!user) {
        console.error("Permission population failed: User not authenticated");
        throw new Error("User not authenticated");
      }

      // Check if user is admin
      if (!isAdmin) {
        console.error("Permission population failed: User is not admin. Current role:", user.role);
        throw new Error("Only administrators can populate permissions");
      }

      if (forceRefresh) {
        console.log("Force refresh: deleting existing permissions");
        // Delete existing permissions first
        try {
          const response = await apiCall('/api/admin/permissions/reset', {
            method: 'DELETE'
          });
          
          if (!response.ok) {
            console.error("Error deleting existing permissions");
            // Continue anyway
          }
        } catch (error) {
          console.error("Error deleting existing permissions:", error);
          // Continue anyway
        }
      }

      // Check existing permissions
      let existingPermissions: any[] = [];
      try {
        const response = await apiCall('/api/admin/permissions');
        if (response.ok) {
          const data = await response.json();
          existingPermissions = data.permissions || [];
        }
      } catch (error) {
        console.error("Error checking existing permissions:", error);
        // Continue with empty array if we can't check
      }

      const expectedCount = pages.length * roles.length;
      
      console.log(`Found ${existingPermissions.length} existing permissions, expected ${expectedCount}`);

      // Always populate missing permissions
      const permissionsToInsert: {
        page_name: string;
        role_name: UserRole;
        can_access: boolean;
      }[] = [];

      // Find missing combinations and add them
      for (const page of pages) {
        for (const role of roles) {
          const exists = existingPermissions.some(p => 
            p.page_name === page && p.role_name === role
          );
          
          if (!exists) {
            const canAccess = defaultPermissions[role][page] || false;
            permissionsToInsert.push({
              page_name: page,
              role_name: role,
              can_access: canAccess
            });
          }
        }
      }

      if (permissionsToInsert.length > 0) {
        console.log("Inserting missing permissions:", permissionsToInsert);

        // Insert permissions via API
        try {
          const response = await apiCall('/api/admin/permissions/bulk', {
            method: 'POST',
            body: JSON.stringify({ permissions: permissionsToInsert })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to insert permissions');
          }

          const result = await response.json();
          console.log("Successfully inserted permissions:", result);
          return [...existingPermissions, ...(result.permissions || [])];
        } catch (error) {
          console.error("Error inserting permissions:", error);
          throw error;
        }
      }

      console.log("No missing permissions to insert");
      return existingPermissions;
    },
    onSuccess: (data) => {
      console.log("Permission population completed successfully:", data?.length);
      
      // Only invalidate page-permissions to prevent multiple notifications
      queryClient.invalidateQueries({ queryKey: ["page-permissions"] });
      
      // Only show toast if permissions were actually updated
      if (data && data.length > 0) {
        toast({
          title: "Permissions Synchronized",
          description: "Page permissions have been updated successfully",
        });
      }
    },
    onError: (error: any) => {
      console.error("Populate permissions error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update page permissions",
        variant: "destructive",
      });
    },
  });
}
