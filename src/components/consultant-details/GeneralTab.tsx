
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeneralTabProps {
  consultant: {
    first_name: string | null;
    last_name: string | null;
    maiden_name: string | null;
    comment: string | null;
    remarks: string | null;
    title: string | null;
    mi: string | null;
    suffix: string | null;
    role: string;
    created_at: string;
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

export function GeneralTab({ consultant }: GeneralTabProps) {
  const getFullName = () => {
    const parts = [
      consultant.title && consultant.title !== 'placeholder' ? consultant.title : null,
      consultant.first_name,
      consultant.mi,
      consultant.last_name,
      consultant.suffix
    ].filter(Boolean);
    return parts.join(' ');
  };

  const hasPersonalInfo = consultant.dob || consultant.marital_status || consultant.sex || 
    consultant.race || consultant.spouse_name || consultant.anniversary || consultant.spouse_occupation;

  const hasProfessionalInfo = consultant.education_level || consultant.drivers_license_number || 
    consultant.drivers_license_state || consultant.employment_status || consultant.employer || 
    consultant.occupation || consultant.industry;

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="font-medium text-muted-foreground">Full Name</p>
            <p>{getFullName() || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Role</p>
            <p>{consultant.role}</p>
          </div>
          {consultant.maiden_name && (
            <div>
              <p className="font-medium text-muted-foreground">Maiden Name</p>
              <p>{consultant.maiden_name}</p>
            </div>
          )}
          <div>
            <p className="font-medium text-muted-foreground">Member Since</p>
            <p>{new Date(consultant.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {hasPersonalInfo && (
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {consultant.dob && (
              <div>
                <p className="font-medium text-muted-foreground">Date of Birth</p>
                <p>{new Date(consultant.dob).toLocaleDateString()}</p>
              </div>
            )}
            {consultant.marital_status && (
              <div>
                <p className="font-medium text-muted-foreground">Marital Status</p>
                <p>{consultant.marital_status}</p>
              </div>
            )}
            {consultant.sex && (
              <div>
                <p className="font-medium text-muted-foreground">Gender</p>
                <p>{consultant.sex}</p>
              </div>
            )}
            {consultant.race && (
              <div>
                <p className="font-medium text-muted-foreground">Race</p>
                <p>{consultant.race}</p>
              </div>
            )}
            {consultant.spouse_name && (
              <div>
                <p className="font-medium text-muted-foreground">Spouse Name</p>
                <p>{consultant.spouse_name}</p>
              </div>
            )}
            {consultant.anniversary && (
              <div>
                <p className="font-medium text-muted-foreground">Anniversary</p>
                <p>{new Date(consultant.anniversary).toLocaleDateString()}</p>
              </div>
            )}
            {consultant.spouse_occupation && (
              <div>
                <p className="font-medium text-muted-foreground">Spouse Occupation</p>
                <p>{consultant.spouse_occupation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {hasProfessionalInfo && (
        <Card>
          <CardHeader><CardTitle>Professional Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {consultant.education_level && (
              <div>
                <p className="font-medium text-muted-foreground">Education Level</p>
                <p>{consultant.education_level}</p>
              </div>
            )}
            {consultant.employment_status && (
              <div>
                <p className="font-medium text-muted-foreground">Employment Status</p>
                <p>{consultant.employment_status}</p>
              </div>
            )}
            {consultant.employer && (
              <div>
                <p className="font-medium text-muted-foreground">Employer</p>
                <p>{consultant.employer}</p>
              </div>
            )}
            {consultant.occupation && (
              <div>
                <p className="font-medium text-muted-foreground">Occupation</p>
                <p>{consultant.occupation}</p>
              </div>
            )}
            {consultant.industry && (
              <div>
                <p className="font-medium text-muted-foreground">Industry</p>
                <p>{consultant.industry}</p>
              </div>
            )}
            {consultant.drivers_license_number && (
              <div>
                <p className="font-medium text-muted-foreground">Driver's License Number</p>
                <p>{consultant.drivers_license_number}</p>
              </div>
            )}
            {consultant.drivers_license_state && (
              <div>
                <p className="font-medium text-muted-foreground">Driver's License State</p>
                <p>{consultant.drivers_license_state}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {(consultant.comment || consultant.remarks) && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            {consultant.comment && (
              <div>
                <p className="font-medium text-muted-foreground">Comment</p>
                <p className="whitespace-pre-wrap">{consultant.comment}</p>
              </div>
            )}
            {consultant.remarks && (
              <div>
                <p className="font-medium text-muted-foreground">Remarks</p>
                <p className="whitespace-pre-wrap">{consultant.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
