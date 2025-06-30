import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface DashboardStats {
  totalConsultants: number;
  activeConsultants: number;
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentActivity: Array<{
    id: string;
    type: "consultant_added" | "client_added" | "status_changed";
    description: string;
    timestamp: string;
  }>;
}

export const useSecuriaDashboardStats = () => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ["securia-dashboard-stats"],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/dashboard/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token,
    refetchInterval: 60000, // Refresh every minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};