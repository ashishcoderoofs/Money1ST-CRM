import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface SecuriaConsultant {
  _id: string;
  consultantId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  status: "Active" | "Inactive";
  position?: string;
  title?: string;
  entryDate: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  sex?: string;
  comment?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

interface ConsultantsResponse {
  success: boolean;
  data: SecuriaConsultant[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ConsultantsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "Active" | "Inactive" | "all";
  sort?: "firstName" | "lastName" | "email" | "createdAt";
  order?: "asc" | "desc";
}

export const useSecuriaConsultants = (params: ConsultantsParams = {}) => {
  const { token } = useAuth();

  return useQuery<ConsultantsResponse>({
    queryKey: ["securia-consultants", params],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const searchParams = new URLSearchParams();
      
      // Add parameters to search params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/api/securia/consultants?${searchParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch consultants: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to get a single consultant by ID
export const useSecuriaConsultant = (id: string) => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: SecuriaConsultant }>({
    queryKey: ["securia-consultant", id],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch consultant: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token && !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to create a new consultant
export const useCreateSecuriaConsultant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (consultantData: Omit<SecuriaConsultant, '_id' | 'createdAt' | 'updatedAt'>) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(consultantData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create consultant: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch consultants list
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};

// Hook to update consultant status
export const useUpdateConsultantStatus = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "Active" | "Inactive" }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}/status`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update consultant status: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};

// Hook to delete a consultant
export const useDeleteConsultant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete consultant: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};