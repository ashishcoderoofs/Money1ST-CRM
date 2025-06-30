import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useSecuriaReauth } from "@/hooks/useSecuriaReauth";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function SecuriaProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const securiaReauth = useSecuriaReauth();

  // Check Securia access - Only Admin users are allowed
  useEffect(() => {
    if (!user) {
      setCanAccess(false);
      return;
    }
    
    // Only Admin users can access Securia
    if (role === "Admin") {
      console.log("Admin role detected for Securia access - require re-authentication");
      setCanAccess(true);
      // Don't bypass authentication - require re-auth for security
      setIsAuthenticated(false);
    } else {
      console.log("Non-admin role detected, denying Securia access");
      setCanAccess(false);
      setIsAuthenticated(false);
    }
  }, [user, role]);

  // Initialize email field with user's email when user changes
  useEffect(() => {
    setIsAuthenticated(false);
    setPassword("");
    setEmail(user?.email || "");
  }, [user?.id, user?.email]);

  const handleSecuriaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      const result = await securiaReauth.mutateAsync({
        email: email.trim(),
        password: password.trim(),
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Securia access granted",
        });
        setIsAuthenticated(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Authentication failed",
          variant: "destructive",
        });
        setPassword("");
      }
    } catch (error) {
      console.error("Securia authentication error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  if (authLoading || roleLoading || canAccess === null) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess) {
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
            <p className="text-sm text-muted-foreground">Your current role: {role ?? "Unknown"}</p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authenticated successfully, show the Securia content
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show secure authentication screen for Admin users
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Securia Access</CardTitle>
          <CardDescription>
            Please re-enter your password to access the secure Securia portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecuriaLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                disabled // Pre-filled with current user's email, readonly
                className="bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                maxLength={128}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={securiaReauth.isPending || !password.trim()}
            >
              {securiaReauth.isPending ? "Verifying..." : "Access Securia"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Cancel and return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}