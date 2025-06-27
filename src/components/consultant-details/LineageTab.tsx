
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LineageTabProps {
  consultant: {
    role: string;
    status: string;
    created_at: string;
  };
  manager: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  isLoadingManager: boolean;
}

export function LineageTab({ consultant, manager, isLoadingManager }: LineageTabProps) {
  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  return (
    <div className="mt-4">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-semibold">Manager (Upline):</span>{" "}
              {isLoadingManager ? (
                <Skeleton className="inline-block h-4 w-32" />
              ) : (
                manager ? getFullName(manager.first_name, manager.last_name) : "N/A"
              )}
            </div>
            <div>
              <span className="font-semibold">Position (Role):</span> {consultant.role}
            </div>
            <div>
              <span className="font-semibold">Status:</span> {consultant.status}
            </div>
            <div>
              <span className="font-semibold">Entry Date:</span> {new Date(consultant.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
