
import { Tables } from "@/integrations/supabase/types";
import { createBasicClientData } from "./mock-data/basicClientData";
import { createApplicantData } from "./mock-data/applicantData";
import { createCoApplicantData } from "./mock-data/coApplicantData";
import { createVehicleHomeownersData } from "./mock-data/vehicleHomeownersData";
import { createUnderwritingData } from "./mock-data/underwritingData";

export const createMockClient = (): Tables<"clients"> => ({
  ...createBasicClientData(),
  ...createApplicantData(),
  ...createCoApplicantData(),
  ...createVehicleHomeownersData(),
  ...createUnderwritingData(),
} as Tables<"clients">);
