import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || '';
};

// Helper function to make API calls
const makeApiCall = async (endpoint: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/api/securia${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Applicant mutation hooks
export const useUpdateApplicantBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/applicant/basic-info`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update applicant basic info error:', error);
      toast.error(error.message || 'Failed to update applicant basic information');
    },
  });
};

export const useUpdateApplicantAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/applicant/address`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update applicant address error:', error);
      toast.error(error.message || 'Failed to update applicant address information');
    },
  });
};

export const useUpdateApplicantEmployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/applicant/employment`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update applicant employment error:', error);
      toast.error(error.message || 'Failed to update applicant employment information');
    },
  });
};

export const useUpdateApplicantDemographics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/applicant/demographics`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update applicant demographics error:', error);
      toast.error(error.message || 'Failed to update applicant demographics information');
    },
  });
};

// Co-Applicant mutation hooks
export const useUpdateCoApplicantBasicInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/co-applicant/basic-info`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update co-applicant basic info error:', error);
      toast.error(error.message || 'Failed to update co-applicant basic information');
    },
  });
};

export const useUpdateCoApplicantAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/co-applicant/address`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update co-applicant address error:', error);
      toast.error(error.message || 'Failed to update co-applicant address information');
    },
  });
};

export const useUpdateCoApplicantEmployment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/co-applicant/employment`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update co-applicant employment error:', error);
      toast.error(error.message || 'Failed to update co-applicant employment information');
    },
  });
};

export const useUpdateCoApplicantDemographics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: any }) => {
      return makeApiCall(`/clients/${clientId}/co-applicant/demographics`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
    onError: (error: Error) => {
      console.error('Update co-applicant demographics error:', error);
      toast.error(error.message || 'Failed to update co-applicant demographics information');
    },
  });
};
