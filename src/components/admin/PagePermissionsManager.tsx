
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  usePagePermissions, 
  useTogglePagePermission
} from '@/hooks/usePagePermissionsAPI';
import { Shield } from 'lucide-react';

// Types
interface PagePermission {
  pageName: string;
  description?: string;
  rolePermissions: {
    Admin: boolean;
    'Field Builder': boolean;
    'Field Trainer': boolean;
    'Senior BMA': boolean;
    BMA: boolean;
    IBA: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const ROLES = ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'];

export function PagePermissionsManager() {
  // API Hooks
  const { data: pagePermissions = [], isLoading } = usePagePermissions();
  const togglePermissionMutation = useTogglePagePermission();

  // Event Handlers
  const handleTogglePermission = async (pageName: string, role: string) => {
    try {
      await togglePermissionMutation.mutateAsync({ pageName, role });
    } catch (error) {
      console.error('Error toggling permission:', error);
    }
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      'Admin': 'bg-red-500',
      'Field Builder': 'bg-blue-500',
      'Field Trainer': 'bg-yellow-500',
      'Senior BMA': 'bg-green-500',
      'BMA': 'bg-orange-500',
      'IBA': 'bg-purple-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  // Render Functions
  const renderPageRow = (page: PagePermission) => (
    <div key={page.pageName} className="border-b border-gray-200 last:border-b-0">
      <div className="grid grid-cols-8 gap-4 p-4 items-center">
        <div className="col-span-2">
          <div>
            <h3 className="font-medium text-sm">{page.pageName}</h3>
            {page.description && (
              <p className="text-xs text-muted-foreground mt-1">{page.description}</p>
            )}
          </div>
        </div>
        {ROLES.map(role => (
          <div key={role} className="flex justify-center">
            <Switch
              checked={page.rolePermissions[role as keyof typeof page.rolePermissions]}
              onCheckedChange={() => handleTogglePermission(page.pageName, role)}
              disabled={togglePermissionMutation.isPending}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="grid grid-cols-8 gap-4 p-4 bg-gray-50 border-b">
      <div className="col-span-2">
        <h3 className="font-semibold text-sm">Page</h3>
      </div>
      {ROLES.map(role => (
        <div key={role} className="text-center">
          <Badge 
            variant="outline" 
            className={`text-xs text-white ${getRoleColor(role)}`}
          >
            {role}
          </Badge>
        </div>
      ))}
    </div>
  );

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
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Page Access Permissions
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage which roles can access different pages in the system
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pagePermissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No page permissions configured.</p>
              <p className="text-sm">Click "Initialize Defaults" to set up common pages.</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              {renderHeader()}
              {pagePermissions.map(renderPageRow)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}