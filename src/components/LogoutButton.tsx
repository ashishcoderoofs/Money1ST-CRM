
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const { signOut } = useAuth();
  return (
    <Button
      variant="ghost"
      onClick={signOut}
      className="flex items-center gap-2"
      title="Logout"
    >
      <LogOut />
      Logout
    </Button>
  );
}
