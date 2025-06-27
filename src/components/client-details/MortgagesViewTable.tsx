
import { useMortgagesByClient } from "@/hooks/clients/useMortgages";
import { Tables } from "@/integrations/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
import { MortgageFormDialog } from "./MortgageFormDialog";
import { MortgageDetailsView } from "./MortgageDetailsView";

interface MortgagesViewTableProps {
  client: Tables<"clients">;
}

export function MortgagesViewTable({ client }: MortgagesViewTableProps) {
  const { data: mortgages, isLoading } = useMortgagesByClient(client.id);
  const [showForm, setShowForm] = useState(false);
  const [editingMortgage, setEditingMortgage] = useState<any>(null);
  const [selectedMortgage, setSelectedMortgage] = useState<any>(null);

  if (isLoading) {
    return <div className="p-4">Loading mortgages...</div>;
  }

  const handleEdit = (mortgage: any) => {
    setEditingMortgage(mortgage);
    setShowForm(true);
    setSelectedMortgage(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingMortgage(null);
  };

  const handleViewDetails = (mortgage: any) => {
    setSelectedMortgage(mortgage);
    setShowForm(false);
  };

  const handleBackToList = () => {
    setSelectedMortgage(null);
  };

  // Show detailed view if a mortgage is selected
  if (selectedMortgage) {
    return (
      <MortgageDetailsView
        mortgage={selectedMortgage}
        onEdit={() => handleEdit(selectedMortgage)}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header without Add Button in view mode */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mortgage List - Select for Details</h3>
      </div>

      {/* Mortgages Table */}
      {mortgages && mortgages.length > 0 ? (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">MortgageID</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">City</th>
                <th className="px-4 py-2 text-left">State</th>
                <th className="px-4 py-2 text-left">Original Amount</th>
                <th className="px-4 py-2 text-left">Current Balance</th>
                <th className="px-4 py-2 text-left">Monthly Payment</th>
              </tr>
            </thead>
            <tbody>
              {mortgages.map((mortgage, index) => (
                <tr 
                  key={mortgage.id} 
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 cursor-pointer`}
                  onClick={() => handleViewDetails(mortgage)}
                >
                  <td className="px-4 py-2">{mortgage.mortgage_id || "-"}</td>
                  <td className="px-4 py-2">{mortgage.property_address || "-"}</td>
                  <td className="px-4 py-2">{mortgage.property_city || "-"}</td>
                  <td className="px-4 py-2">{mortgage.property_state || "-"}</td>
                  <td className="px-4 py-2">${mortgage.original_loan_amount_field?.toLocaleString() || "0"}</td>
                  <td className="px-4 py-2">${mortgage.current_balance?.toLocaleString() || "0"}</td>
                  <td className="px-4 py-2">${mortgage.monthly_payment_field?.toLocaleString() || "0"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No mortgages found.</p>
          </CardContent>
        </Card>
      )}

      {/* Mortgage Form Dialog */}
      <MortgageFormDialog
        client={client}
        mortgage={editingMortgage}
        isOpen={showForm}
        onClose={handleClose}
      />
    </div>
  );
}
