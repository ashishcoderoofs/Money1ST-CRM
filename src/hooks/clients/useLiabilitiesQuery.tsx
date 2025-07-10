import { useQuery } from "@tanstack/react-query";

export function useLiabilitiesQuery(clientId?: string, token?: string) {
  return useQuery({
    queryKey: ["liabilities", clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const apiUrl = import.meta.env?.VITE_API_URL || process.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/liabilities?client_id=${clientId}`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch liabilities: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!clientId,
  });
}
