
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePagePermissions, useUpdatePagePermission } from "@/hooks/usePagePermissions";
import { Shield, Settings } from "lucide-react";

const pages = [
  "Dashboard",
  "Securia", 
  "Reports",
  "Organizational Chart",
  "Branch Development",
  "FNA Training",
  "Admin"
];

const roles = ["Admin", "Field Builder", "Field Trainer", "Sr. BMA", "BMA", "IBA"] as const;

export function PagePermissionsManager() {
  const { data: permissions = [], isLoading } = usePagePermissions();
  const updatePermission = useUpdatePagePermission();

  const getPermission = (pageName: string, roleName: string) => {
    return permissions.find(p => p.page_name === pageName && p.role_name === roleName);
  };

  const handleToggle = async (pageName: string, roleName: string, currentAccess: boolean) => {
    const permission = getPermission(pageName, roleName);
    if (permission) {
      await updatePermission.mutateAsync({
        id: permission.id,
        can_access: !currentAccess
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Field Builder":
        return "default";
      case "Field Trainer":
        return "secondary";
      case "Sr. BMA":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Page Access Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading permissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Page Access Permissions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage which roles can access different pages in the system
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Page</TableHead>
                {roles.map((role) => (
                  <TableHead key={role} className="text-center min-w-[120px]">
                    <Badge variant={getRoleBadgeVariant(role)} className="text-xs">
                      {role}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page}>
                  <TableCell className="font-medium">{page}</TableCell>
                  {roles.map((role) => {
                    const permission = getPermission(page, role);
                    const canAccess = permission?.can_access || false;
                    
                    return (
                      <TableCell key={role} className="text-center">
                        <Switch
                          checked={canAccess}
                          onCheckedChange={() => handleToggle(page, role, canAccess)}
                          disabled={updatePermission.isPending}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
