
interface ContactInfoSectionProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function ContactInfoSection({ client, role }: ContactInfoSectionProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="border border-gray-200 rounded bg-gray-50">
      <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
        Contact Information
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div>
          <span className="font-semibold">Current Address:</span><br />
          {isApplicant ? (
            `${client.applicant_address || ''}, ${client.applicant_city || ''}, ${client.applicant_state || ''} ${client.applicant_zip_code || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,+/g, ',') || "N/A"
          ) : (
            `${client.coapplicant_address || ''}, ${client.coapplicant_city || ''}, ${client.coapplicant_state || ''} ${client.coapplicant_zip_code || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,+/g, ',') || "N/A"
          )}
        </div>
        
        <div>
          <span className="font-semibold">County:</span><br />
          {isApplicant ? (client.applicant_county || "N/A") : (client.coapplicant_county || "N/A")}
        </div>

        <div>
          <span className="font-semibold">Time at Current Address:</span><br />
          {isApplicant ? (client.applicant_time_at_address || "N/A") : (client.coapplicant_time_at_address || "N/A")}
        </div>

        <div>
          <span className="font-semibold">Previous Address:</span><br />
          {isApplicant ? (
            client.applicant_previous_address 
              ? `${client.applicant_previous_address}, ${client.applicant_previous_address_time || ''}`
              : "N/A"
          ) : (
            client.coapplicant_previous_address 
              ? `${client.coapplicant_previous_address}, ${client.coapplicant_previous_address_time || ''}`
              : "N/A"
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Home Phone:</span><br />
            {isApplicant ? (client.applicant_home_phone || "N/A") : (client.coapplicant_home_phone || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Cell Phone:</span><br />
            {isApplicant ? (client.applicant_cell_phone || "N/A") : (client.coapplicant_cell_phone || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Other Phone:</span><br />
            {isApplicant ? (client.applicant_other_phone || "N/A") : (client.coapplicant_other_phone || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Email:</span><br />
            {isApplicant ? (client.applicant_email || "N/A") : (client.coapplicant_email || "N/A")}
          </div>
        </div>
        
        <div>
          <span className="font-semibold">Fax:</span><br />
          {isApplicant ? (client.applicant_fax || "N/A") : (client.coapplicant_fax || "N/A")}
        </div>
      </div>
    </div>
  );
}
