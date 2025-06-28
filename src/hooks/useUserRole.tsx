
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";

export function useUserRole(userId: string | null) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!userId || !user) {
      setRole(null);
      setLoading(false);
      return;
    }
    
    // Get role directly from the user object returned by authentication
    if (user.role) {
      setRole(user.role as UserRole);
      setLoading(false);
    } else {
      setRole(null);
      setLoading(false);
    }
  }, [userId, user]);

  return { role, loading };
}
