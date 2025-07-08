interface ClientDetailsViewProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function ClientDetailsView({ client, role }: ClientDetailsViewProps) {
  const isApplicant = role === "applicant";
  const data = isApplicant ? client.applicant : client.coApplicant;

  if (!data) return <div className="p-4">No {isApplicant ? "Applicant" : "Co-Applicant"} data available.</div>;

  return (
    <div className="space-y-6">
      {/* Case Information */}
      {isApplicant && (
        <div className="border border-gray-200 rounded bg-gray-50">
          <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Case Information</div>
          <div className="space-y-3 p-3 text-sm">
            <div><span className="font-semibold">Client ID:</span> {client.clientId || client._id || "N/A"}</div>
            <div><span className="font-semibold">Entry Date:</span> {client.entryDate ? new Date(client.entryDate).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">Payoff Amount:</span> {client.payoffAmount != null ? `$${client.payoffAmount}` : "N/A"}</div>
            <div><span className="font-semibold">Status:</span> {client.status || "N/A"}</div>
            <div><span className="font-semibold">Consultant:</span> {client.consultant || "N/A"}</div>
            <div><span className="font-semibold">Processor:</span> {client.processor || "N/A"}</div>
          </div>
        </div>
      )}

      {/* Name Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Name Information</div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-semibold">Title:</span> {data.title || "N/A"}</div>
            <div><span className="font-semibold">First Name:</span> {data.firstName || "N/A"}</div>
            <div><span className="font-semibold">Middle Initial:</span> {data.middleInitial || "N/A"}</div>
            <div><span className="font-semibold">Last Name:</span> {data.lastName || "N/A"}</div>
            <div><span className="font-semibold">Suffix:</span> {data.suffix || "N/A"}</div>
            <div><span className="font-semibold">Maiden Name:</span> {data.maidenName || "N/A"}</div>
            <div><span className="font-semibold">Is Consultant:</span> {data.isConsultant ? "Yes" : "No"}</div>
          </div>
        </div>
      </div>

      {/* Current Address */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Current Address</div>
        <div className="space-y-3 p-3 text-sm">
          <div><span className="font-semibold">Address:</span> {data.currentAddress?.street || "N/A"}</div>
          <div><span className="font-semibold">City:</span> {data.currentAddress?.city || "N/A"}</div>
          <div><span className="font-semibold">State:</span> {data.currentAddress?.state || "N/A"}</div>
          <div><span className="font-semibold">Zip Code:</span> {data.currentAddress?.zipCode || "N/A"}</div>
          <div><span className="font-semibold">County:</span> {data.currentAddress?.county || "N/A"}</div>
          <div><span className="font-semibold">How Long at Current Address:</span> {`${data.currentAddress?.howLongYears || 0} years, ${data.currentAddress?.howLongMonths || 0} months`}</div>
        </div>
      </div>

      {/* Previous Address */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Previous Address</div>
        <div className="space-y-3 p-3 text-sm">
          <div><span className="font-semibold">Address:</span> {data.previousAddress?.street || "N/A"}</div>
          <div><span className="font-semibold">City:</span> {data.previousAddress?.city || "N/A"}</div>
          <div><span className="font-semibold">State:</span> {data.previousAddress?.state || "N/A"}</div>
          <div><span className="font-semibold">Zip Code:</span> {data.previousAddress?.zipCode || "N/A"}</div>
          <div><span className="font-semibold">How Long at Previous Address:</span> {`${data.previousAddress?.howLongYears || 0} years, ${data.previousAddress?.howLongMonths || 0} months`}</div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Contact Information</div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Home Phone:</span> {data.homePhone || "N/A"}</div>
            <div><span className="font-semibold">Work Phone:</span> {data.workPhone || "N/A"}</div>
            <div><span className="font-semibold">Cell Phone:</span> {data.cellPhone || "N/A"}</div>
            <div><span className="font-semibold">Other Phone:</span> {data.otherPhone || "N/A"}</div>
            <div><span className="font-semibold">Email:</span> {data.email || "N/A"}</div>
            <div><span className="font-semibold">Fax:</span> {data.fax || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Current Employment Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Current Employment Information</div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Employment Status:</span> {data.employment?.employmentStatus || "N/A"}</div>
            <div><span className="font-semibold">Business Owner:</span> {data.employment?.isBusinessOwner ? "Yes" : "No"}</div>
            <div><span className="font-semibold">Occupation:</span> {data.employment?.occupation || "N/A"}</div>
            <div><span className="font-semibold">Employer Name:</span> {data.employment?.employerName || "N/A"}</div>
            <div><span className="font-semibold">Employer Address:</span> {data.employment?.employerAddress || "N/A"}</div>
            <div><span className="font-semibold">City:</span> {data.employment?.employerCity || "N/A"}</div>
            <div><span className="font-semibold">State:</span> {data.employment?.employerState || "N/A"}</div>
            <div><span className="font-semibold">Zip Code:</span> {data.employment?.employerZipCode || "N/A"}</div>
            <div><span className="font-semibold">Gross Monthly Salary:</span> {data.employment?.monthlyGrossSalary != null ? `$${data.employment?.monthlyGrossSalary}` : "N/A"}</div>
            <div><span className="font-semibold">Start Date:</span> {data.employment?.startDate ? new Date(data.employment?.startDate).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">End Date:</span> {data.employment?.endDate ? new Date(data.employment?.endDate).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">Supervisor:</span> {data.employment?.supervisor || "N/A"}</div>
            <div><span className="font-semibold">Supervisor Phone:</span> {data.employment?.supervisorPhone || "N/A"}</div>
            <div><span className="font-semibold">Additional Income:</span> {data.employment?.additionalIncome != null ? `$${data.employment?.additionalIncome}` : "N/A"}</div>
            <div><span className="font-semibold">Source:</span> {data.employment?.source || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Previous Employment Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Previous Employment Information</div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Employer Name:</span> {data.previousEmployment?.employerName || "N/A"}</div>
            <div><span className="font-semibold">Employer Address:</span> {data.previousEmployment?.employerAddress || "N/A"}</div>
            <div><span className="font-semibold">City:</span> {data.previousEmployment?.city || "N/A"}</div>
            <div><span className="font-semibold">State:</span> {data.previousEmployment?.state || "N/A"}</div>
            <div><span className="font-semibold">Zip Code:</span> {data.previousEmployment?.zipCode || "N/A"}</div>
            <div><span className="font-semibold">Occupation:</span> {data.previousEmployment?.occupation || "N/A"}</div>
            <div><span className="font-semibold">From Date:</span> {data.previousEmployment?.fromDate ? new Date(data.previousEmployment?.fromDate).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">To Date:</span> {data.previousEmployment?.toDate ? new Date(data.previousEmployment?.toDate).toLocaleDateString() : "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Demographic Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">Demographic Information</div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="font-semibold">Birth Place:</span> {data.demographics?.birthPlace || "N/A"}</div>
            <div><span className="font-semibold">Date of Birth:</span> {data.demographics?.dateOfBirth ? new Date(data.demographics?.dateOfBirth).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">SSN:</span> {data.demographics?.ssn ? `***-**-${data.demographics?.ssn.slice(-4)}` : "N/A"}</div>
            <div><span className="font-semibold">Race:</span> {data.demographics?.race || "N/A"}</div>
            <div><span className="font-semibold">Marital Status:</span> {data.demographics?.maritalStatus || "N/A"}</div>
            <div><span className="font-semibold">Anniversary:</span> {data.demographics?.anniversary ? new Date(data.demographics?.anniversary).toLocaleDateString() : "N/A"}</div>
            <div><span className="font-semibold">Spouse Name:</span> {data.demographics?.spouseName || "N/A"}</div>
            <div><span className="font-semibold">Spouse Occupation:</span> {data.demographics?.spouseOccupation || "N/A"}</div>
            <div><span className="font-semibold">Number of Dependents:</span> {data.demographics?.numberOfDependents != null ? data.demographics?.numberOfDependents : "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
