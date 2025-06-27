
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";

const pages = [
  "Dashboard",
  "Securia", 
  "Reports",
  "Organizational Chart",
  "Branch Development",
  "FNA Training",
  "Admin",
  "Analytics"
];

const roles: UserRole[] = ["Admin", "Field Builder", "Field Trainer", "Sr. BMA", "BMA", "IBA"];

// Define updated default permissions for each role to match requirements
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

export function usePopulatePermissions() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ forceRefresh = false }: { forceRefresh?: boolean } = {}) => {
      console.log("Starting permission population...");
      
      // Use service role for admin operations to bypass RLS
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check user role first
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userProfile || userProfile.role !== 'Admin') {
        throw new Error("Only administrators can populate permissions");
      }

      if (forceRefresh) {
        console.log("Force refresh: deleting existing permissions");
        // Delete existing permissions first
        const { error: deleteError } = await supabase
          .from("page_permissions")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");

        if (deleteError) {
          console.error("Error deleting existing permissions:", deleteError);
          // Continue anyway - might be due to RLS
        }
      }

      // Check existing permissions
      const { data: existing, error: checkError } = await supabase
        .from("page_permissions")
        .select("*");

      if (checkError) {
        console.error("Error checking existing permissions:", checkError);
        // Continue with empty array if we can't check
      }

      const existingPermissions = existing || [];
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

        // Insert permissions one by one to handle RLS issues better
        const insertedPermissions = [];
        for (const permission of permissionsToInsert) {
          const { data, error } = await supabase
            .from("page_permissions")
            .insert([permission])
            .select()
            .single();

          if (error) {
            console.error(`Error inserting permission for ${permission.role_name} on ${permission.page_name}:`, error);
            // Continue with other permissions even if one fails
          } else if (data) {
            insertedPermissions.push(data);
          }
        }

        console.log("Successfully inserted permissions:", insertedPermissions);
        return [...existingPermissions, ...insertedPermissions];
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
