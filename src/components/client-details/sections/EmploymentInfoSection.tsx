
interface EmploymentInfoSectionProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function EmploymentInfoSection({ client, role }: EmploymentInfoSectionProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="border border-gray-200 rounded bg-gray-50">
      <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
        Employment Information
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div>
          <span className="font-semibold">Employment Status:</span><br />
          {isApplicant ? (client.applicant_employment_status || "N/A") : (client.coapplicant_employment_status || "N/A")}
        </div>
        
        <div>
          <span className="font-semibold">Employer:</span><br />
          {isApplicant ? (client.applicant_employer_name || "N/A") : (client.coapplicant_employer_name || "N/A")}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Occupation:</span><br />
            {isApplicant ? (client.applicant_occupation || "N/A") : (client.coapplicant_occupation || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Monthly Salary:</span><br />
            {isApplicant 
              ? (client.applicant_monthly_salary ? `$${client.applicant_monthly_salary.toLocaleString()}` : "N/A")
              : (client.coapplicant_monthly_salary ? `$${client.coapplicant_monthly_salary.toLocaleString()}` : "N/A")
            }
          </div>
        </div>
        
        <div>
          <span className="font-semibold">Employer Address:</span><br />
          {isApplicant 
            ? (client.applicant_employer_address ? 
                `${client.applicant_employer_address}${client.applicant_employer_city ? `, ${client.applicant_employer_city}` : ''}${client.applicant_employer_state ? `, ${client.applicant_employer_state}` : ''}${client.applicant_employer_zip ? ` ${client.applicant_employer_zip}` : ''}` 
                : "N/A")
            : (client.coapplicant_employer_address ? 
                `${client.coapplicant_employer_address}${client.coapplicant_employer_city ? `, ${client.coapplicant_employer_city}` : ''}${client.coapplicant_employer_state ? `, ${client.coapplicant_employer_state}` : ''}${client.coapplicant_employer_zip ? ` ${client.coapplicant_employer_zip}` : ''}` 
                : "N/A")
          }
        </div>
        
        <div>
          <span className="font-semibold">Employer Phone:</span><br />
          {isApplicant ? (client.applicant_employer_phone || "N/A") : (client.coapplicant_employer_phone || "N/A")}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Start Date:</span><br />
            {isApplicant ? (client.applicant_start_date || "N/A") : (client.coapplicant_start_date || "N/A")}
          </div>
          <div>
            <span className="font-semibold">Business Owner:</span><br />
            {isApplicant ? (client.applicant_business_owner || "N/A") : (client.coapplicant_business_owner || "N/A")}
          </div>
        </div>
        
        {isApplicant && (
          <div>
            <span className="font-semibold">Supervisor:</span><br />
            {client.applicant_supervisor || "N/A"}
          </div>
        )}
      </div>
    </div>
  );
}
