
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HouseholdMembersTable from "./HouseholdMembersTable";
import { ClientDetailsView } from "./ClientDetailsView";

export default function DetailsTabSection({
  client,
  role,
}: {
  client: any;
  role: "applicant" | "coapplicant";
}) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-300 rounded-b mb-5 px-0 md:px-6 pt-0 pb-4">
        <div className="pt-4 px-4">
          <ClientDetailsView client={client} role={role} />
        </div>
      </div>

      {isApplicant && (
        <HouseholdMembersTable client={client} role="applicant" />
      )}
    </div>
  );
}
