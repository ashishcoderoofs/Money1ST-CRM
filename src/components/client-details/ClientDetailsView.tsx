interface ClientDetailsViewProps {
  client: any;
  role: "applicant" | "coapplicant";
}

export function ClientDetailsView({ client, role }: ClientDetailsViewProps) {
  const isApplicant = role === "applicant";
  
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
          Personal Information
        </div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Full Name:</span><br />
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
            
            <div>
              <span className="font-semibold">Maiden Name:</span><br />
              {isApplicant 
                ? (client.applicant_maiden_name || "N/A")
                : (client.coapplicant_maiden_name || "N/A")
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Date of Birth:</span><br />
              {isApplicant 
                ? (client.applicant_dob ? new Date(client.applicant_dob).toLocaleDateString() : "N/A")
                : (client.coapplicant_dob ? new Date(client.coapplicant_dob).toLocaleDateString() : "N/A")
              }
            </div>
            
            <div>
              <span className="font-semibold">Birth Place:</span><br />
              {isApplicant 
                ? (client.applicant_birth_place || "N/A")
                : (client.coapplicant_birth_place || "N/A")
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">SSN:</span><br />
              {isApplicant 
                ? (client.applicant_ssn ? `***-**-${client.applicant_ssn.slice(-4)}` : "N/A")
                : (client.coapplicant_ssn ? `***-**-${client.coapplicant_ssn.slice(-4)}` : "N/A")
              }
            </div>
            
            <div>
              <span className="font-semibold">Race:</span><br />
              {isApplicant 
                ? (client.applicant_race || "N/A")
                : (client.coapplicant_race || "N/A")
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Marital Status:</span><br />
              {isApplicant 
                ? (client.applicant_marital_status || "N/A")
                : (client.coapplicant_marital_status || "N/A")
              }
            </div>
            
            <div>
              <span className="font-semibold">Anniversary:</span><br />
              {isApplicant 
                ? (client.applicant_anniversary ? new Date(client.applicant_anniversary).toLocaleDateString() : "N/A")
                : (client.coapplicant_anniversary ? new Date(client.coapplicant_anniversary).toLocaleDateString() : "N/A")
              }
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Spouse Name:</span><br />
              {isApplicant 
                ? (client.applicant_spouse_name || "N/A")
                : (client.coapplicant_spouse_name || "N/A")
              }
            </div>
            
            <div>
              <span className="font-semibold">Spouse Occupation:</span><br />
              {isApplicant 
                ? (client.applicant_spouse_occupation || "N/A")
                : (client.coapplicant_spouse_occupation || "N/A")
              }
            </div>
          </div>

          <div>
            <span className="font-semibold">Number of Dependents:</span><br />
            {isApplicant 
              ? (client.applicant_dependents_count || 0)
              : (client.coapplicant_dependents_count || 0)
            }
          </div>

          {(isApplicant && client.applicant_is_consultant) || (!isApplicant && client.coapplicant_is_consultant) && (
            <div>
              <span className="font-semibold">Special Notes:</span><br />
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                Is Consultant
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
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
              <span className="font-semibold">Other Phone:</span><br />
              {isApplicant ? (client.applicant_other_phone || "N/A") : (client.coapplicant_other_phone || "N/A")}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Email:</span><br />
              {isApplicant ? (client.applicant_email || "N/A") : (client.coapplicant_email || "N/A")}
            </div>
            <div>
              <span className="font-semibold">Fax:</span><br />
              {isApplicant ? (client.applicant_fax || "N/A") : (client.coapplicant_fax || "N/A")}
            </div>
          </div>
        </div>
      </div>

      {/* Current Employment Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
          Current Employment Information
        </div>
        <div className="space-y-3 p-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Employment Status:</span><br />
              {isApplicant ? (client.applicant_employment_status || "N/A") : (client.coapplicant_employment_status || "N/A")}
            </div>
            <div>
              <span className="font-semibold">Business Owner:</span><br />
              {isApplicant 
                ? (client.applicant_business_owner ? "Yes" : "No")
                : (client.coapplicant_business_owner ? "Yes" : "No")
              }
            </div>
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
            {isApplicant ? (
              client.applicant_employer_address ? 
                `${client.applicant_employer_address}${client.applicant_employer_city ? `, ${client.applicant_employer_city}` : ''}${client.applicant_employer_state ? `, ${client.applicant_employer_state}` : ''}${client.applicant_employer_zip ? ` ${client.applicant_employer_zip}` : ''}` 
                : "N/A"
            ) : (
              client.coapplicant_employer_address ? 
                `${client.coapplicant_employer_address}${client.coapplicant_employer_city ? `, ${client.coapplicant_employer_city}` : ''}${client.coapplicant_employer_state ? `, ${client.coapplicant_employer_state}` : ''}${client.coapplicant_employer_zip ? ` ${client.coapplicant_employer_zip}` : ''}` 
                : "N/A"
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Start Date:</span><br />
              {isApplicant 
                ? (client.applicant_start_date ? new Date(client.applicant_start_date).toLocaleDateString() : "N/A")
                : (client.coapplicant_start_date ? new Date(client.coapplicant_start_date).toLocaleDateString() : "N/A")
              }
            </div>
            <div>
              <span className="font-semibold">End Date:</span><br />
              {isApplicant 
                ? (client.applicant_end_date ? new Date(client.applicant_end_date).toLocaleDateString() : "N/A")
                : (client.coapplicant_end_date ? new Date(client.coapplicant_end_date).toLocaleDateString() : "N/A")
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Supervisor:</span><br />
              {isApplicant ? (client.applicant_supervisor || "N/A") : (client.coapplicant_supervisor || "N/A")}
            </div>
            <div>
              <span className="font-semibold">Employer Phone:</span><br />
              {isApplicant ? (client.applicant_employer_phone || "N/A") : (client.coapplicant_employer_phone || "N/A")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Additional Income:</span><br />
              {isApplicant 
                ? (client.applicant_additional_income ? `$${client.applicant_additional_income.toLocaleString()}` : "N/A")
                : (client.coapplicant_additional_income ? `$${client.coapplicant_additional_income.toLocaleString()}` : "N/A")
              }
            </div>
            <div>
              <span className="font-semibold">Income Source:</span><br />
              {isApplicant ? (client.applicant_additional_income_source || "N/A") : (client.coapplicant_additional_income_source || "N/A")}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Employment Information */}
      <div className="border border-gray-200 rounded bg-gray-50">
        <div className="border-b text-base font-semibold bg-gray-100 px-3 py-2 rounded-t">
          Previous Employment
        </div>
        <div className="space-y-3 p-3 text-sm">
          <div>
            <span className="font-semibold">Previous Employer:</span><br />
            {isApplicant ? (client.applicant_previous_employer || "N/A") : (client.coapplicant_previous_employer || "N/A")}
          </div>
          
          <div>
            <span className="font-semibold">Previous Employer Address:</span><br />
            {isApplicant ? (client.applicant_previous_employer_address || "N/A") : (client.coapplicant_previous_employer_address || "N/A")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Previous Occupation:</span><br />
              {isApplicant ? (client.applicant_previous_occupation || "N/A") : (client.coapplicant_previous_occupation || "N/A")}
            </div>
            <div>
              <span className="font-semibold">Employment Period:</span><br />
              {isApplicant ? (
                client.applicant_previous_employment_from && client.applicant_previous_employment_to
                  ? `${new Date(client.applicant_previous_employment_from).toLocaleDateString()} - ${new Date(client.applicant_previous_employment_to).toLocaleDateString()}`
                  : "N/A"
              ) : (
                client.coapplicant_previous_employment_from && client.coapplicant_previous_employment_to
                  ? `${new Date(client.coapplicant_previous_employment_from).toLocaleDateString()} - ${new Date(client.coapplicant_previous_employment_to).toLocaleDateString()}`
                  : "N/A"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
