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

export const useSecuriaDashboardCharts = (timeframe: "week" | "month" | "quarter" | "year" = "month") => {
  const { token } = useAuth();

  return useQuery<{ success: boolean; data: ChartData }>({
    queryKey: ["securia-dashboard-charts", timeframe],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/api/securia/dashboard/charts?timeframe=${timeframe}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard charts: ${response.status} ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!token,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};