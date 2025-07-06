import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagePermissionsManager } from "@/components/admin/PagePermissionsManager";
import { AdminUserCreation } from "@/components/admin/AdminUserCreation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { PermissionsMatrix } from "@/components/users/PermissionsMatrix";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { BarChart3, Users as UsersIcon, Shield, Settings, UserPlus } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show loader while role is being determined
  if (roleLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Only show access denied after role is loaded and confirmed not admin
  if (!user.isAdmin) {
    return <div className="p-8 text-center">Access denied. Only administrators can access this page.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-powerbi-primary flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Panel
          </h2>
          <p className="text-muted-foreground">
            Manage users, roles, and system permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <UsersIcon className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="create-user">
            <UserPlus className="h-4 w-4 mr-2" />
            Create User
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="h-4 w-4 mr-2" />
            Role Permissions
          </TabsTrigger>
          <TabsTrigger value="page-access">
            <Settings className="h-4 w-4 mr-2" />
            Page Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTable />
        </TabsContent>

        <TabsContent value="create-user">
          <AdminUserCreation />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsMatrix />
        </TabsContent>

        <TabsContent value="page-access">
          <PagePermissionsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
