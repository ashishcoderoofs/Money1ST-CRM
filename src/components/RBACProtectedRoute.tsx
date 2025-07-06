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
  
  // Enhanced debugging for Field Builder Dashboard access
  if (pageName === 'Dashboard' && role === 'Field Builder') {
    console.log("🔍 FIELD BUILDER DASHBOARD DEBUG:");
    console.log("  - User object:", user);
    console.log("  - User status:", user?.status);
    console.log("  - Can access:", canAccess);
    console.log("  - Access loading:", accessLoading);
    console.log("  - Access error:", accessError);
  }
  
  // Enhanced debugging for Field Trainer Dashboard access
  if (pageName === 'Dashboard' && role === 'Field Trainer') {
    console.log("🔍 FIELD TRAINER DASHBOARD DEBUG:");
    console.log("  - User object:", user);
    console.log("  - User status:", user?.status);
    console.log("  - Can access:", canAccess);
    console.log("  - Access loading:", accessLoading);
    console.log("  - Access error:", accessError);
  }
  
  // Additional debugging for Securia
  if (pageName === 'Securia') {
    console.log("SECURIA DEBUG - Role:", role, "Type:", typeof role, "String value:", String(role));
    console.log("SECURIA DEBUG - Is Admin?", role === 'Admin', "String comparison:", String(role) === 'Admin');
  }

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

  // Use isAdmin for admin checks
  if (user.isAdmin) {
    return <>{children}</>;
  }

  // Enhanced fallback for core pages when permission check fails/loads
  const getCorePageAccess = (userRole: string | null, page: string): boolean => {
    if (!userRole) return false;
    
    const corePermissions: Record<string, string[]> = {
      'Dashboard': ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
      'Contacts': ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
      'Deals': ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
      'Tasks': ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA', 'BMA', 'IBA'],
      'Reports': ['Admin', 'Field Builder', 'Field Trainer', 'Senior BMA'],
      'User Management': ['Admin', 'Field Builder'],
      'Securia Access': ['Admin'],
      'Securia': ['Admin']
    };
    
    return corePermissions[page]?.includes(userRole) || false;
  };

  // If permission check is still loading or failed, use core permissions as fallback
  if ((accessLoading && canAccess === undefined) || accessError) {
    const hasCoreAccess = getCorePageAccess(role, pageName);
    console.log(`🔧 Using core permissions fallback for ${role} on ${pageName}: ${hasCoreAccess}`);
    
    if (hasCoreAccess) {
      return <>{children}</>;
    }
  }

  // For Securia page, only allow Admin users (deny all others immediately)
  if (pageName === 'Securia' && role !== null && String(role) !== 'Admin') {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              Securia access is restricted to Admin users only.
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
