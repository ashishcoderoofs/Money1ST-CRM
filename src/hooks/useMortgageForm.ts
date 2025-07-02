import { useState, useEffect } from "react";
import { MortgageFormValues } from "@/hooks/clients/mortgageTypes";
import { calculateMonthlyPayment, calculateLTV, calculatePercentageAmount, calculateLoanVolume, calculateCashToBorrower } from "@/utils/mortgageCalculations";

export function useMortgageForm(client: any, mortgage?: any) {
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
        updated.loan_volume = calculateLoanVolume(first, second);
      }

      // Calculate cash to borrower
      if (field === 'loan_volume' || field === 'existing_balance') {
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        const existingBalance = field === 'existing_balance' ? value : updated.existing_balance || 0;
        updated.cash_to_borrower = calculateCashToBorrower(loanVolume, existingBalance);
      }

      // Calculate estimated fees amount
      if (field === 'estimated_fees_percent' || field === 'loan_volume') {
        const percent = field === 'estimated_fees_percent' ? value : updated.estimated_fees_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.estimated_fees_amount = calculatePercentageAmount(loanVolume, percent);
      }

      // Calculate origination amount
      if (field === 'origination_percent' || field === 'loan_volume') {
        const percent = field === 'origination_percent' ? value : updated.origination_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.origination_amount = calculatePercentageAmount(loanVolume, percent);
      }

      // Calculate SPR amount
      if (field === 'spr_percent' || field === 'loan_volume') {
        const percent = field === 'spr_percent' ? value : updated.spr_percent || 0;
        const loanVolume = field === 'loan_volume' ? value : updated.loan_volume || 0;
        updated.spr_amount = calculatePercentageAmount(loanVolume, percent);
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

  return {
    formData,
    updateField,
  };
}
