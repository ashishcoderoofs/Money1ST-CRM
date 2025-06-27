
import { Card, CardContent } from "@/components/ui/card";

interface CFSInformationTabProps {
  consultant: {
    ssn: string | null;
    ein: string | null;
    hire_date: string | null;
    years_with_frq: number | null;
    company_name: string | null;
    cfs_certification_date: string | null;
    effective_date: string | null;
    member_type: string | null;
    mbr_amt: number | null;
    pay_type: string | null;
    mp_fee: number | null;
    cfs_status: string | null;
    status_date: string | null;
  };
}

export function CFSInformationTab({ consultant }: CFSInformationTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Company:</span> {consultant.company_name || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Hire Date:</span> {consultant.hire_date ? new Date(consultant.hire_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Years with FRQ:</span> {consultant.years_with_frq || "N/A"}
            </div>
            <div>
              <span className="font-semibold">CFS Status:</span> {consultant.cfs_status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Member Type:</span> {consultant.member_type || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Member Amount:</span> {consultant.mbr_amt ? `$${consultant.mbr_amt}` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">SSN:</span> {consultant.ssn || "N/A"}
            </div>
            <div>
              <span className="font-semibold">EIN:</span> {consultant.ein || "N/A"}
            </div>
            <div>
              <span className="font-semibold">CFS Certification Date:</span> {consultant.cfs_certification_date ? new Date(consultant.cfs_certification_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Effective Date:</span> {consultant.effective_date ? new Date(consultant.effective_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Pay Type:</span> {consultant.pay_type || "N/A"}
            </div>
            <div>
              <span className="font-semibold">MP Fee:</span> {consultant.mp_fee ? `$${consultant.mp_fee}` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Status Date:</span> {consultant.status_date ? new Date(consultant.status_date).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
