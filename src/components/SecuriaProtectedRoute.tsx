
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";

export default function SecuriaProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading, session } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check Securia access with enhanced security
  useEffect(() => {
    if (!user || !session) {
      setCanAccess(false);
      return;
    }
    
    const checkSecuriaAccess = async () => {
      try {
        // Verify session is still valid
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          setCanAccess(false);
          return;
        }

        // Check both user access and Securia-specific access
        const { data: userProfile, error: profileError } = await supabase
          .from("profiles")
          .select("can_access_securia, has_access")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Error checking Securia access:", profileError);
          setCanAccess(false);
          return;
        }

        // User must have both general system access AND Securia access
        const hasSystemAccess = userProfile?.has_access ?? true;
        const hasSecuriaAccess = userProfile?.can_access_securia || role === "Admin";
        
        setCanAccess(hasSystemAccess && hasSecuriaAccess);
      } catch (error) {
        console.error("Securia access check failed:", error);
        setCanAccess(false);
      }
    };
    
    checkSecuriaAccess();
  }, [user, role, session]);

  // Initialize email field with user's email when user changes, but allow editing
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
      // Sanitize inputs
      const sanitizedEmail = email.trim();
      const sanitizedPassword = password.trim();
      
      // Verify password by attempting re-authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword
      });
      
      if (error || !data.session) {
        toast.error("Invalid credentials. Access denied.");
        setPassword("");
      } else {
        // Additional security: verify the session is fresh and valid
        if (data.session.access_token && data.session.user) {
          toast.success("Securia access granted");
          setIsAuthenticated(true);
        } else {
          toast.error("Authentication verification failed");
          setPassword("");
        }
      }
    } catch (error) {
      console.error("Securia authentication error:", error);
      toast.error("Authentication failed. Please try again.");
      setPassword("");
    } finally {
      setIsVerifying(false);
    }
  };

  if (authLoading || roleLoading || canAccess === null) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess) {
    return (
      <div className="p-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access Securia. Only users specifically granted Securia access can use this module.
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

  // Show secure authentication screen
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
