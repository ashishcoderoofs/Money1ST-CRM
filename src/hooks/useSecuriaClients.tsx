import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface SecuriaClient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth: string;
  ssn: string;
  status: "active" | "inactive";
  consultantId: string;
  financialInfo: {
    annualIncome: number;
    netWorth: number;
    investmentGoals: string;
    riskTolerance: "low" | "medium" | "high";
  };
  createdAt: string;
  updatedAt: string;
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
  status?: "active" | "inactive" | "all";
  consultantId?: string;
  sort?: "name" | "email" | "createdAt";
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
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
    enabled: !!token,
  });
};

export const useSecuriaClient = (id: string) => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: SecuriaClient }>({
    queryKey: ["securia-client", id],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    },
    enabled: !!token && !!id,
  });
};

export const useCreateSecuriaClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<SecuriaClient, "_id" | "createdAt" | "updatedAt">) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
    },
  });
};

export const useUpdateSecuriaClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<SecuriaClient, "_id" | "createdAt" | "updatedAt"> }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-client"] });
    },
  });
};

export const useDeleteSecuriaClient = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
    },
  });
};

export const useToggleClientStatus = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/clients/${id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      queryClient.invalidateQueries({ queryKey: ["securia-client"] });
    },
  });
};