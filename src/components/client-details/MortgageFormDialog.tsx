
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { useCreateMortgage, useUpdateMortgage } from "@/hooks/clients/useMortgages";
import { MortgageFormValues } from "@/hooks/clients/mortgageTypes";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

interface MortgageFormDialogProps {
  client: Tables<"clients">;
  mortgage?: any;
  isOpen: boolean;
  onClose: () => void;
}

export function MortgageFormDialog({ client, mortgage, isOpen, onClose }: MortgageFormDialogProps) {
  const createMutation = useCreateMortgage();
  const updateMutation = useUpdateMortgage();
  
  const [formData, setFormData] = useState<MortgageFormValues>({
    client_id: client.id,
    property_address: "",
    property_city: "",
    property_state: "",
    zip_code: "",
    applicant_id_ref: "1",
    floan_id: "1",
    consult_id: "1",
    processor_id: "1",
    lender_name: "",
    mortgage_type: "",
    original_loan_amount_field: 0,
    current_balance: 0,
    monthly_payment_field: 0,
    interest_rate_field: 0,
    occupancy_type: "",
    first_mortgage_balance: 0,
    first_mortgage_rate: 0,
    first_mortgage_term: "",
    first_mortgage_payment: 0,
    first_mortgage_lienholder: "",
    second_mortgage_balance: 0,
    second_mortgage_rate: 0,
    second_mortgage_term: "",
    second_mortgage_payment: 0,
    second_mortgage_lienholder: "",
    existing_balance: 0,
    property_taxes: 0,
    taxes_included_in_payment_select: "",
    homeowner_insurance: 0,
    homeowner_insurance_included_select: "",
    proposed_first_loan_amount: 0,
    proposed_first_rate: 0,
    proposed_first_term: "3",
    proposed_first_int_term: "1",
    proposed_first_payment: 0,
    proposed_second_loan_amount: 0,
    proposed_second_rate: 0,
    proposed_second_term: "",
    proposed_second_int_term: "",
    proposed_second_payment: 0,
    market_value: 0,
    cash_to_borrower: 0,
    loan_volume: 0,
    appraisal_fee: 0,
    estimated_fees_percent: 0,
    estimated_fees_amount: 0,
    ltv_percent: 0,
    origination_percent: 0,
    origination_amount: 0,
    spr_percent: 0,
    spr_amount: 0,
    arm_5_1_rate_field: 0,
    arm_5_1_payment_field: 0,
    arm_7_1_rate_field: 0,
    arm_7_1_payment_field: 0,
    arm_10_1_rate_field: 0,
    arm_10_1_payment_field: 0,
    fixed_15_rate_field: 0,
    fixed_15_payment_field: 0,
    fixed_30_rate_field: 0,
    fixed_30_payment_field: 0,
    closing_cost_field: 0,
    dti_percent_field: 0,
  });

  useEffect(() => {
    if (mortgage) {
      setFormData({ ...mortgage });
    } else {
      setFormData(prev => ({ ...prev, client_id: client.id }));
    }
  }, [mortgage, client.id]);

  // Mathematical calculation functions
  const calculateMonthlyPayment = (principal: number, rate: number, term: number) => {
    if (!principal || !rate || !term) return 0;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const calculateLTV = (loanAmount: number, propertyValue: number) => {
    if (!propertyValue) return 0;
    return (loanAmount / propertyValue) * 100;
  };

  const updateField = (field: keyof MortgageFormValues, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate dependent fields
      if (field === 'proposed_first_loan_amount' || field === 'proposed_first_rate' || field === 'proposed_first_term') {
        const loanAmount = field === 'proposed_first_loan_amount' ? value : updated.proposed_first_loan_amount || 0;
        const rate = field === 'proposed_first_rate' ? value : updated.proposed_first_rate || 0;
        const term = field === 'proposed_first_term' ? parseInt(value) : parseInt(updated.proposed_first_term || "0");
        
        updated.proposed_first_payment = calculateMonthlyPayment(loanAmount, rate, term);
      }

      // Calculate LTV when loan amount or market value changes
      if (field === 'proposed_first_loan_amount' || field === 'market_value') {
        const loanAmount = field === 'proposed_first_loan_amount' ? value : updated.proposed_first_loan_amount || 0;
        const marketValue = field === 'market_value' ? value : updated.market_value || 0;
        updated.ltv_percent = calculateLTV(loanAmount, marketValue);
      }

      // Calculate loan volume (total of first and second loans)
      if (field === 'proposed_first_loan_amount' || field === 'proposed_second_loan_amount') {
        const first = field === 'proposed_first_loan_amount' ? value : updated.proposed_first_loan_amount || 0;
        const second = field === 'proposed_second_loan_amount' ? value : updated.proposed_second_loan_amount || 0;
        updated.loan_volume = first + second;
      }

      // Calculate cash to borrower
      if (field === 'loan_volume' || field === 'existing_balance') {
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        const existingBalance = field === 'existing_balance' ? value : updated.existing_balance || 0;
        updated.cash_to_borrower = loanVolume - existingBalance;
      }

      // Calculate estimated fees amount
      if (field === 'estimated_fees_percent' || field === 'loan_volume') {
        const percent = field === 'estimated_fees_percent' ? value : updated.estimated_fees_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.estimated_fees_amount = (loanVolume * percent) / 100;
      }

      // Calculate origination amount
      if (field === 'origination_percent' || field === 'loan_volume') {
        const percent = field === 'origination_percent' ? value : updated.origination_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.origination_amount = (loanVolume * percent) / 100;
      }

      // Calculate SPR amount
      if (field === 'spr_percent' || field === 'loan_volume') {
        const percent = field === 'spr_percent' ? value : updated.spr_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.spr_amount = (loanVolume * percent) / 100;
      }

      // Auto-calculate ARM and Fixed rate payments
      const loanAmount = updated.proposed_first_loan_amount || 0;
      
      if (field.includes('arm_') && field.includes('_rate_field')) {
        const rate = value;
        if (field === 'arm_5_1_rate_field') {
          updated.arm_5_1_payment_field = calculateMonthlyPayment(loanAmount, rate, 30);
        } else if (field === 'arm_7_1_rate_field') {
          updated.arm_7_1_payment_field = calculateMonthlyPayment(loanAmount, rate, 30);
        } else if (field === 'arm_10_1_rate_field') {
          updated.arm_10_1_payment_field = calculateMonthlyPayment(loanAmount, rate, 30);
        }
      }

      if (field === 'fixed_15_rate_field') {
        updated.fixed_15_payment_field = calculateMonthlyPayment(loanAmount, value, 15);
      } else if (field === 'fixed_30_rate_field') {
        updated.fixed_30_payment_field = calculateMonthlyPayment(loanAmount, value, 30);
      }

      return updated;
    });
  };

  const handleSave = async () => {
    try {
      if (mortgage?.id) {
        await updateMutation.mutateAsync(formData);
        toast.success("Mortgage updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Mortgage created successfully");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save mortgage");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="bg-gray-600 text-white px-4 py-2 rounded">
            📝 Mortgage Form - Edit Selected
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Existing Mortgages */}
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

            {/* Right Column - Proposed Loan Section */}
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
          </div>

          {/* Loan Options Section */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Save className="w-4 h-4 mr-2" />
              💾 Save Mortgage & Loan Options
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              ✖ Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
