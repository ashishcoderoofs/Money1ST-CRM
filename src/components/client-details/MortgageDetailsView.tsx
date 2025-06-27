import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ArrowLeft } from "lucide-react";
import { Mortgage } from "@/hooks/clients/mortgageTypes";

interface MortgageDetailsViewProps {
  mortgage: Mortgage;
  onEdit: () => void;
  onBack: () => void;
}

export function MortgageDetailsView({ mortgage, onEdit, onBack }: MortgageDetailsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mortgage Details</h3>
        <div className="flex gap-2">
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
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
              <label className="text-sm font-medium text-gray-600">Property Address</label>
              <p className="text-sm">{mortgage.property_address || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-sm">{mortgage.property_city || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">State</label>
              <p className="text-sm">{mortgage.property_state || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Zip Code</label>
              <p className="text-sm">{mortgage.zip_code || "N/A"}</p>
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
              <label className="text-sm font-medium text-gray-600">Original Amount</label>
              <p className="text-sm">${mortgage.original_loan_amount_field?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Current Balance</label>
              <p className="text-sm">${mortgage.current_balance?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Payment</label>
              <p className="text-sm">${mortgage.monthly_payment_field?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Interest Rate</label>
              <p className="text-sm">{mortgage.interest_rate_field || "0"}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Mortgage Type</label>
              <p className="text-sm">{mortgage.mortgage_type || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Occupancy Type</label>
              <p className="text-sm">{mortgage.occupancy_type || "N/A"}</p>
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
              <label className="text-sm font-medium text-gray-600">Balance</label>
              <p className="text-sm">${mortgage.first_mortgage_balance?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rate</label>
              <p className="text-sm">{mortgage.first_mortgage_rate || "0"}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <p className="text-sm">{mortgage.first_mortgage_term || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment</label>
              <p className="text-sm">${mortgage.first_mortgage_payment?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Lienholder</label>
              <p className="text-sm">{mortgage.first_mortgage_lienholder || "N/A"}</p>
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
              <label className="text-sm font-medium text-gray-600">Loan Amount</label>
              <p className="text-sm">${mortgage.proposed_first_loan_amount?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Rate</label>
              <p className="text-sm">{mortgage.proposed_first_rate || "0"}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Term</label>
              <p className="text-sm">{mortgage.proposed_first_term || "N/A"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Payment</label>
              <p className="text-sm">${mortgage.proposed_first_payment?.toLocaleString() || "0"}</p>
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
              <label className="text-sm font-medium text-gray-600">Market Value</label>
              <p className="text-sm">${mortgage.market_value?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Cash to Borrower</label>
              <p className="text-sm">${mortgage.cash_to_borrower?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Loan Volume</label>
              <p className="text-sm">${mortgage.loan_volume?.toLocaleString() || "0"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">LTV %</label>
              <p className="text-sm">{mortgage.ltv_percent || "0"}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
