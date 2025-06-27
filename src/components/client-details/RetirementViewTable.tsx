
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface RetirementViewTableProps {
  client: Tables<"clients">;
}

export function RetirementViewTable({ client }: RetirementViewTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-indigo-600 text-white">
          <CardTitle>Retirement Planning</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-gray-500">
            <p>Retirement planning functionality is coming soon.</p>
            <p className="text-xs mt-2">This section will contain retirement and investment planning details.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
