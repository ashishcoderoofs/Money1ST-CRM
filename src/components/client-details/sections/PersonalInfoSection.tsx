
interface PersonalInfoSectionProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function PersonalInfoSection({ client, role }: PersonalInfoSectionProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="border border-gray-200 rounded bg-gray-50">
      <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
        Personal Information
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div>
          <span className="font-semibold">Name:</span><br />
          {isApplicant 
            ? (client.applicant_first_name || client.applicant_last_name 
                ? `${client.applicant_title || ''} ${client.applicant_first_name || ''} ${client.applicant_mi || ''} ${client.applicant_last_name || ''} ${client.applicant_suffix || ''}`.replace(/\s+/g, ' ').trim()
                : "N/A"
              )
            : (client.coapplicant_first_name || client.coapplicant_last_name 
                ? `${client.coapplicant_title || ''} ${client.coapplicant_first_name || ''} ${client.coapplicant_mi || ''} ${client.coapplicant_last_name || ''} ${client.coapplicant_suffix || ''}`.replace(/\s+/g, ' ').trim()
                : "N/A"
              )
          }
        </div>
      </div>
    </div>
  );
}
