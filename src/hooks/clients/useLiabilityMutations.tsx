
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// REST utility for Node/Express backend
const apiUrl = import.meta.env?.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';

export async function createLiabilityREST(liability: any, token?: string) {
  const response = await fetch(`${apiUrl}/api/liabilities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(liability)
  });
  if (!response.ok) {
    throw new Error(`Failed to create liability: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function updateLiabilityREST(id: string, data: any, token?: string) {
  const response = await fetch(`${apiUrl}/api/liabilities/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Failed to update liability: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function deleteLiabilityREST(id: string, token?: string) {
  const response = await fetch(`${apiUrl}/api/liabilities/${id}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to delete liability: ${response.status} ${response.statusText}`);
  }
  return { id };
}

export function useCreateLiability(token?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createLiabilityREST(data, token),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", variables.client_id] });
      toast.success("Liability added successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to add liability: " + error.message);
    },
  });
}

export function useUpdateLiability(token?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateLiabilityREST(id, data, token),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", result.client_id || (variables && variables.data && variables.data.client_id)] });
      toast.success("Liability updated successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to update liability: " + error.message);
    },
  });
}

export function useDeleteLiability(token?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, clientId }: { id: string; clientId: string }) => deleteLiabilityREST(id, token),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["liabilities", variables.clientId] });
      toast.success("Liability deleted successfully");
    },
    onError: (error: any) => {
      toast.error("Failed to delete liability: " + error.message);
    },
  });
}
