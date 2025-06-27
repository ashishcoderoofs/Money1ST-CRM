
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HouseholdMembersTable from "./HouseholdMembersTable";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ContactInfoSection } from "./sections/ContactInfoSection";
import { EmploymentInfoSection } from "./sections/EmploymentInfoSection";
import { FinancialInfoSection } from "./sections/FinancialInfoSection";
import { DemographicInfoSection } from "./sections/DemographicInfoSection";

export default function DetailsTabSection({
  client,
  role,
}: {
  client: any;
  role: "applicant" | "coapplicant";
}) {
  const isApplicant = role === "applicant";
  
  if (!isApplicant) {
    // Show detailed Co-Applicant information layout
    return (
      <div className="space-y-4">
        <div className="bg-white border border-gray-300 rounded-b mb-5 px-0 md:px-6 pt-0 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
            <PersonalInfoSection client={client} role={role} />
            <ContactInfoSection client={client} role={role} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
            <EmploymentInfoSection client={client} role={role} />
            <FinancialInfoSection client={client} role={role} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
            <DemographicInfoSection client={client} role={role} />
          </div>
        </div>
      </div>
    );
  }

  // For applicant, show detailed layout with employment and demographic information
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-300 rounded-b mb-5 px-0 md:px-6 pt-0 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
          <PersonalInfoSection client={client} role={role} />
          <ContactInfoSection client={client} role={role} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
          <EmploymentInfoSection client={client} role={role} />
          <FinancialInfoSection client={client} role={role} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 px-4">
          <DemographicInfoSection client={client} role={role} />
        </div>
      </div>

      <HouseholdMembersTable client={client} role="applicant" />
    </div>
  );
}
