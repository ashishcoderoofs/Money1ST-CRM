import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

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
        const response = await apiCall('/api/consultants?status=Active&limit=100');
        
        if (!response.ok) {
          if (response.status === 401) {
            console.warn('Authentication required to fetch consultants');
            return [];
          }
          throw new Error(`Failed to fetch consultants: ${response.status}`);
        }
        
        const data = await response.json();
        return data.data || [];
      } catch (error) {
        console.error('Error fetching consultants:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated, // Only run query if authenticated
  });
}

export function useConsultantOptions() {
  const { data: consultants = [], isLoading, error } = useConsultants();
  const { isAuthenticated } = useAuth();
  
  const options = consultants
    .filter(consultant => consultant.status === 'Active')
    .map(consultant => ({
      value: consultant._id,
      label: `${consultant.firstName} ${consultant.lastName}${consultant.consultantId ? ` (${consultant.consultantId})` : ''}`,
      consultant
    }));

  return {
    options,
    isLoading: isLoading || !isAuthenticated,
    error: !isAuthenticated ? new Error('Please log in to load consultants') : error
  };
}
