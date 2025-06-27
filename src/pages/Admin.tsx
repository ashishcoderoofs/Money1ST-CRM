
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersTable } from "@/components/users/UsersTable";
import { PermissionsMatrix } from "@/components/users/PermissionsMatrix";
import { PagePermissionsManager } from "@/components/admin/PagePermissionsManager";
import { AdminUserCreation } from "@/components/users/AdminUserCreation";
import { UserForm } from "@/components/users/UserForm";
import { useUsers, useManagers, useUpdateUser, useDeleteUser, useToggleUserAccess } from "@/hooks/users";
import { useUpdateUserStatus } from "@/hooks/users/useUpdateUserStatus";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Users as UsersIcon, Shield, Settings, AlertTriangle, UserPlus } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: managers = [] } = useManagers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const toggleAccessMutation = useToggleUserAccess();
  const updateStatusMutation = useUpdateUserStatus();

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
  if (role !== "Admin") {
    return <div className="p-8 text-center">Access denied. Only administrators can access this page.</div>;
  }

  const handleUpdateUser = async (values: any) => {
    if (!editingUser) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        ...values,
      });
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteMutation.mutateAsync(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleToggleUserAccess = async (userId: string, hasAccess: boolean) => {
    try {
      await toggleAccessMutation.mutateAsync({ userId, hasAccess });
    } catch (error) {
      console.error("Failed to toggle user access:", error);
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ userId, status });
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
  };

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

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">
            <UsersIcon className="h-4 w-4 mr-2" />
            Users
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

        <TabsContent value="users">
          <UsersTable
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleAccess={handleToggleUserAccess}
            onUpdateStatus={handleUpdateUserStatus}
            isLoading={usersLoading}
          />
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

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleUpdateUser}
              initialValues={{
                first_name: editingUser.first_name,
                last_name: editingUser.last_name,
                email: editingUser.email,
                role: editingUser.role,
                manager_id: editingUser.manager_id || "no-manager",
                phone: editingUser.phone || "",
                can_access_securia: editingUser.can_access_securia,
                has_access: editingUser.has_access,
              }}
              managers={managers}
              isLoading={updateMutation.isPending}
              showPasswordReset={true}
              userId={editingUser.id}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
