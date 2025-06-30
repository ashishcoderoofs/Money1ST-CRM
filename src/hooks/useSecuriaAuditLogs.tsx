import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export interface AuditLog {
  _id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  details: Record<string, any>;
}

interface AuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface AuditLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export const useSecuriaAuditLogs = (params: AuditLogsParams = {}) => {
  const { token } = useAuth();

  return useQuery<AuditLogsResponse>({
    queryKey: ["securia-audit-logs", params],
    queryFn: async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`${apiUrl}/api/securia/audit/logs?${searchParams}`, {
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