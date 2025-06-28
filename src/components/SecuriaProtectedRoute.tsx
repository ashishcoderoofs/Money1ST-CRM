
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function SecuriaProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check Securia access - Only Admin users are allowed
  useEffect(() => {
    if (!user) {
      return;
    }
    
    // Only Admin users can access Securia
    if (role === "Admin") {
      console.log("Admin role detected for Securia access");
      // For now, bypass the re-authentication and go straight to content
      // TODO: Implement re-authentication if needed
      setIsAuthenticated(true);
    } else {
      console.log("Non-admin role detected, denying Securia access");
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
    
    setIsVerifying(true);
    
    try {
      // For MongoDB backend, we'll implement re-authentication later
      // For now, just validate that the email matches and grant access
      if (email.trim() === user?.email && password.trim().length >= 6) {
        toast({
          title: "Success",
          description: "Securia access granted",
        });
        setIsAuthenticated(true);
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Access denied.",
          variant: "destructive",
        });
        setPassword("");
      }
    } catch (error) {
      console.error("Securia authentication error:", error);
      toast({
        title: "Error", 
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
      setPassword("");
    } finally {
      setIsVerifying(false);
    }
  };

  if (authLoading || roleLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only Admin users can access Securia
  if (role !== "Admin") {
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
            Please enter your credentials to access the secure Securia portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecuriaLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
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
              disabled={isVerifying || !email.trim() || !password.trim()}
            >
              {isVerifying ? "Verifying..." : "Access Securia"}
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
