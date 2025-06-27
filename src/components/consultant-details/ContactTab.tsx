
import { Card, CardContent } from "@/components/ui/card";

interface ContactTabProps {
  consultant: {
    email: string;
    phone: string | null;
    mobile_phone: string | null;
    work_phone: string | null;
    other_phone: string | null;
    fax: string | null;
    address: string | null;
    city: string | null;
    county: string | null;
    state: string | null;
    zip_code: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_phone: string | null;
    maiden_name: string | null;
    membership_type: string | null;
    amount: number | null;
    joint_member_name: string | null;
  };
}

export function ContactTab({ consultant }: ContactTabProps) {
  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Maiden or Other Name Used:</span> {consultant.maiden_name || "N/A"}
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
              <span className="font-semibold">Zip Code:</span> {consultant.zip_code || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Home Phone:</span> {consultant.phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Mobile:</span> {consultant.mobile_phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Work:</span> {consultant.work_phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Other:</span> {consultant.other_phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Fax:</span> {consultant.fax || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Membership Type:</span> {consultant.membership_type || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Amount:</span> {consultant.amount ? `$${consultant.amount}` : "N/A"}
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold">Joint Member's Name:</span> {consultant.joint_member_name || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Emergency Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold">Emergency Contact:</span> {consultant.emergency_contact_name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Relationship:</span> {consultant.emergency_contact_relationship || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {consultant.emergency_contact_phone || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
