
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        {isApplicant && (client.applicant_is_consultant || client.coapplicant_is_consultant) && (
          <div>
            <span className="font-semibold">Special Notes:</span><br />
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              {isApplicant && client.applicant_is_consultant ? "Is Consultant" : ""}
              {!isApplicant && client.coapplicant_is_consultant ? "Is Consultant" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
