
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MembershipTabProps {
  consultant: {
    membership_type: string | null;
    amount: number | null;
    joint_member_name: string | null;
    member_type: string | null;
    mbr_amt: number | null;
    cfs_status: string | null;
    hire_date: string | null;
    years_with_frq: number | null;
    company_name: string | null;
    ssn: string | null;
    ein: string | null;
    cfs_certification_date: string | null;
    effective_date: string | null;
    pay_type: string | null;
    mp_fee: number | null;
    status_date: string | null;
  };
}

export function MembershipTab({ consultant }: MembershipTabProps) {
  const hasMembershipInfo = consultant.membership_type || consultant.amount || consultant.joint_member_name;
  const hasCFSInfo = consultant.member_type || consultant.mbr_amt || consultant.cfs_status || 
    consultant.hire_date || consultant.years_with_frq || consultant.company_name ||
    consultant.ssn || consultant.ein || consultant.cfs_certification_date || 
    consultant.effective_date || consultant.pay_type || consultant.mp_fee || consultant.status_date;

  return (
    <div className="mt-4 space-y-4">
      {hasMembershipInfo && (
        <Card>
          <CardHeader><CardTitle>Membership Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {consultant.membership_type && (
              <div>
                <p className="font-medium text-muted-foreground">Membership Type</p>
                <p>{consultant.membership_type}</p>
              </div>
            )}
            {consultant.amount && (
              <div>
                <p className="font-medium text-muted-foreground">Amount</p>
                <p>${consultant.amount}</p>
              </div>
            )}
            {consultant.joint_member_name && (
              <div>
                <p className="font-medium text-muted-foreground">Joint Member Name</p>
                <p>{consultant.joint_member_name}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {hasCFSInfo && (
        <Card>
          <CardHeader><CardTitle>CFS Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            {consultant.company_name && (
              <div>
                <p className="font-medium text-muted-foreground">Company</p>
                <p>{consultant.company_name}</p>
              </div>
            )}
            {consultant.hire_date && (
              <div>
                <p className="font-medium text-muted-foreground">Hire Date</p>
                <p>{new Date(consultant.hire_date).toLocaleDateString()}</p>
              </div>
            )}
            {consultant.years_with_frq && (
              <div>
                <p className="font-medium text-muted-foreground">Years with FRQ</p>
                <p>{consultant.years_with_frq}</p>
              </div>
            )}
            {consultant.cfs_status && (
              <div>
                <p className="font-medium text-muted-foreground">CFS Status</p>
                <p>{consultant.cfs_status}</p>
              </div>
            )}
            {consultant.member_type && (
              <div>
                <p className="font-medium text-muted-foreground">Member Type</p>
                <p>{consultant.member_type}</p>
              </div>
            )}
            {consultant.mbr_amt && (
              <div>
                <p className="font-medium text-muted-foreground">Member Amount</p>
                <p>${consultant.mbr_amt}</p>
              </div>
            )}
            {consultant.ssn && (
              <div>
                <p className="font-medium text-muted-foreground">SSN</p>
                <p>{consultant.ssn}</p>
              </div>
            )}
            {consultant.ein && (
              <div>
                <p className="font-medium text-muted-foreground">EIN</p>
                <p>{consultant.ein}</p>
              </div>
            )}
            {consultant.cfs_certification_date && (
              <div>
                <p className="font-medium text-muted-foreground">CFS Certification Date</p>
                <p>{new Date(consultant.cfs_certification_date).toLocaleDateString()}</p>
              </div>
            )}
            {consultant.effective_date && (
              <div>
                <p className="font-medium text-muted-foreground">Effective Date</p>
                <p>{new Date(consultant.effective_date).toLocaleDateString()}</p>
              </div>
            )}
            {consultant.pay_type && (
              <div>
                <p className="font-medium text-muted-foreground">Pay Type</p>
                <p>{consultant.pay_type}</p>
              </div>
            )}
            {consultant.mp_fee && (
              <div>
                <p className="font-medium text-muted-foreground">MP Fee</p>
                <p>${consultant.mp_fee}</p>
              </div>
            )}
            {consultant.status_date && (
              <div>
                <p className="font-medium text-muted-foreground">Status Date</p>
                <p>{new Date(consultant.status_date).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
