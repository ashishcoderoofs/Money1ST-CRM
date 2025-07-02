import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MortgageFormFieldProps } from "./types";

export function MortgageProposedSection({ formData, updateField }: MortgageFormFieldProps) {
  return (
    <Card>
      <CardHeader className="bg-green-600 text-white">
        <CardTitle className="flex items-center">
          🏦 Proposed Loan Section
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Lender ID</label>
          <Input
            value={formData.lender_id || "1"}
            onChange={(e) => updateField("lender_id", e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Proposed 1st Loan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Loan Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.proposed_first_loan_amount || ""}
                onChange={(e) => updateField("proposed_first_loan_amount", parseFloat(e.target.value) || 0)}
                placeholder="$234243.00"
              />
            </div>
            <div>
              <label className="text-sm">Rate</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.001"
                  value={formData.proposed_first_rate || ""}
                  onChange={(e) => updateField("proposed_first_rate", parseFloat(e.target.value) || 0)}
                  placeholder="2.000"
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Term</label>
              <Input
                value={formData.proposed_first_term || ""}
                onChange={(e) => updateField("proposed_first_term", e.target.value)}
                placeholder="3"
              />
            </div>
            <div>
              <label className="text-sm">IntTerm</label>
              <Input
                value={formData.proposed_first_int_term || ""}
                onChange={(e) => updateField("proposed_first_int_term", e.target.value)}
                placeholder="1"
              />
            </div>
            <div>
              <label className="text-sm">New Payment</label>
              <Input
                type="number"
                step="0.01"
                value={formData.proposed_first_payment?.toFixed(2) || ""}
                className="bg-gray-100"
                readOnly
                placeholder="$6709.32"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Proposed 2nd Loan</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Loan Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.proposed_second_loan_amount || ""}
                onChange={(e) => updateField("proposed_second_loan_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Rate</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.001"
                  value={formData.proposed_second_rate || ""}
                  onChange={(e) => updateField("proposed_second_rate", parseFloat(e.target.value) || 0)}
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Term</label>
              <Input
                value={formData.proposed_second_term || ""}
                onChange={(e) => updateField("proposed_second_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">IntTerm</label>
              <Input
                value={formData.proposed_second_int_term || ""}
                onChange={(e) => updateField("proposed_second_int_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">New Payment</label>
              <Input
                type="number"
                step="0.01"
                value={formData.proposed_second_payment || ""}
                onChange={(e) => updateField("proposed_second_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Summary & Calculations</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Market Value</label>
              <Input
                type="number"
                step="0.01"
                value={formData.market_value || ""}
                onChange={(e) => updateField("market_value", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Cash to Borrower</label>
              <Input
                type="number"
                step="0.01"
                value={formData.cash_to_borrower?.toFixed(2) || ""}
                className="bg-gray-100"
                readOnly
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Loan Volume</label>
              <Input
                type="number"
                step="0.01"
                value={formData.loan_volume?.toFixed(2) || ""}
                className="bg-gray-100"
                readOnly
                placeholder="$234243.00"
              />
            </div>
            <div>
              <label className="text-sm">Appraisal/Report Fee</label>
              <Input
                type="number"
                step="0.01"
                value={formData.appraisal_fee || ""}
                onChange={(e) => updateField("appraisal_fee", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-sm">Est. Fees</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.estimated_fees_percent || ""}
                  onChange={(e) => updateField("estimated_fees_percent", parseFloat(e.target.value) || 0)}
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.estimated_fees_amount?.toFixed(2) || "0.00"}
                className="bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm">LTV</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.ltv_percent?.toFixed(2) || ""}
                  className="bg-gray-100"
                  readOnly
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm">Amount</label>
              <Input
                type="number"
                step="0.01"
                value=""
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-sm">Origination</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.origination_percent || ""}
                  onChange={(e) => updateField("origination_percent", parseFloat(e.target.value) || 0)}
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.origination_amount?.toFixed(2) || "0.00"}
                className="bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm">SPR</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.spr_percent || ""}
                  onChange={(e) => updateField("spr_percent", parseFloat(e.target.value) || 0)}
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-sm">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={formData.spr_amount?.toFixed(2) || "0.00"}
                className="bg-gray-100"
                readOnly
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
