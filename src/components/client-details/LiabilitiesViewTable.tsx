
import { useLiabilitiesQuery } from "@/hooks/clients/useLiabilitiesQuery";
import { Tables } from "@/integrations/supabase/types";

interface LiabilitiesViewTableProps {
  client: Tables<"clients">;
}

export function LiabilitiesViewTable({ client }: LiabilitiesViewTableProps) {
  const { data: liabilities = [], isLoading } = useLiabilitiesQuery(client.id);

  const calculateTotalEscrow = (taxes: number, hoi: number) => {
    return (taxes || 0) + (hoi || 0);
  };

  const calculateNetRent = (grossRent: number, taxes: number, hoi: number) => {
    return (grossRent || 0) - calculateTotalEscrow(taxes || 0, hoi || 0);
  };

  const totalBalance = liabilities.reduce((sum, liability) => sum + (liability.current_balance || 0), 0);
  const totalPayment = liabilities.reduce((sum, liability) => sum + (liability.monthly_payment || 0), 0);

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading liabilities...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-cyan-400 text-white px-4 py-3 rounded-t">
        <h2 className="text-lg font-semibold">List all Monthly Payments and Properties Owned</h2>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-300 rounded-b">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[4%]">Client#</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[8%]">Debtor</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[10%]">Debt Type</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[10%]">Debt Name</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[8%]">Balance</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[8%]">Payment</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[6%]">Pay Off</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[12%]">Property Address</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[7%]">Property Value</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[6%]">Gross Rent</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[5%]">Escrow</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[5%]">Taxes</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[4%]">HOI</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[6%]">Total Esc.</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-medium w-[6%]">Net Rent</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.length === 0 ? (
                <tr>
                  <td colSpan={15} className="border border-gray-300 px-4 py-6 text-center text-gray-500">
                    No liabilities found for this client.
                  </td>
                </tr>
              ) : (
                liabilities.map((liability, index) => (
                  <tr key={liability.id}>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {liability.debtor_type}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {liability.liability_type || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {liability.creditor_name || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.current_balance || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.monthly_payment || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {liability.pay_off ? 'Yes' : 'No'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {liability.property_address || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.property_value || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.gross_rent || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {liability.escrow || '-'}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.taxes || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${(liability.hoi || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${calculateTotalEscrow(liability.taxes || 0, liability.hoi || 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-right">
                      ${calculateNetRent(liability.gross_rent || 0, liability.taxes || 0, liability.hoi || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {liabilities.length > 0 && (
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">
                    Total Balance
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-bold text-xs">
                    ${totalBalance.toFixed(2)}
                  </td>
                  <td colSpan={3} className="border border-gray-300 px-3 py-2 text-center font-bold text-xs">
                    Total Payment
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-right font-bold text-xs">
                    ${totalPayment.toFixed(2)}
                  </td>
                  <td colSpan={7} className="border border-gray-300"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
