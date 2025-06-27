
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface IncomeProtectionViewTableProps {
  client: Tables<"clients">;
}

export function IncomeProtectionViewTable({ client }: IncomeProtectionViewTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-teal-600 text-white">
          <CardTitle>Income Protection Coverage</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Income protection functionality is coming soon.</p>
            <p className="text-xs mt-2">This section will contain disability and income protection details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
