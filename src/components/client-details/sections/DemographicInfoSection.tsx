
interface DemographicInfoSectionProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function DemographicInfoSection({ client, role }: DemographicInfoSectionProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="border border-gray-200 rounded bg-gray-50">
      <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
        Demographic Information
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Date of Birth:</span><br />
            {isApplicant ? (client.applicant_dob || "N/A") : (client.coapplicant_dob || "N/A")}
          </div>
          <div>
            <span className="font-semibold">SSN:</span><br />
            {isApplicant ? (client.applicant_ssn || "N/A") : (client.coapplicant_ssn || "N/A")}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Race:</span><br />
            {isApplicant ? (client.applicant_race || "N/A") : (client.coapplicant_race || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Marital Status:</span><br />
            {isApplicant ? (client.applicant_marital_status || "N/A") : (client.coapplicant_marital_status || "N/A")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Birth Place:</span><br />
            {isApplicant ? (client.applicant_birth_place || "N/A") : (client.coapplicant_birth_place || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Anniversary:</span><br />
            {isApplicant ? (client.applicant_anniversary || "N/A") : (client.coapplicant_anniversary || "N/A")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Spouse Name:</span><br />
            {isApplicant ? (client.applicant_spouse_name || "N/A") : (client.coapplicant_spouse_name || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Spouse Occupation:</span><br />
            {isApplicant ? (client.applicant_spouse_occupation || "N/A") : (client.coapplicant_spouse_occupation || "N/A")}
          </div>
        </div>

        <div>
          <span className="font-semibold">Dependents Count:</span><br />
          {isApplicant ? (client.applicant_dependents_count || "0") : (client.coapplicant_dependents_count || "0")}
        </div>
      </div>
    </div>
  );
}
