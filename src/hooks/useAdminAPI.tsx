import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Hook for dashboard stats
export function useAdminDashboardStats() {
  const { apiCall } = useAuth();
  
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiCall('/api/admin/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    },
  });
}

// Hook for user activity
export function useAdminUserActivity(days = 30) {
  const { apiCall } = useAuth();
  
  return useQuery({
    queryKey: ['admin', 'users', 'activity', days],
    queryFn: async () => {
      const response = await apiCall(`/api/admin/users/activity?days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user activity');
      }
      return response.json();
    },
  });
}

// Hook for admin users list
export function useAdminUsers(params = {}) {
  const { apiCall } = useAuth();
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      queryParams.append(key, String(value));
    }
  });
  
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const response = await apiCall(`/api/admin/users?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}

// Hook for creating user
export function useCreateUser() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiCall('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
}

// Hook for bulk updating users
export function useBulkUpdateUsers() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userIds, updates }: { userIds: string[], updates: any }) => {
      const response = await apiCall('/api/admin/users/bulk', {
        method: 'PUT',
        body: JSON.stringify({ userIds, updates }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update users');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
}

// Hook for bulk deleting users
export function useBulkDeleteUsers() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await apiCall('/api/admin/users/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete users');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
}

// Hook for toggling user status
export function useToggleUserStatus() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiCall(`/api/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to toggle user status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
}

// Hook for updating user role
export function useUpdateUserRole() {
  const { apiCall } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      const response = await apiCall(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user role');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'stats'] });
    },
  });
}

// Hook for resetting user password
export function useResetUserPassword() {
  const { apiCall } = useAuth();
  
  return useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string, newPassword: string }) => {
      const response = await apiCall(`/api/admin/users/${userId}/reset-password`, {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to reset password');
      }
      return response.json();
    },
  });
}
