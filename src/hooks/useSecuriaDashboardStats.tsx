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

// Mock data as fallback
const mockStats: DashboardStats = {
  totalConsultants: 25,
  activeConsultants: 23,
  totalClients: 150,
  activeClients: 142,
  totalRevenue: 2500000,
  monthlyGrowth: 15.5,
  recentActivity: [
    {
      id: "1",
      type: "consultant_added",
      description: "New consultant John Doe added",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: "2",
      type: "client_added",
      description: "New client Jane Smith registered",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: "3",
      type: "status_changed",
      description: "Client Michael Johnson status updated to active",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
    }
  ]
};

export const useSecuriaDashboardStats = () => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: DashboardStats }>({
    queryKey: ["securia-dashboard-stats"],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      try {
        const response = await fetch(`${apiUrl}/api/securia/dashboard/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If endpoint doesn't exist or returns error, use mock data
          console.warn("Dashboard stats endpoint not available, using mock data");
          return { success: true, data: mockStats };
        }

        return response.json();
      } catch (error) {
        // Network error or endpoint not available, use mock data
        console.warn("Error fetching dashboard stats, using mock data:", error);
        return { success: true, data: mockStats };
      }
    },
    enabled: !!token,
    refetchInterval: 60000, // Refresh every minute
  });
};