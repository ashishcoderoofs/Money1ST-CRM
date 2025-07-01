import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:3000/api';

// Types based on the frontend form
export interface ConsultantData {
  // Basic Information
  consultantId?: string;
  entryDate?: string;
  position?: string;
  status?: 'Active' | 'Inactive';
  title?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  suffix?: string;
  comment?: string;
  remarks?: string;

  // Contact Information
  email: string;
  maidenName?: string;
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  otherPhone?: string;
  fax?: string;
  membershipType?: string;
  amount?: number;
  jointMemberName?: string;

  // Personal Information
  dateOfBirth?: string;
  maritalStatus?: string;
  sex?: string;
  race?: string;
  spouseName?: string;
  anniversary?: string;
  spouseOccupation?: string;
  educationLevel?: string;
  driversLicenseNumber?: string;
  driversLicenseState?: string;
  employmentStatus?: string;
  employer?: string;
  occupation?: string;
  industry?: string;

  // CFS Information
  ssn?: string;
  ein?: string;
  hireDate?: string;
  yearsWithFrq?: number;
  companyName?: string;
  cfsCertificationDate?: string;
  effectiveDate?: string;
  memberType?: string;
  mbrAmt?: number;
  payType?: string;
  mpFee?: number;
  cfsStatus?: string;
  statusDate?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function to make authenticated requests with token expiration handling
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    
    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      // Check if it's a token-related error
      if (errorData.error?.includes('token') || errorData.error?.includes('expired') || 
          errorData.error?.includes('invalid') || errorData.error?.includes('denied')) {
        console.warn('Token expired or invalid in consultant API');
        
        // Clear authentication state
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        
        // Redirect to login
        window.location.href = '/login';
        return;
      }
    }
    
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Hook to get all consultants with pagination and filtering
export const useConsultants = (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.status) queryParams.append('status', params.status);
  if (params?.search) queryParams.append('search', params.search);

  return useQuery({
    queryKey: ['consultants', params],
    queryFn: () => makeAuthenticatedRequest(`/consultants?${queryParams}`),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook to get consultant by ID
export const useConsultant = (id: string | null) => {
  return useQuery({
    queryKey: ['consultant', id],
    queryFn: () => makeAuthenticatedRequest(`/consultants/${id}`),
    enabled: !!id,
  });
};

// Hook to get consultant statistics
export const useConsultantStats = () => {
  return useQuery({
    queryKey: ['consultant-stats'],
    queryFn: () => makeAuthenticatedRequest('/consultants/stats'),
  });
};

// Hook to search consultants
export const useSearchConsultants = (query: string, limit?: number) => {
  const queryParams = new URLSearchParams();
  if (query) queryParams.append('query', query);
  if (limit) queryParams.append('limit', limit.toString());

  return useQuery({
    queryKey: ['search-consultants', query, limit],
    queryFn: () => makeAuthenticatedRequest(`/consultants/search?${queryParams}`),
    enabled: !!query,
  });
};

// Hook to create consultant
export const useCreateConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultantData: ConsultantData) =>
      makeAuthenticatedRequest('/consultants', {
        method: 'POST',
        body: JSON.stringify(consultantData),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-stats'] });
      toast.success(data.message || 'Consultant created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create consultant');
    },
  });
};

// Hook to update consultant
export const useUpdateConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ConsultantData> }) =>
      makeAuthenticatedRequest(`/consultants/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      queryClient.invalidateQueries({ queryKey: ['consultant', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['consultant-stats'] });
      toast.success(data.message || 'Consultant updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update consultant');
    },
  });
};

// Hook to toggle consultant status
export const useToggleConsultantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      makeAuthenticatedRequest(`/consultants/${id}/toggle-status`, {
        method: 'PATCH',
      }),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      queryClient.invalidateQueries({ queryKey: ['consultant', id] });
      queryClient.invalidateQueries({ queryKey: ['consultant-stats'] });
      toast.success(data.message || 'Consultant status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update consultant status');
    },
  });
};

// Hook to delete consultant
export const useDeleteConsultant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      makeAuthenticatedRequest(`/consultants/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['consultants'] });
      queryClient.invalidateQueries({ queryKey: ['consultant-stats'] });
      toast.success(data.message || 'Consultant deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete consultant');
    },
  });
};
