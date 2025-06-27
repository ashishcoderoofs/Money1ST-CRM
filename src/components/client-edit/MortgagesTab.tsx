import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/integrations/supabase/types";
import { useMortgagesByClient, useCreateMortgage, useUpdateMortgage, useDeleteMortgage } from "@/hooks/clients/useMortgages";
import { MortgageFormValues } from "@/hooks/clients/mortgageTypes";
import { toast } from "sonner";
import { Plus, Trash2, Wand2, X } from "lucide-react";

interface MortgagesTabProps {
  client: Tables<"clients">;
}

export function MortgagesTab({ client }: MortgagesTabProps) {
  const { data: mortgages, isLoading } = useMortgagesByClient(client.id);
  const createMutation = useCreateMortgage();
  const updateMutation = useUpdateMortgage();
  const deleteMutation = useDeleteMortgage();
  
  const [editingMortgage, setEditingMortgage] = useState<MortgageFormValues | null>(null);
  const [showForm, setShowForm] = useState(false);

  const defaultMortgage: MortgageFormValues = {
    client_id: client.id,
    property_address: "",
    property_city: "",
    property_state: "",
    property_zip: "",
    zip_code: "",
    applicant_id_ref: "",
    floan_id: "",
    consult_id: "",
    processor_id: "",
    lender_id: "",
    lender_name: "",
    mortgage_type: "",
    original_loan_amount: 0,
    current_balance: 0,
    monthly_payment: 0,
    interest_rate: 0,
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
    taxes_included_in_payment: "",
    taxes_included_in_payment_select: "",
    homeowner_insurance: 0,
    insurance_included_in_payment: "",
    homeowner_insurance_included_select: "",
    purpose_of_loan: "",
    proposed_first_loan_amount: 0,
    proposed_first_rate: 0,
    proposed_first_term: "",
    proposed_first_int_term: "",
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
    ltv_secondary: 0,
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
    original_loan_amount_field: 0,
    monthly_payment_field: 0,
    interest_rate_field: 0,
  };

  const dummyMortgage: MortgageFormValues = {
    client_id: client.id,
    property_address: "123 Main Street",
    property_city: "Springfield",
    property_state: "CA",
    property_zip: "90210",
    zip_code: "90210",
    applicant_id_ref: "APP001",
    floan_id: "FL001",
    consult_id: "CON001",
    processor_id: "PROC001",
    lender_id: "LEND001",
    lender_name: "First National Bank",
    mortgage_type: "conventional",
    original_loan_amount: 400000,
    current_balance: 350000,
    monthly_payment: 2800,
    interest_rate: 4.5,
    occupancy_type: "primary",
    first_mortgage_balance: 350000,
    first_mortgage_rate: 4.5,
    first_mortgage_term: "30 years",
    first_mortgage_payment: 2800,
    first_mortgage_lienholder: "First National Bank",
    second_mortgage_balance: 0,
    second_mortgage_rate: 0,
    second_mortgage_term: "",
    second_mortgage_payment: 0,
    second_mortgage_lienholder: "",
    existing_balance: 350000,
    property_taxes: 8500,
    taxes_included_in_payment: "No",
    taxes_included_in_payment_select: "no",
    homeowner_insurance: 2400,
    insurance_included_in_payment: "No",
    homeowner_insurance_included_select: "no",
    purpose_of_loan: "refinance",
    proposed_first_loan_amount: 300000,
    proposed_first_rate: 3.8,
    proposed_first_term: "30 years",
    proposed_first_int_term: "30",
    proposed_first_payment: 2400,
    proposed_second_loan_amount: 0,
    proposed_second_rate: 0,
    proposed_second_term: "",
    proposed_second_int_term: "",
    proposed_second_payment: 0,
    market_value: 500000,
    cash_to_borrower: 50000,
    loan_volume: 300000,
    appraisal_fee: 500,
    estimated_fees_percent: 2.5,
    estimated_fees_amount: 7500,
    ltv_percent: 60,
    ltv_secondary: 0,
    origination_percent: 1,
    origination_amount: 3000,
    spr_percent: 0.5,
    spr_amount: 1500,
    arm_5_1_rate_field: 3.2,
    arm_5_1_payment_field: 2150,
    arm_7_1_rate_field: 3.4,
    arm_7_1_payment_field: 2200,
    arm_10_1_rate_field: 3.6,
    arm_10_1_payment_field: 2250,
    fixed_15_rate_field: 3.5,
    fixed_15_payment_field: 2850,
    fixed_30_rate_field: 3.8,
    fixed_30_payment_field: 2400,
    closing_cost_field: 7500,
    dti_percent_field: 28,
    original_loan_amount_field: 400000,
    monthly_payment_field: 2800,
    interest_rate_field: 4.5,
  };

  const handleSave = async (mortgage: MortgageFormValues) => {
    try {
      if (mortgage.id) {
        await updateMutation.mutateAsync(mortgage);
        toast.success("Mortgage updated successfully");
      } else {
        await createMutation.mutateAsync(mortgage);
        toast.success("Mortgage created successfully");
      }
      setEditingMortgage(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving mortgage:", error);
      toast.error("Failed to save mortgage");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this mortgage?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Mortgage deleted successfully");
      } catch (error) {
        toast.error("Failed to delete mortgage");
      }
    }
  };

  const startEdit = (mortgage: any) => {
    setEditingMortgage(mortgage);
    setShowForm(true);
  };

  const startNew = () => {
    setEditingMortgage(defaultMortgage);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMortgage(null);
  };

  if (isLoading) {
    return <div>Loading mortgages...</div>;
  }

  if (showForm) {
    return (
      <MortgageForm
        mortgage={editingMortgage!}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={updateMutation.isPending || createMutation.isPending}
        dummyData={dummyMortgage}
        defaultData={defaultMortgage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mortgages</h3>
        <Button onClick={startNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Mortgage
        </Button>
      </div>

      {mortgages && mortgages.length > 0 ? (
        <div className="space-y-4">
          {mortgages.map((mortgage) => (
            <Card key={mortgage.id}>
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-sm">
                  Mortgage #{mortgage.mortgage_id} - {mortgage.property_address || "No Address"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Original Amount:</span>
                    <p>${mortgage.original_loan_amount?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Current Balance:</span>
                    <p>${mortgage.current_balance?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Monthly Payment:</span>
                    <p>${mortgage.monthly_payment?.toLocaleString() || "0"}</p>
                  </div>
                  <div>
                    <span className="font-medium">Interest Rate:</span>
                    <p>{mortgage.interest_rate || "0"}%</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => startEdit(mortgage)}>
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(mortgage.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No mortgages found. Click "Add Mortgage" to create one.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MortgageFormProps {
  mortgage: MortgageFormValues;
  onSave: (mortgage: MortgageFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  dummyData: MortgageFormValues;
  defaultData: MortgageFormValues;
}

function MortgageForm({ mortgage: initialMortgage, onSave, onCancel, isLoading, dummyData, defaultData }: MortgageFormProps) {
  const [mortgage, setMortgage] = useState<MortgageFormValues>(initialMortgage);

  // Check if data is filled (not default/empty)
  const isDataFilled = () => {
    return mortgage.property_address !== "" || 
           mortgage.original_loan_amount_field > 0 || 
           mortgage.monthly_payment_field > 0 ||
           mortgage.lender_name !== "";
  };

  const updateField = (field: keyof MortgageFormValues, value: any) => {
    setMortgage(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate dependent fields
      if (['proposed_first_loan_amount', 'proposed_first_rate', 'proposed_first_term'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.proposed_first_rate || 0) / 100 / 12;
        const termYears = parseInt(updated.proposed_first_term || '30');
        const termMonths = termYears * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.proposed_first_payment = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      // Calculate LTV
      if (['proposed_first_loan_amount', 'market_value'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const marketValue = updated.market_value || 0;
        if (marketValue > 0) {
          updated.ltv_percent = Math.round((loanAmount / marketValue) * 100 * 100) / 100;
        }
      }
      
      // Calculate loan volume
      if (['proposed_first_loan_amount', 'proposed_second_loan_amount'].includes(field)) {
        updated.loan_volume = (updated.proposed_first_loan_amount || 0) + (updated.proposed_second_loan_amount || 0);
      }
      
      // Calculate cash to borrower
      if (['loan_volume', 'current_balance', 'estimated_fees_amount'].includes(field)) {
        const loanVolume = updated.loan_volume || 0;
        const currentBalance = updated.current_balance || 0;
        const fees = updated.estimated_fees_amount || 0;
        updated.cash_to_borrower = loanVolume - currentBalance - fees;
      }
      
      // Calculate estimated fees amount from percentage
      if (['estimated_fees_percent', 'loan_volume'].includes(field)) {
        const percent = updated.estimated_fees_percent || 0;
        const loanVolume = updated.loan_volume || 0;
        updated.estimated_fees_amount = Math.round((loanVolume * percent / 100) * 100) / 100;
      }
      
      // Calculate ARM payments
      if (['proposed_first_loan_amount', 'arm_5_1_rate_field'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.arm_5_1_rate_field || 0) / 100 / 12;
        const termMonths = 30 * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.arm_5_1_payment_field = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      // Similar calculations for other ARM rates
      if (['proposed_first_loan_amount', 'arm_7_1_rate_field'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.arm_7_1_rate_field || 0) / 100 / 12;
        const termMonths = 30 * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.arm_7_1_payment_field = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      if (['proposed_first_loan_amount', 'arm_10_1_rate_field'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.arm_10_1_rate_field || 0) / 100 / 12;
        const termMonths = 30 * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.arm_10_1_payment_field = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      // Calculate Fixed rate payments
      if (['proposed_first_loan_amount', 'fixed_15_rate_field'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.fixed_15_rate_field || 0) / 100 / 12;
        const termMonths = 15 * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.fixed_15_payment_field = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      if (['proposed_first_loan_amount', 'fixed_30_rate_field'].includes(field)) {
        const loanAmount = updated.proposed_first_loan_amount || 0;
        const rate = (updated.fixed_30_rate_field || 0) / 100 / 12;
        const termMonths = 30 * 12;
        
        if (rate > 0 && termMonths > 0) {
          const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, termMonths)) / (Math.pow(1 + rate, termMonths) - 1);
          updated.fixed_30_payment_field = Math.round(monthlyPayment * 100) / 100;
        }
      }
      
      return updated;
    });
  };

  const handleFillDummy = () => {
    setMortgage(dummyData);
  };

  const handleClearAll = () => {
    setMortgage(defaultData);
  };

  const handleSave = () => {
    onSave(mortgage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {mortgage.id ? "Edit Mortgage" : "New Mortgage"}
        </h3>
        <div className="flex gap-2">
          {!isDataFilled() && (
            <Button onClick={handleFillDummy} variant="outline" className="bg-purple-100 hover:bg-purple-200">
              <Wand2 className="w-4 h-4 mr-2" />
              Fill Dummy
            </Button>
          )}
          <Button onClick={handleClearAll} variant="outline" className="bg-gray-100 hover:bg-gray-200">
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Property Information */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Applicant ID Ref</label>
              <Input
                value={mortgage.applicant_id_ref || ""}
                onChange={(e) => updateField("applicant_id_ref", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">F. Loan ID</label>
              <Input
                value={mortgage.floan_id || ""}
                onChange={(e) => updateField("floan_id", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Consult ID</label>
              <Input
                value={mortgage.consult_id || ""}
                onChange={(e) => updateField("consult_id", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Processor ID</label>
              <Input
                value={mortgage.processor_id || ""}
                onChange={(e) => updateField("processor_id", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lender ID</label>
              <Input
                value={mortgage.lender_id || ""}
                onChange={(e) => updateField("lender_id", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lender Name</label>
              <Input
                value={mortgage.lender_name || ""}
                onChange={(e) => updateField("lender_name", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Property Address</label>
              <Input
                value={mortgage.property_address || ""}
                onChange={(e) => updateField("property_address", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input
                value={mortgage.property_city || ""}
                onChange={(e) => updateField("property_city", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input
                value={mortgage.property_state || ""}
                onChange={(e) => updateField("property_state", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Zip Code</label>
              <Input
                value={mortgage.zip_code || ""}
                onChange={(e) => updateField("zip_code", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Mortgage Information */}
      <Card>
        <CardHeader className="bg-red-600 text-white">
          <CardTitle>Existing Mortgage Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Mortgage Type</label>
              <Select value={mortgage.mortgage_type || ""} onValueChange={(value) => updateField("mortgage_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conventional">Conventional</SelectItem>
                  <SelectItem value="fha">FHA</SelectItem>
                  <SelectItem value="va">VA</SelectItem>
                  <SelectItem value="usda">USDA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Original Loan Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.original_loan_amount_field || ""}
                onChange={(e) => updateField("original_loan_amount_field", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Current Balance</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.current_balance || ""}
                onChange={(e) => updateField("current_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Monthly Payment</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.monthly_payment_field || ""}
                onChange={(e) => updateField("monthly_payment_field", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Interest Rate (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.interest_rate_field || ""}
                onChange={(e) => updateField("interest_rate_field", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Occupancy Type</label>
              <Select value={mortgage.occupancy_type || ""} onValueChange={(value) => updateField("occupancy_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select occupancy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary Residence</SelectItem>
                  <SelectItem value="secondary">Secondary Home</SelectItem>
                  <SelectItem value="investment">Investment Property</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* First Mortgage Details */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>First Mortgage Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Balance</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.first_mortgage_balance || ""}
                onChange={(e) => updateField("first_mortgage_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rate (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.first_mortgage_rate || ""}
                onChange={(e) => updateField("first_mortgage_rate", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Term</label>
              <Input
                value={mortgage.first_mortgage_term || ""}
                onChange={(e) => updateField("first_mortgage_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.first_mortgage_payment || ""}
                onChange={(e) => updateField("first_mortgage_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lienholder</label>
              <Input
                value={mortgage.first_mortgage_lienholder || ""}
                onChange={(e) => updateField("first_mortgage_lienholder", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Second Mortgage Details */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Second Mortgage Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Balance</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.second_mortgage_balance || ""}
                onChange={(e) => updateField("second_mortgage_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rate (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.second_mortgage_rate || ""}
                onChange={(e) => updateField("second_mortgage_rate", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Term</label>
              <Input
                value={mortgage.second_mortgage_term || ""}
                onChange={(e) => updateField("second_mortgage_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.second_mortgage_payment || ""}
                onChange={(e) => updateField("second_mortgage_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Lienholder</label>
              <Input
                value={mortgage.second_mortgage_lienholder || ""}
                onChange={(e) => updateField("second_mortgage_lienholder", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/*Property Details */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Existing Balance</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.existing_balance || ""}
                onChange={(e) => updateField("existing_balance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Property Taxes</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.property_taxes || ""}
                onChange={(e) => updateField("property_taxes", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Taxes Included</label>
              <Select value={mortgage.taxes_included_in_payment_select || ""} onValueChange={(value) => updateField("taxes_included_in_payment_select", value)}>
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
              <label className="text-sm font-medium">Homeowner Insurance</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.homeowner_insurance || ""}
                onChange={(e) => updateField("homeowner_insurance", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Insurance Included</label>
              <Select value={mortgage.homeowner_insurance_included_select || ""} onValueChange={(value) => updateField("homeowner_insurance_included_select", value)}>
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
              <label className="text-sm font-medium">Purpose of Loan</label>
              <Select value={mortgage.purpose_of_loan || ""} onValueChange={(value) => updateField("purpose_of_loan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="cash_out">Cash Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposed First Loan */}
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Proposed First Loan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Loan Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.proposed_first_loan_amount || ""}
                onChange={(e) => updateField("proposed_first_loan_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rate (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.proposed_first_rate || ""}
                onChange={(e) => updateField("proposed_first_rate", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Term</label>
              <Input
                value={mortgage.proposed_first_term || ""}
                onChange={(e) => updateField("proposed_first_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Int. Term</label>
              <Input
                value={mortgage.proposed_first_int_term || ""}
                onChange={(e) => updateField("proposed_first_int_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.proposed_first_payment || ""}
                onChange={(e) => updateField("proposed_first_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposed Second Loan */}
      <Card>
        <CardHeader className="bg-indigo-600 text-white">
          <CardTitle>Proposed Second Loan</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium">Loan Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.proposed_second_loan_amount || ""}
                onChange={(e) => updateField("proposed_second_loan_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rate (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.proposed_second_rate || ""}
                onChange={(e) => updateField("proposed_second_rate", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Term</label>
              <Input
                value={mortgage.proposed_second_term || ""}
                onChange={(e) => updateField("proposed_second_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Int. Term</label>
              <Input
                value={mortgage.proposed_second_int_term || ""}
                onChange={(e) => updateField("proposed_second_int_term", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Payment</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.proposed_second_payment || ""}
                onChange={(e) => updateField("proposed_second_payment", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary & Calculations */}
      <Card>
        <CardHeader className="bg-gray-600 text-white">
          <CardTitle>Summary & Calculations</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Market Value</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.market_value || ""}
                onChange={(e) => updateField("market_value", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cash to Borrower</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.cash_to_borrower || ""}
                onChange={(e) => updateField("cash_to_borrower", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Loan Volume</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.loan_volume || ""}
                onChange={(e) => updateField("loan_volume", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Appraisal Fee</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.appraisal_fee || ""}
                onChange={(e) => updateField("appraisal_fee", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Est. Fees %</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.estimated_fees_percent || ""}
                onChange={(e) => updateField("estimated_fees_percent", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Est. Fees Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.estimated_fees_amount || ""}
                onChange={(e) => updateField("estimated_fees_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">LTV %</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.ltv_percent || ""}
                onChange={(e) => updateField("ltv_percent", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">LTV Secondary</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.ltv_secondary || ""}
                onChange={(e) => updateField("ltv_secondary", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Origination %</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.origination_percent || ""}
                onChange={(e) => updateField("origination_percent", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Origination Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.origination_amount || ""}
                onChange={(e) => updateField("origination_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">SPR %</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.spr_percent || ""}
                onChange={(e) => updateField("spr_percent", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">SPR Amount</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.spr_amount || ""}
                onChange={(e) => updateField("spr_amount", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loan Options */}
      <Card>
        <CardHeader className="bg-yellow-600 text-white">
          <CardTitle>Loan Options</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm border-b pb-2">ARM Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">5/1 ARM Rate (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={mortgage.arm_5_1_rate_field || ""}
                    onChange={(e) => updateField("arm_5_1_rate_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">5/1 ARM Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mortgage.arm_5_1_payment_field || ""}
                    onChange={(e) => updateField("arm_5_1_payment_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">7/1 ARM Rate (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={mortgage.arm_7_1_rate_field || ""}
                    onChange={(e) => updateField("arm_7_1_rate_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">7/1 ARM Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mortgage.arm_7_1_payment_field || ""}
                    onChange={(e) => updateField("arm_7_1_payment_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">10/1 ARM Rate (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={mortgage.arm_10_1_rate_field || ""}
                    onChange={(e) => updateField("arm_10_1_rate_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">10/1 ARM Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mortgage.arm_10_1_payment_field || ""}
                    onChange={(e) => updateField("arm_10_1_payment_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-sm border-b pb-2">Fixed Rate Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">15 Year Rate (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={mortgage.fixed_15_rate_field || ""}
                    onChange={(e) => updateField("fixed_15_rate_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">15 Year Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mortgage.fixed_15_payment_field || ""}
                    onChange={(e) => updateField("fixed_15_payment_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">30 Year Rate (%)</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={mortgage.fixed_30_rate_field || ""}
                    onChange={(e) => updateField("fixed_30_rate_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">30 Year Payment</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={mortgage.fixed_30_payment_field || ""}
                    onChange={(e) => updateField("fixed_30_payment_field", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">Closing Cost</label>
              <Input
                type="number"
                step="0.01"
                value={mortgage.closing_cost_field || ""}
                onChange={(e) => updateField("closing_cost_field", parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">DTI Percent (%)</label>
              <Input
                type="number"
                step="0.001"
                value={mortgage.dti_percent_field || ""}
                onChange={(e) => updateField("dti_percent_field", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel Actions */}
      <div className="flex gap-3 justify-center py-6">
        <Button 
          onClick={handleSave} 
          disabled={isLoading} 
          className="bg-gray-800 hover:bg-gray-900 px-8"
        >
          {isLoading ? "Saving..." : mortgage.id ? "Update Mortgage" : "Save Mortgage"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="px-8"
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
