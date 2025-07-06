import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types for the API requests
export interface CoApplicantBasicInfoData {
  includeCoApplicant?: boolean;
  title?: string;
  firstName?: string;
  mi?: string;
  lastName?: string;
  suffix?: string;
  maidenName?: string;
  isConsultant?: boolean;
  homePhone?: string;
  workPhone?: string;
  cellPhone?: string;
  otherPhone?: string;
  fax?: string;
  email?: string;
}

export interface CoApplicantAddressData {
  currentAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    county?: string;
    howLongYears?: number;
    howLongMonths?: number;
  };
  previousAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    howLongYears?: number;
    howLongMonths?: number;
  };
}

export interface CoApplicantEmploymentData {
  employment?: {
    employmentStatus?: string;
    isBusinessOwner?: boolean;
    occupation?: string;
    employerName?: string;
    employerAddress?: string;
    employerCity?: string;
    employerState?: string;
    employerZipCode?: string;
    monthlyGrossSalary?: number;
    startDate?: Date;
    endDate?: Date;
    supervisor?: string;
    supervisorPhone?: string;
    additionalIncome?: number;
    source?: string;
  };
  previousEmployment?: {
    employerName?: string;
    employerAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    occupation?: string;
    fromDate?: Date;
    toDate?: Date;
  };
}

export interface CoApplicantDemographicsData {
  birthPlace?: string;
  dateOfBirth?: string;
  race?: string;
  maritalStatus?: string;
  anniversary?: string;
  spouseName?: string;
  spouseOccupation?: string;
  numberOfDependents?: number;
}

// Helper function to make authenticated API calls
const makeSecuriaApiCall = async (
  apiCall: (url: string, options?: RequestInit) => Promise<Response>,
  endpoint: string,
  data: any
) => {
  const response = await apiCall(`/api/securia${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update: ${response.status}`);
  }

  return response.json();
};

// Hook to update co-applicant basic information
export const useUpdateCoApplicantBasicInfo = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: CoApplicantBasicInfoData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/co-applicant/basic-info`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Co-applicant basic information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update co-applicant basic information");
    },
  });
};

// Hook to update co-applicant address information
export const useUpdateCoApplicantAddress = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: CoApplicantAddressData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/co-applicant/address`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Co-applicant address information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update co-applicant address information");
    },
  });
};

// Hook to update co-applicant employment information
export const useUpdateCoApplicantEmployment = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: CoApplicantEmploymentData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/co-applicant/employment`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Co-applicant employment information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update co-applicant employment information");
    },
  });
};

// Hook to update co-applicant demographics information
export const useUpdateCoApplicantDemographics = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: CoApplicantDemographicsData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/co-applicant/demographics`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Co-applicant demographics information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update co-applicant demographics information");
    },
  });
};
