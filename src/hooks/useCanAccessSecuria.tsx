
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCanAccessSecuria(userId: string | null) {
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCanAccess(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("profiles")
      .select("can_access_securia")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        setCanAccess(!!data?.can_access_securia);
        setLoading(false);
      });
  }, [userId]);

  return { canAccess, loading };
}
