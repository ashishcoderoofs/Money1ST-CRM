
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface LineageViewTableProps {
  client: Tables<"clients">;
}

export function LineageViewTable({ client }: LineageViewTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gray-600 text-white">
          <CardTitle>Client Lineage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Client lineage functionality is coming soon.</p>
            <p className="text-xs mt-2">This section will contain client relationship and referral tracking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
