
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
          <span className="font-semibold">Address:</span><br />
          {isApplicant ? (client.applicant_address || "N/A") : (client.coapplicant_address || "N/A")}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Home Phone:</span><br />
            {isApplicant ? (client.applicant_home_phone || "N/A") : (client.coapplicant_home_phone || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Mobile Phone:</span><br />
            {isApplicant ? (client.applicant_contact || "N/A") : (client.coapplicant_contact || "N/A")}
          </div>
        </div>
        
        <div>
          <span className="font-semibold">Email:</span><br />
          {isApplicant ? (client.applicant_email || "N/A") : (client.coapplicant_email || "N/A")}
        </div>
      </div>
    </div>
  );
}
