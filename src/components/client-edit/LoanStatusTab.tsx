
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";

interface LoanStatusTabProps {
  client: Tables<"clients">;
}

export function LoanStatusTab({ client }: LoanStatusTabProps) {
  return (
    <div className="space-y-6">
      {/* Loan Status Information */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Loan Status Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Lender ID</label>
              <Input placeholder="Lender ID" />
            </div>
            <div>
              <label className="text-sm font-medium">Loan Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="application">Application</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="underwriting">Underwriting</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Modified By</label>
              <Input placeholder="Modified by" />
            </div>
            <div>
              <label className="text-sm font-medium">Modified Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Date In</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Time In</label>
              <Input type="time" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees */}
      <Card>
        <CardHeader className="bg-gray-600 text-white">
          <CardTitle>Fees</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Courier Fee</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Admin Fee</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Support Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Sales/Support</label>
              <Input placeholder="Sales/Support" />
            </div>
            <div>
              <label className="text-sm font-medium">SS/Auditor</label>
              <Input placeholder="SS/Auditor" />
            </div>
            <div>
              <label className="text-sm font-medium">Contract/PF</label>
              <Input placeholder="Contract/PF" />
            </div>
            <div>
              <label className="text-sm font-medium">Contract/CC</label>
              <Input placeholder="Contract/CC" />
            </div>
            <div>
              <label className="text-sm font-medium">Field/Trainer</label>
              <Input placeholder="Field/Trainer" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appraisal Information */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Appraisal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Appraisal Ordered</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Appraisal Received</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Appraisal Company</label>
              <Input placeholder="Company name" />
            </div>
            <div>
              <label className="text-sm font-medium">Appraisal Invoice</label>
              <Input placeholder="Invoice number" />
            </div>
            <div>
              <label className="text-sm font-medium">App Amt</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Appraisal Paid</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Courier Fee</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Admin Fee</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Tracking */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Documentation Tracking</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">CLW Sent</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">CLW Rec</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">PA Sent</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">PA Rec'd</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">VOM Contact</label>
              <Input placeholder="Contact name" />
            </div>
            <div>
              <label className="text-sm font-medium">VOM Phone</label>
              <Input placeholder="Phone number" />
            </div>
            <div>
              <label className="text-sm font-medium">VOM Sent</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">VOM Rec</label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Title Information */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Title Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Title Ordered</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Title Rec'd</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Title Co Name</label>
              <Input placeholder="Title company" />
            </div>
            <div>
              <label className="text-sm font-medium">Title Binder</label>
              <Input placeholder="Binder number" />
            </div>
            <div>
              <label className="text-sm font-medium">Title PLD</label>
              <Input placeholder="PLD number" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Assignments */}
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Staff Assignments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Sales Support</label>
              <Input placeholder="Staff name" />
            </div>
            <div>
              <label className="text-sm font-medium">SS Auditor</label>
              <Input placeholder="Auditor name" />
            </div>
            <div>
              <label className="text-sm font-medium">Contract PF</label>
              <Input placeholder="PF name" />
            </div>
            <div>
              <label className="text-sm font-medium">Contract CC</label>
              <Input placeholder="CC name" />
            </div>
            <div>
              <label className="text-sm font-medium">Field Trainer</label>
              <Input placeholder="Trainer name" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Information */}
      <Card>
        <CardHeader className="bg-indigo-600 text-white">
          <CardTitle>Verification Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">VOE Sent</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">VOE Rec</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">VOE Contact</label>
              <Input placeholder="Contact name" />
            </div>
            <div>
              <label className="text-sm font-medium">VOE Phone</label>
              <Input placeholder="Phone number" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Processing */}
      <Card>
        <CardHeader className="bg-red-600 text-white">
          <CardTitle>Final Processing</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Final Sent</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Final Rec'd</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Cleared Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Closed Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Funded Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium">Funded Amt</label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <label className="text-sm font-medium">Disburse Date</label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
