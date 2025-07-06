/**
 * Consultant Data Hook
 * 
 * Provides authenticated access to consultant data from the backend API.
 * This hook handles authentication, caching, and error states for consultant operations.
 * 
 * Features:
 * - Authentication-aware fetching
 * - Automatic retry with exponential backoff
 * - Caching with stale-while-revalidate strategy
 * - TypeScript support with proper interfaces
 */

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

/**
 * Consultant data structure as returned from the backend API
 */
export interface Consultant {
  _id: string;
  consultantId?: string;
  firstName: string;
  lastName: string;
  email: string;
  position?: string;
  status: 'Active' | 'Inactive';
  title?: string;
  middleInitial?: string;
  suffix?: string;
}

/**
 * Configuration for consultant queries
 */
const CONSULTANT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

/**
 * Hook to fetch active consultants from the API
 * 
 * Returns a React Query result object with:
 * - data: Array of active consultants
 * - isLoading: Loading state
 * - error: Error state
 * - refetch: Manual refetch function
 * 
 * Only fetches when user is authenticated to prevent unnecessary API calls.
 */
export function useConsultants() {
  const { apiCall, isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ['consultants'],
    queryFn: async (): Promise<Consultant[]> => {
      if (!isAuthenticated) {
        console.warn('User not authenticated, cannot fetch consultants');
        return [];
      }
      
      try {
        console.log('Fetching consultants from API...');
        const response = await apiCall('/api/consultants?status=Active&limit=100');
        
        if (!response.ok) {
          if (response.status === 401) {
            console.warn('Authentication required to fetch consultants');
            return [];
          }
          throw new Error(`Failed to fetch consultants: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`Successfully fetched ${data.data?.length || 0} consultants`);
        return data.data || [];
      } catch (error) {
        console.error('Error fetching consultants:', error);
        throw error;
      }
    },
    ...CONSULTANT_QUERY_CONFIG,
    enabled: isAuthenticated, // Only run query if authenticated
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('401')) return false;
      return failureCount < 3;
    }
  });
}

/**
 * Hook to get consultant options formatted for select dropdowns
 * 
 * Provides a convenient interface for forms that need consultant selection
 */
export function useConsultantOptions() {
  const { data: consultants = [], isLoading, error } = useConsultants();
  const { isAuthenticated } = useAuth();
  
  const options = consultants
    .filter(consultant => consultant.status === 'Active')
    .map(consultant => consultantUtils.toSelectOption(consultant));

  return {
    options,
    isLoading: isLoading || !isAuthenticated,
    error: !isAuthenticated ? new Error('Please log in to load consultants') : error
  };
}

/**
 * Utility functions for consultant data processing
 */
export const consultantUtils = {
  /**
   * Get the full display name for a consultant
   */
  getDisplayName: (consultant: Consultant): string => {
    const parts = [
      consultant.title,
      consultant.firstName,
      consultant.middleInitial,
      consultant.lastName,
      consultant.suffix
    ].filter(Boolean);
    
    return parts.join(' ');
  },

  /**
   * Format consultant for dropdown options
   */
  toSelectOption: (consultant: Consultant) => ({
    value: consultant._id,
    label: formatConsultantLabel(consultant),
    consultant
  }),

  /**
   * Filter consultants by search term
   */
  filterBySearch: (consultants: Consultant[], searchTerm: string): Consultant[] => {
    if (!searchTerm.trim()) return consultants;
    
    const search = searchTerm.toLowerCase();
    return consultants.filter(consultant => {
      const fullName = consultantUtils.getDisplayName(consultant).toLowerCase();
      const email = consultant.email.toLowerCase();
      const position = consultant.position?.toLowerCase() || '';
      
      return fullName.includes(search) || 
             email.includes(search) || 
             position.includes(search);
    });
  }
};

/**
 * Helper function to format consultant names for display
 * Includes consultant ID when available for better identification
 */
function formatConsultantLabel(consultant: Consultant): string {
  const fullName = `${consultant.firstName} ${consultant.lastName}`.trim();
  const consultantId = consultant.consultantId;
  
  return consultantId ? `${fullName} (${consultantId})` : fullName;
}
