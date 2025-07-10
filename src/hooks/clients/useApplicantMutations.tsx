import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Types for the API requests
export interface ApplicantBasicInfoData {
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

export interface ApplicantAddressData {
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

export interface ApplicantEmploymentData {
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

export type ApplicantDemographicsData = {
  birthPlace?: string;
  dateOfBirth?: string;
  ssn?: string;
  race?: string;
  maritalStatus?: string;
  anniversary?: string;
  spouseName?: string;
  spouseOccupation?: string;
  numberOfDependents?: number;
  // snake_case for backend
  birth_place?: string;
  dob?: string;
  marital_status?: string;
  spouse_name?: string;
  spouse_occupation?: string;
  number_of_dependents?: number;
};

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

// Hook to update applicant basic information
export const useUpdateApplicantBasicInfo = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: ApplicantBasicInfoData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/applicant/basic-info`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Applicant basic information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update applicant basic information");
    },
  });
};

// Hook to update applicant address information
export const useUpdateApplicantAddress = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: ApplicantAddressData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/applicant/address`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Applicant address information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update applicant address information");
    },
  });
};

// Hook to update applicant employment information
export const useUpdateApplicantEmployment = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: ApplicantEmploymentData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/applicant/employment`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Applicant employment information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update applicant employment information");
    },
  });
};

// Hook to update applicant demographics information
export const useUpdateApplicantDemographics = () => {
  const queryClient = useQueryClient();
  const { apiCall } = useAuth();

  return useMutation({
    mutationFn: async ({ clientId, data }: { clientId: string; data: ApplicantDemographicsData }) => {
      return makeSecuriaApiCall(apiCall, `/clients/${clientId}/applicant/demographics`, data);
    },
    onSuccess: (_, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] });
      queryClient.invalidateQueries({ queryKey: ["securia-clients"] });
      toast.success("Applicant demographics information updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update applicant demographics information");
    },
  });
};
