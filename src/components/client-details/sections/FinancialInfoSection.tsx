
interface FinancialInfoSectionProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function FinancialInfoSection({ client, role }: FinancialInfoSectionProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="border border-gray-200 rounded bg-gray-50">
      <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
        Financial Information
      </div>
      <div className="space-y-3 p-3 text-sm">
        <div>
          <span className="font-semibold">Total Debt:</span><br />
          ${isApplicant 
            ? (client.total_debt?.toLocaleString() || "0")
            : (client.co_applicant_total_debt?.toLocaleString() || "0")
          }
        </div>
        
        <div>
          <span className="font-semibold">Additional Income:</span><br />
          {isApplicant 
            ? (client.applicant_additional_income ? `$${client.applicant_additional_income.toLocaleString()}` : "N/A")
            : (client.coapplicant_additional_income ? `$${client.coapplicant_additional_income.toLocaleString()}` : "N/A")
          }
        </div>
        
        <div>
          <span className="font-semibold">Additional Income Source:</span><br />
          {isApplicant ? (client.applicant_additional_income_source || "N/A") : (client.coapplicant_additional_income_source || "N/A")}
        </div>
      </div>
    </div>
  );
}
