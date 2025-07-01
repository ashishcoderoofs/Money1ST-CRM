
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";

interface ConsultantHeaderProps {
  consultant: {
    firstName: string;
    lastName: string;
    position?: string;
  };
  consultantId: string;
}

export function ConsultantHeader({ consultant, consultantId }: ConsultantHeaderProps) {
  const getFullName = (firstName: string, lastName: string) => {
    return [firstName, lastName].filter(Boolean).join(" ");
  };

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName[0] : "";
    const lastInitial = lastName ? lastName[0] : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={undefined} />
          <AvatarFallback className="text-xl">
            {getInitials(consultant.firstName, consultant.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {getFullName(consultant.firstName, consultant.lastName)}
          </h1>
          <p className="text-muted-foreground">{consultant.position || 'N/A'}</p>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link to={`/securia/consultants/edit/${consultantId}`}>
          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
        </Link>
      </Button>
    </div>
  );
}
