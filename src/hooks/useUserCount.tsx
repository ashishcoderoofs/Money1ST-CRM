
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUserCount() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserCount = async () => {
      try {
        console.log("Checking user count...");
        const { count, error } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        
        console.log("User count result:", { count, error });
        
        if (error) {
          console.error("Error checking user count:", error);
          setUserCount(0);
        } else {
          console.log("Setting user count to:", count || 0);
          setUserCount(count || 0);
        }
      } catch (error) {
        console.error("Error checking user count:", error);
        setUserCount(0);
      } finally {
        setLoading(false);
      }
    };

    checkUserCount();
  }, []);

  console.log("useUserCount returning:", { userCount, loading });
  return { userCount, loading };
}
