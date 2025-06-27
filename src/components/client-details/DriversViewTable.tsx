
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface DriversViewTableProps {
  client: Tables<"clients">;
}

export function DriversViewTable({ client }: DriversViewTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-red-600 text-white">
          <CardTitle>Drivers Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Drivers information functionality is coming soon.</p>
            <p className="text-xs mt-2">This section will contain driver details and vehicle assignments.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
