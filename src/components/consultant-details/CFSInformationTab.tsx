
import { Card, CardContent } from "@/components/ui/card";

interface CFSInformationTabProps {
  consultant: {
    ssn?: string;
    ein?: string;
    hireDate?: string;
    yearsWithFrq?: number;
    companyName?: string;
    cfsCertificationDate?: string;
    effectiveDate?: string;
    memberType?: string;
    mbrAmt?: number;
    payType?: string;
    mpFee?: number;
    cfsStatus?: string;
    statusDate?: string;
  };
}

export function CFSInformationTab({ consultant }: CFSInformationTabProps) {
  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Company:</span> {consultant.companyName || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Hire Date:</span> {consultant.hireDate ? new Date(consultant.hireDate).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Years with FRQ:</span> {consultant.yearsWithFrq || "N/A"}
            </div>
            <div>
              <span className="font-semibold">CFS Status:</span> {consultant.cfsStatus || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Member Type:</span> {consultant.memberType || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Member Amount:</span> {consultant.mbrAmt ? `$${consultant.mbrAmt}` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">SSN:</span> {consultant.ssn || "N/A"}
            </div>
            <div>
              <span className="font-semibold">EIN:</span> {consultant.ein || "N/A"}
            </div>
            <div>
              <span className="font-semibold">CFS Certification Date:</span> {consultant.cfsCertificationDate ? new Date(consultant.cfsCertificationDate).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Effective Date:</span> {consultant.effectiveDate ? new Date(consultant.effectiveDate).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Pay Type:</span> {consultant.payType || "N/A"}
            </div>
            <div>
              <span className="font-semibold">MP Fee:</span> {consultant.mpFee ? `$${consultant.mpFee}` : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Status Date:</span> {consultant.statusDate ? new Date(consultant.statusDate).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
