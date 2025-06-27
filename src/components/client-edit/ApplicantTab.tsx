
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { ApplicantBasicInfo } from "./applicant/ApplicantBasicInfo";
import { ApplicantAddress } from "./applicant/ApplicantAddress";
import { ApplicantContact } from "./applicant/ApplicantContact";
import { ApplicantEmployment } from "./applicant/ApplicantEmployment";
import { ApplicantDemographics } from "./applicant/ApplicantDemographics";
import { HouseholdMembersManagement } from "./HouseholdMembersManagement";

interface ApplicantTabProps {
  client: Tables<"clients">;
  form: any;
}

export function ApplicantTab({ client, form }: ApplicantTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-cyan-500 text-white">
          <CardTitle>Primary Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <ApplicantBasicInfo form={form} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ApplicantAddress form={form} />
            <ApplicantContact form={form} />
          </div>
          <ApplicantEmployment form={form} />
          <ApplicantDemographics form={form} />
          
          {/* Household Members Section */}
          <div className="border-t pt-6">
            <HouseholdMembersManagement 
              form={form} 
              role="applicant" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
