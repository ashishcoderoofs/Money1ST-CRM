
import { Card, CardContent } from "@/components/ui/card";

interface PersonalTabProps {
  consultant: {
    dob: string | null;
    marital_status: string | null;
    sex: string | null;
    race: string | null;
    spouse_name: string | null;
    anniversary: string | null;
    spouse_occupation: string | null;
    education_level: string | null;
    drivers_license_number: string | null;
    drivers_license_state: string | null;
    employment_status: string | null;
    employer: string | null;
    occupation: string | null;
    industry: string | null;
  };
}

export function PersonalTab({ consultant }: PersonalTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Date of Birth:</span> {consultant.dob ? new Date(consultant.dob).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Marital Status:</span> {consultant.marital_status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Gender:</span> {consultant.sex || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Race:</span> {consultant.race || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Spouse Name:</span> {consultant.spouse_name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Anniversary:</span> {consultant.anniversary ? new Date(consultant.anniversary).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Spouse Occupation:</span> {consultant.spouse_occupation || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Education Level:</span> {consultant.education_level || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Driver's License Number:</span> {consultant.drivers_license_number || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Driver's License State:</span> {consultant.drivers_license_state || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Employment Status:</span> {consultant.employment_status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Employer:</span> {consultant.employer || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Occupation:</span> {consultant.occupation || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Industry:</span> {consultant.industry || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
