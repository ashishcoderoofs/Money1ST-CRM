
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface RentersViewTableProps {
  client: Tables<"clients">;
}

export function RentersViewTable({ client }: RentersViewTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-purple-600 text-white">
          <CardTitle>Renters Insurance Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Renters insurance functionality is coming soon.</p>
            <p className="text-xs mt-2">This section will contain rental property coverage details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
