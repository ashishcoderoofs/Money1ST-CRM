import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MortgageFormFieldProps } from "./types";

export function MortgageLoanOptionsSection({ formData, updateField }: MortgageFormFieldProps) {
  return (
    <Card>
      <CardHeader className="bg-yellow-600 text-white">
        <CardTitle>💰 Loan Options Section</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-4">ARM Options</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">ARM 5/1 Rate</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.arm_5_1_rate_field || ""}
                      onChange={(e) => updateField("arm_5_1_rate_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm">ARM 5/1 Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.arm_5_1_payment_field?.toFixed(2) || ""}
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">ARM 7/1 Rate</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.arm_7_1_rate_field || ""}
                      onChange={(e) => updateField("arm_7_1_rate_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm">ARM 7/1 Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.arm_7_1_payment_field?.toFixed(2) || ""}
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">ARM 10/1 Rate</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.arm_10_1_rate_field || ""}
                      onChange={(e) => updateField("arm_10_1_rate_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm">ARM 10/1 Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.arm_10_1_payment_field?.toFixed(2) || ""}
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-4">Fixed Rate Options</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">FIXED 15 Rate</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.fixed_15_rate_field || ""}
                      onChange={(e) => updateField("fixed_15_rate_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm">FIXED 15 Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.fixed_15_payment_field?.toFixed(2) || ""}
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">FIXED 30 Rate</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.001"
                      value={formData.fixed_30_rate_field || ""}
                      onChange={(e) => updateField("fixed_30_rate_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm">FIXED 30 Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.fixed_30_payment_field?.toFixed(2) || ""}
                    className="bg-gray-100"
                    readOnly
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">ClosingCost</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.closing_cost_field || ""}
                    onChange={(e) => updateField("closing_cost_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm">DTI</label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.dti_percent_field || ""}
                      onChange={(e) => updateField("dti_percent_field", parseFloat(e.target.value) || 0)}
                    />
                    <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
