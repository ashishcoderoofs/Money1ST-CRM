
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface HierarchyTabProps {
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

export function HierarchyTab({ consultant, manager, isLoadingManager }: HierarchyTabProps) {
  const getFullName = (firstName: string | null, lastName: string | null) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  return (
    <div className="mt-4">
      <Card>
        <CardHeader><CardTitle>Hierarchy & Status</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="font-medium text-muted-foreground">Manager (Upline)</p>
            {isLoadingManager ? (
              <Skeleton className="mt-1 h-5 w-40" />
            ) : (
              <p>{manager ? getFullName(manager.first_name, manager.last_name) : "N/A"}</p>
            )}
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Position (Role)</p>
            <p>{consultant.role}</p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Status</p>
            <Badge variant={consultant.status === 'Active' ? 'default' : 'secondary'}>
              {consultant.status}
            </Badge>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Entry Date</p>
            <p>{new Date(consultant.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
