import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface SecuriaClient {
  _id: string;
  clientId: string;
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    cellPhone?: string;
    homePhone?: string;
    workPhone?: string;
    otherPhone?: string;
    // Add other applicant fields as needed
  };
  status: "active" | "inactive" | "pending";
  consultant?: string;
  entryDate?: string;
  payoffAmount?: number;
  processor?: string;
  financialInfo?: {
    annualIncome?: number;
    netWorth?: number;
    investmentGoals?: string;
    riskTolerance?: "low" | "medium" | "high";
  };
  createdAt: string;
  updatedAt: string;
  // Add other fields as needed
}

interface ClientsResponse {
  success: boolean;
  data: SecuriaClient[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface ClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "pending" | "all";
  consultantId?: string;
  sort?: "firstName" | "lastName" | "email" | "createdAt";
  order?: "asc" | "desc";
}

export const useSecuriaClients = (params: ClientsParams = {}) => {
  const { token } = useAuth();

  return useQuery<ClientsResponse>({
    queryKey: ["securia-clients", params],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/api/securia/clients?${searchParams}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to get a single client by ID
export const useSecuriaClient = (id: string) => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: SecuriaClient }>({
    queryKey: ["securia-client", id],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch client: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token && !!id,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to create a new client
export const useCreateSecuriaClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: Omit<SecuriaClient, '_id' | 'createdAt' | 'updatedAt'>) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create client: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};

// Hook to update client status
export const useUpdateClientStatus = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" | "pending" }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}/status`, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update client status: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};

// Hook to delete a client
export const useDeleteClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete client: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};

// Hook to update a client
export const useUpdateSecuriaClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, update }: { id: string; update: Partial<SecuriaClient> }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
      });
      if (!response.ok) {
        throw new Error(`Failed to update client: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-client"] });
      queryClient.invalidateQueries({ queryKey: ["securia-dashboard-stats"] });
    },
  });
};