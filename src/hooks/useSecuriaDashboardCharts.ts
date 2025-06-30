import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface ChartData {
  consultantGrowth: Array<{
    period: string;
    count: number;
  }>;
  clientGrowth: Array<{
    period: string;
    count: number;
  }>;
  revenueByConsultant: Array<{
    consultantName: string;
    revenue: number;
  }>;
  clientsByRiskTolerance: Array<{
    riskLevel: "low" | "medium" | "high";
    count: number;
  }>;
}

// Mock chart data as fallback
const mockChartData: ChartData = {
  consultantGrowth: [
    { period: "Jan 2024", count: 15 },
    { period: "Feb 2024", count: 18 },
    { period: "Mar 2024", count: 20 },
    { period: "Apr 2024", count: 23 },
    { period: "May 2024", count: 25 }
  ],
  clientGrowth: [
    { period: "Jan 2024", count: 120 },
    { period: "Feb 2024", count: 130 },
    { period: "Mar 2024", count: 135 },
    { period: "Apr 2024", count: 145 },
    { period: "May 2024", count: 150 }
  ],
  revenueByConsultant: [
    { consultantName: "John Doe", revenue: 350000 },
    { consultantName: "Jane Smith", revenue: 280000 },
    { consultantName: "Mike Johnson", revenue: 420000 },
    { consultantName: "Sarah Wilson", revenue: 310000 },
    { consultantName: "David Brown", revenue: 290000 }
  ],
  clientsByRiskTolerance: [
    { riskLevel: "low", count: 45 },
    { riskLevel: "medium", count: 78 },
    { riskLevel: "high", count: 27 }
  ]
};

export const useSecuriaDashboardCharts = (timeframe: "week" | "month" | "quarter" | "year" = "month") => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: ChartData }>({
    queryKey: ["securia-dashboard-charts", timeframe],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      
      try {
        const response = await fetch(`${apiUrl}/api/securia/dashboard/charts?timeframe=${timeframe}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If endpoint doesn't exist or returns error, use mock data
          console.warn("Dashboard charts endpoint not available, using mock data");
          return { success: true, data: mockChartData };
        }

        return response.json();
      } catch (error) {
        // Network error or endpoint not available, use mock data
        console.warn("Error fetching dashboard charts, using mock data:", error);
        return { success: true, data: mockChartData };
      }
    },
    enabled: !!token,
  });
};