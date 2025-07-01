
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LineageTabProps {
  consultant: {
    position?: string;
    status: string;
    createdAt: string;
    firstName: string;
    lastName: string;
  };
}

export function LineageTab({ consultant }: LineageTabProps) {
  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Manager (Upline):</span> N/A
            </div>
            <div>
              <span className="font-semibold">Position (Role):</span> {consultant.position || 'N/A'}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {consultant.status}
            </div>
            <div>
              <span className="font-semibold">Entry Date:</span> {new Date(consultant.createdAt).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
