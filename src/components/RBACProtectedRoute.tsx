
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useUserPageAccess } from "@/hooks/usePagePermissions";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo } from "react";

interface RBACProtectedRouteProps {
  children: React.ReactNode;
  pageName: string;
}

export default function RBACProtectedRoute({ children, pageName }: RBACProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const { data: canAccess, isLoading: accessLoading, error: accessError } = useUserPageAccess(role, pageName);

  // Memoize the debug info to prevent unnecessary re-renders
  const debugInfo = useMemo(() => ({
    pageName,
    role,
    canAccess,
    authLoading,
    roleLoading,
    accessLoading,
    accessError
  }), [pageName, role, canAccess, authLoading, roleLoading, accessLoading, accessError]);

  console.log("RBACProtectedRoute Debug:", debugInfo);

  // Show loading while authentication or role is loading
  if (authLoading || roleLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For Admin users, grant immediate access without waiting for permission checks
  if (role === 'Admin') {
    return <>{children}</>;
  }

  // If there's an error loading permissions, show error
  if (accessError) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Permission Error</CardTitle>
            <CardDescription>
              Unable to load page permissions. Please try refreshing the page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Your current role: {role || 'Unknown'}</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading only if access is still loading and we don't have data
  if (accessLoading && canAccess === undefined) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary mx-auto mb-4"></div>
        <p>Checking permissions...</p>
      </div>
    );
  }

  // Only show access denied if we have definitive data and access is denied
  if (canAccess === false) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the {pageName} page. Please contact your administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Your current role: {role || 'Unknown'}</p>
            <Button asChild className="w-full" variant="outline">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Allow access if canAccess is true
  if (canAccess === true) {
    return <>{children}</>;
  }

  // If we don't have permission data yet, show loading
  return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-powerbi-primary mx-auto mb-4"></div>
      <p>Checking permissions...</p>
    </div>
  );
}
