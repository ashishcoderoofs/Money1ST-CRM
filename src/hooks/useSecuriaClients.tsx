import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { Client } from "../types/mongodb-client";

interface ClientsResponse {
  success: boolean;
  data: Client[];
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
      const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";
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

  return useQuery<{ success: boolean; data: Client }>({
    queryKey: ["securia-client", id],
    queryFn: async () => {
      const apiUrl = process.env.VITE_API_URL || "http://localhost:3000";
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

// Hook to create