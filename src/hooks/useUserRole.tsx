
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "Admin" | "Field Builder" | "Field Trainer" | "Sr. BMA" | "BMA" | "IBA";

export function useUserRole(userId: string | null) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        setRole(data?.role as UserRole ?? null);
        setLoading(false);
      });
  }, [userId]);

  return { role, loading };
}
