
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface VehicleCoverageViewTableProps {
  client: Tables<"clients">;
}

export function VehicleCoverageViewTable({ client }: VehicleCoverageViewTableProps) {
  return (
    <div className="space-y-4">
      {/* Current Coverage */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Current Coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="font-semibold">Carrier:</span> {client.vehicle_carrier || "N/A"}
            </div>
            <div>
              <span className="font-semibold">6 Month Premium:</span> ${client.vehicle_6_month_premium || 0}
            </div>
            <div>
              <span className="font-semibold">Expiration Date:</span> {client.vehicle_expiration_date ? new Date(client.vehicle_expiration_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Annual Premium:</span> ${client.vehicle_annual_premium || 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposed Coverage */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Proposed Coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">6 Month Premium (Proposed):</span> ${client.vehicle_6_month_premium_proposed || 0}
            </div>
            <div>
              <span className="font-semibold">Savings:</span> ${client.vehicle_savings || 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="font-semibold">App Date:</span> {client.vehicle_app_date ? new Date(client.vehicle_app_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {client.vehicle_status || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Status Date:</span> {client.vehicle_status_date ? new Date(client.vehicle_status_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Issue Date:</span> {client.vehicle_issue_date ? new Date(client.vehicle_issue_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">Disburse Date:</span> {client.vehicle_disburse_date ? new Date(client.vehicle_disburse_date).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-semibold">DFT:</span> {client.vehicle_dft || "N/A"}
            </div>
            <div>
              <span className="font-semibold">DFT Number:</span> {client.vehicle_dft_number || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Units:</span> {client.vehicle_units ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
