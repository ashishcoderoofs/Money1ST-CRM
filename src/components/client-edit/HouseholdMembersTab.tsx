
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HouseholdMembersManagement } from "./HouseholdMembersManagement";
import { Tables } from "@/integrations/supabase/types";

interface HouseholdMembersTabProps {
  client: Tables<"clients">;
  form: any;
}

export function HouseholdMembersTab({ client, form }: HouseholdMembersTabProps) {
  return (
    <div className="space-y-6">
      {/* Primary Applicant Household Members */}
      <Card>
        <CardHeader className="bg-gray-600 text-white">
          <CardTitle>Applicant Household Members</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <HouseholdMembersManagement 
            form={form} 
            role="applicant" 
          />
        </CardContent>
      </Card>
      
      {/* Co-Applicant Household Members */}
      <Card>
        <CardHeader className="bg-gray-600 text-white">
          <CardTitle>Co-Applicant Household Members</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <HouseholdMembersManagement 
            form={form} 
            role="coapplicant" 
          />
        </CardContent>
      </Card>
    </div>
  );
}
