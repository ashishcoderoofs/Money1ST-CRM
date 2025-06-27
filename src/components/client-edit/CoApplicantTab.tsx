
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { CoApplicantBasicInfo } from "./coapplicant/CoApplicantBasicInfo";
import { CoApplicantAddress } from "./coapplicant/CoApplicantAddress";
import { CoApplicantContact } from "./coapplicant/CoApplicantContact";
import { CoApplicantEmployment } from "./coapplicant/CoApplicantEmployment";
import { CoApplicantDemographics } from "./coapplicant/CoApplicantDemographics";
import { HouseholdMembersManagement } from "./HouseholdMembersManagement";

interface CoApplicantTabProps {
  client: Tables<"clients">;
  form: any;
}

export function CoApplicantTab({ client, form }: CoApplicantTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-green-500 text-white">
          <CardTitle>Co-Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <CoApplicantBasicInfo form={form} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CoApplicantAddress form={form} />
            <CoApplicantContact form={form} />
          </div>
          <CoApplicantEmployment form={form} />
          <CoApplicantDemographics form={form} />
          
          {/* Co-Applicant Household Members Section */}
          <div className="border-t pt-6">
            <HouseholdMembersManagement 
              form={form} 
              role="coapplicant" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
