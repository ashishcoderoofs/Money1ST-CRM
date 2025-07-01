import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Types
interface RolePermissions {
  Admin: boolean;
  'Field Builder': boolean;
  'Field Trainer': boolean;
  'Senior BMA': boolean;
  BMA: boolean;
  IBA: boolean;
}

interface PagePermission {
  pageName: string;
  description?: string;
  rolePermissions: RolePermissions;
  createdAt: string;
  updatedAt: string;
}

interface UserPagePermissions {
  role: string;
  permissions: Record<string, boolean>;
}

// Hook to get all page permissions (Admin only)
export function usePagePermissions() {
  const { apiCall } = useAuth();
  
  return useQuery({
    queryKey: ['admin', 'page-permissions'],
    queryFn: async (): Promise<PagePermission[]> => {
      const response = await apiCall('/api/admin/page-permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch page permissions');
      }
      const result = await response.json();
      return result.data;
    },
  });
}

// Hook to get current user's page permissions
export function useUserPagePermissions() {
  const { apiCall } = useAuth();
  
  return useQuery({
    queryKey: ['user', 'page-permissions'],
    queryFn: async (): Promise<UserPagePermissions> => {
      const response = await apiCall('/api/users/page-permissions');
      if (!response.ok) {
        throw new Error('Failed to fetch user permissions');
      }
      const result = await response.json();
      return result.data;
    },
  });
}

// Hook to initialize default page permissions
export function useInitializePagePermissions() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiCall('/api/admin/page-permissions/initialize', {
        method: 'POST',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to initialize page permissions');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'page-permissions'] });
      toast({
        title: 'Success',
        description: data.message || 'Page permissions initialized successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize page permissions',
        variant: 'destructive',
      });
    },
  });
}

// Hook to toggle role permission for a page
export function useTogglePagePermission() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageName, role }: { pageName: string; role: string }) => {
      const response = await apiCall(`/api/admin/page-permissions/${encodeURIComponent(pageName)}/toggle`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle permission');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'page-permissions'] });
      
      const accessText = data.data.hasAccess ? 'granted' : 'revoked';
      toast({
        title: 'Permission Updated',
        description: `${variables.role} access to ${variables.pageName} has been ${accessText}`,
      });
    },
    onError: (error: any, variables) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to update permission for ${variables.pageName}`,
        variant: 'destructive',
      });
    },
  });
}

// Hook to create/update page permission
export function useCreatePagePermission() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<PagePermission, 'createdAt' | 'updatedAt'>) => {
      const response = await apiCall('/api/admin/page-permissions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create page permission');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'page-permissions'] });
      toast({
        title: 'Success',
        description: data.message || 'Page permission created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create page permission',
        variant: 'destructive',
      });
    },
  });
}

// Hook to delete page permission
export function useDeletePagePermission() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pageName: string) => {
      const response = await apiCall(`/api/admin/page-permissions/${encodeURIComponent(pageName)}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete page permission');
      }
      return response.json();
    },
    onSuccess: (data, pageName) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'page-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'page-permissions'] });
      toast({
        title: 'Success',
        description: `Page permission for "${pageName}" deleted successfully`,
      });
    },
    onError: (error: any, pageName) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to delete page permission for "${pageName}"`,
        variant: 'destructive',
      });
    },
  });
}
