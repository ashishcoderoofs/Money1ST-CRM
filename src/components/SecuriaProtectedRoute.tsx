import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck, Lock, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function SecuriaProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  useEffect(() => {
    if (!user) {
      setCanAccess(false);
      return;
    }
    if (role === "Admin") {
      setCanAccess(true);
      setIsAuthenticated(false);
    } else {
      setCanAccess(false);
      setIsAuthenticated(false);
    }
  }, [user, role]);

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
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const endpoint = `${apiUrl}/api/securia/reauth`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      let data;
      try {
        const text = await response.text();
        data = text.trim() ? JSON.parse(text) : { success: false, message: "Server returned empty response" };
      } catch (jsonError) {
        console.error("Invalid JSON response:", jsonError);
        data = { success: false, message: "Invalid server response" };
      }

      if (response.ok && data.success) {
        if (data.user && data.user.email === user?.email) {
          toast({ title: "Success", description: "Securia access granted" });
          setIsAuthenticated(true);
        } else {
          toast({ title: "Error", description: "User mismatch.", variant: "destructive" });
          setPassword("");
        }
      } else {
        let errorMessage = data.message || "Authentication failed";
        if (response.status === 400) errorMessage = "Invalid credentials";
        else if (response.status === 403) errorMessage = "Admin access only";
        else if (response.status >= 500) errorMessage = "Server error";

        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        setPassword("");
        setLoginAttempts((prev) => prev + 1);
      }
    } catch (err) {
      toast({ title: "Network Error", description: "Check your connection.", variant: "destructive" });
      setPassword("");
    } finally {
      setIsVerifying(false);
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
            <CardDescription>Admin role is required to access Securia.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Your current role: {role ?? "Unknown"}</p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border border-gray-200 shadow-xl backdrop-blur-md bg-white/80">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <ShieldCheck className="w-12 h-12 text-blue-700" />
            </div>
            <CardTitle className="text-2xl font-bold">Securia Admin Login</CardTitle>
            <CardDescription>Only authorized administrators are allowed to proceed.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSecuriaLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="admin@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    maxLength={255}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    maxLength={128}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying || !email.trim() || !password.trim()}
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4" /> Verifying...
                  </span>
                ) : (
                  "Access Securia"
                )}
              </Button>
              {loginAttempts > 0 && (
                <p className="text-xs text-center text-red-500">
                  Warning: {loginAttempts} unsuccessful attempt{loginAttempts > 1 ? "s" : ""}.
                </p>
              )}
            </form>
            <div className="mt-4 text-center">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">← Cancel and return to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
