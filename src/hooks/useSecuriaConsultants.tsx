import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface SecuriaConsultant {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  specialization: string;
  experience: string;
  certifications: string[];
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
  status?: "active" | "inactive" | "all";
  sort?: "name" | "email" | "createdAt";
  order?: "asc" | "desc";
}

export const useSecuriaConsultants = (params: ConsultantsParams = {}) => {
  const { token } = useAuth();

  return useQuery<ConsultantsResponse>({
    queryKey: ["securia-consultants", params],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/api/securia/consultants?${searchParams}`, {
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

export const useSecuriaConsultant = (id: string) => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: SecuriaConsultant }>({
    queryKey: ["securia-consultant", id],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}`, {
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

export const useCreateSecuriaConsultant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<SecuriaConsultant, "_id" | "createdAt" | "updatedAt">) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants`, {
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
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
    },
  });
};

export const useUpdateSecuriaConsultant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<SecuriaConsultant, "_id" | "createdAt" | "updatedAt"> }) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
      queryClient.invalidateQueries({ queryKey: ["securia-consultant"] });
    },
  });
};

export const useDeleteSecuriaConsultant = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
    },
  });
};

export const useToggleConsultantStatus = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/consultants/${id}/status`, {
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
      queryClient.invalidateQueries({ queryKey: ["securia-consultants"] });
      queryClient.invalidateQueries({ queryKey: ["securia-consultant"] });
    },
  });
};