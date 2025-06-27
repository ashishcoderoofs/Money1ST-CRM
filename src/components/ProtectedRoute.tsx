
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
