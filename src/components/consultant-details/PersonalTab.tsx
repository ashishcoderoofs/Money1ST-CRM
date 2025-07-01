
import { Card, CardContent } from "@/components/ui/card";

interface PersonalTabProps {
  consultant: {
    dateOfBirth?: string;
    maritalStatus?: string;
    sex?: string;
    race?: string;
    spouseName?: string;
    anniversary?: string;
    spouseOccupation?: string;
    educationLevel?: string;
    driversLicenseNumber?: string;
    driversLicenseState?: string;
    employmentStatus?: string;
    employer?: string;
    occupation?: string;
    industry?: string;
  };
}

export function PersonalTab({ consultant }: PersonalTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Date of Birth:</span> {consultant.dateOfBirth ? new Date(consultant.dateOfBirth).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Marital Status:</span> {consultant.maritalStatus || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Gender:</span> {consultant.sex || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Race:</span> {consultant.race || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Spouse Name:</span> {consultant.spouseName || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Anniversary:</span> {consultant.anniversary ? new Date(consultant.anniversary).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Spouse Occupation:</span> {consultant.spouseOccupation || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Education Level:</span> {consultant.educationLevel || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Driver's License Number:</span> {consultant.driversLicenseNumber || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Driver's License State:</span> {consultant.driversLicenseState || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Employment Status:</span> {consultant.employmentStatus || "N/A"}
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
