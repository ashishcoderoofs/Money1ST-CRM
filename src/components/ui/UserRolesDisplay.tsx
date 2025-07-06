import { Badge } from "@/components/ui/badge";

interface UserRolesDisplayProps {
  mainRole: string;
  isAdmin: boolean;
  variant?: "default" | "compact";
}

export function UserRolesDisplay({ mainRole, isAdmin, variant = "default" }: UserRolesDisplayProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'destructive';
      case 'Field Builder':
        return 'default';
      case 'Field Trainer':
        return 'secondary';
      case 'Senior BMA':
        return 'outline';
      case 'BMA':
        return 'secondary';
      case 'IBA':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <Badge variant={getRoleBadgeVariant(mainRole)} className="text-xs">
          {mainRole}
        </Badge>
        {isAdmin && (
          <Badge variant="destructive" className="text-xs">
            Admin
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant={getRoleBadgeVariant(mainRole)}>
        {mainRole}
      </Badge>
      {isAdmin && (
        <Badge variant="destructive">
          Admin Privileges
        </Badge>
      )}
    </div>
  );
}
