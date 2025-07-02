import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MortgageFormFieldProps } from "./types";

export function MortgageExistingSection({ formData, updateField }: MortgageFormFieldProps) {
  return (
    <Card>
      <CardHeader className="bg-cyan-400 text-white">
        <CardTitle className="flex items-center">
          🏠 Existing Mortgages
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Occupancy Type</label>
          <Select value={formData.occupancy_type || ""} onValueChange={(value) => updateField("occupancy_type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="OO (Owner Occupied)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OO">OO (Owner Occupied)</SelectItem>
              <SelectItem value="secondary">Secondary Home</SelectItem>
              <SelectItem value="investment">Investment Property</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">1st Mortgage</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Balance</label>
              <Input
                type="number"
                step="0.01"
                value={formData.first_mortgage_balance || ""}
                onChange={(e) => updateField("first_mortgage_balance", parseFloat(e.target.value) || 0)}
                placeholder="$1212.00"
              />
            </div>
            <div>
              <label className="text-sm">Rate</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.001"
                  value={formData.first_mortgage_rate || ""}
                  onChange={(e) => updateField("first_mortgage_rate", parseFloat(e.target.value) || 0)}
                  placeholder="12.000"
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Term</label>
              <Input
                value={formData.first_mortgage_term || ""}
                onChange={(e) => updateField("first_mortgage_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={formData.first_mortgage_payment || ""}
                onChange={(e) => updateField("first_mortgage_payment", parseFloat(e.target.value) || 0)}
                placeholder="$12.00"
              />
            </div>
          </div>
          <div>
            <label className="text-sm">Lienholder1</label>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={3}
              value={formData.first_mortgage_lienholder || ""}
              onChange={(e) => updateField("first_mortgage_lienholder", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">2nd Mortgage</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Balance</label>
              <Input
                type="number"
                step="0.01"
                value={formData.second_mortgage_balance || ""}
                onChange={(e) => updateField("second_mortgage_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Rate</label>
              <div className="flex">
                <Input
                  type="number"
                  step="0.001"
                  value={formData.second_mortgage_rate || ""}
                  onChange={(e) => updateField("second_mortgage_rate", parseFloat(e.target.value) || 0)}
                />
                <span className="bg-gray-200 px-2 py-2 text-sm">%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Term</label>
              <Input
                value={formData.second_mortgage_term || ""}
                onChange={(e) => updateField("second_mortgage_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={formData.second_mortgage_payment || ""}
                onChange={(e) => updateField("second_mortgage_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm">Lienholder2</label>
            <textarea
              className="w-full p-2 border rounded resize-none"
              rows={3}
              value={formData.second_mortgage_lienholder || ""}
              onChange={(e) => updateField("second_mortgage_lienholder", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">General Existing Fields</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Existing Bal</label>
              <Input
                type="number"
                step="0.01"
                value={formData.existing_balance || ""}
                onChange={(e) => updateField("existing_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm">Property Taxes</label>
              <Input
                type="number"
                step="0.01"
                value={formData.property_taxes || ""}
                onChange={(e) => updateField("property_taxes", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Taxes included in payment?</label>
              <Select value={formData.taxes_included_in_payment_select || ""} onValueChange={(value) => updateField("taxes_included_in_payment_select", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Homeowner Ins</label>
              <Input
                type="number"
                step="0.01"
                value={formData.homeowner_insurance || ""}
                onChange={(e) => updateField("homeowner_insurance", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm">HM Ins included in payment?</label>
            <Select value={formData.homeowner_insurance_included_select || ""} onValueChange={(value) => updateField("homeowner_insurance_included_select", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
