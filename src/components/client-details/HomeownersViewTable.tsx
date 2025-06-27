
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface HomeownersViewTableProps {
  client: Tables<"clients">;
}

export function HomeownersViewTable({ client }: HomeownersViewTableProps) {
  return (
    <div className="space-y-4">
      {/* Property Information */}
      <Card>
        <CardHeader className="bg-orange-600 text-white">
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold">Address:</span> {client.homeowners_address || "N/A"}
            </div>
            <div>
              <span className="font-semibold">City:</span> {client.homeowners_city || "N/A"}
            </div>
            <div>
              <span className="font-semibold">State:</span> {client.homeowners_state || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Property Value:</span> ${client.homeowners_property_value || 0}
            </div>
            <div>
              <span className="font-semibold">Year Built:</span> {client.homeowners_year_built || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Square Footage:</span> {client.homeowners_square_footage || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Construction:</span> {client.homeowners_construction || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Roof:</span> {client.homeowners_roof || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Foundation:</span> {client.homeowners_foundation || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coverage Information */}
      <Card>
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle>Coverage Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold">Current Provider:</span> {client.homeowners_current_provider || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Current Premium:</span> ${client.homeowners_current_premium || 0}
            </div>
            <div>
              <span className="font-semibold">Proposed Premium:</span> ${client.homeowners_proposed_premium || 0}
            </div>
            <div>
              <span className="font-semibold">Savings:</span> ${client.homeowners_savings || 0}
            </div>
            <div>
              <span className="font-semibold">Current Deductible:</span> {client.homeowners_current_deductible || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Proposed Deductible:</span> {client.homeowners_proposed_deductible || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <Card>
        <CardHeader className="bg-green-600 text-white">
          <CardTitle>Safety Features</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-semibold">Smoke Detector:</span> {client.homeowners_smoke_detector || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Fire Extinguisher:</span> {client.homeowners_fire_extinguisher || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Burglar Alarm:</span> {client.homeowners_monitored_burglar_alarm || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Fire Alarm:</span> {client.homeowners_monitored_fire_alarm || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Deadbolt Locks:</span> {client.homeowners_deadbolt_locks || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Security Guard:</span> {client.homeowners_24_hour_security_guard || "N/A"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
