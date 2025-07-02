import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MortgageFormFieldProps } from "./types";

export function MortgageBasicInfoSection({ formData, updateField }: MortgageFormFieldProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium">MortgageID</label>
            <Input
              value={formData.mortgage_id || "1"}
              className="bg-gray-100"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.property_address || ""}
              onChange={(e) => updateField("property_address", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.property_city || ""}
              onChange={(e) => updateField("property_city", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.property_state || ""}
              onChange={(e) => updateField("property_state", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">ZIP Code</label>
            <Input
              value={formData.zip_code || ""}
              onChange={(e) => updateField("zip_code", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium">ClientID</label>
            <Input value="1" className="bg-gray-100" readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">ApplicantID</label>
            <Input
              value={formData.applicant_id_ref || "1"}
              onChange={(e) => updateField("applicant_id_ref", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">FLoanID</label>
            <Input
              value={formData.floan_id || "1"}
              onChange={(e) => updateField("floan_id", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">ConsultID</label>
            <Input
              value={formData.consult_id || "1"}
              onChange={(e) => updateField("consult_id", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">ProcessorID</label>
            <Input
              value={formData.processor_id || "1"}
              onChange={(e) => updateField("processor_id", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
