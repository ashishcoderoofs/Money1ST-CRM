
import { Card, CardContent } from "@/components/ui/card";

interface ContactTabProps {
  consultant: {
    email: string;
    homePhone?: string;
    mobile?: string;
    workPhone?: string;
    otherPhone?: string;
    fax?: string;
    address?: string;
    city?: string;
    county?: string;
    state?: string;
    zipCode?: string;
    emergencyContactName?: string;
    emergencyContactRelationship?: string;
    emergencyContactPhone?: string;
    maidenName?: string;
    membershipType?: string;
    amount?: number;
    jointMemberName?: string;
  };
}

export function ContactTab({ consultant }: ContactTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Maiden or Other Name Used:</span> {consultant.maidenName || "N/A"}
            </div>
            <div>
              <span className="font-semibold">E-mail:</span> {consultant.email}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold">Address:</span> {consultant.address || "N/A"}
            </div>
            <div>
              <span className="font-semibold">City:</span> {consultant.city || "N/A"}
            </div>
            <div>
              <span className="font-semibold">County:</span> {consultant.county || "N/A"}
            </div>
            <div>
              <span className="font-semibold">State:</span> {consultant.state || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Zip Code:</span> {consultant.zipCode || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Home Phone:</span> {consultant.homePhone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Mobile:</span> {consultant.mobile || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Work:</span> {consultant.workPhone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Other:</span> {consultant.otherPhone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Fax:</span> {consultant.fax || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Membership Type:</span> {consultant.membershipType || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Amount:</span> {consultant.amount ? `$${consultant.amount}` : "N/A"}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold">Joint Member's Name:</span> {consultant.jointMemberName || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold">Emergency Contact:</span> {consultant.emergencyContactName || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Relationship:</span> {consultant.emergencyContactRelationship || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {consultant.emergencyContactPhone || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
