import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useSecuriaReauth } from "@/hooks/useSecuriaReauth";
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
import { ShieldCheck } from "lucide-react"; // Security icon

export default function SecuriaProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id ?? null);
  const securiaReauth = useSecuriaReauth();

  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    }
  }, [user, role]);

  useEffect(() => {
    setPassword("");
    setEmail(user?.email || "");
  }, [user?.id, user?.email]);

  const handleSecuriaLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      const result = await securiaReauth.mutateAsync({
        email,
        password,
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
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
      setPassword("");
    }
  };

  if (authLoading || roleLoading || canAccess === null) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!canAccess) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full shadow-lg border border-red-300">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-red-600">
              Access Denied
            </CardTitle>
            <CardDescription>
              Securia access is restricted to Admin users only.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Your current role: {role ?? "Unknown"}
            </p>
            <Button asChild className="mt-4 w-full" variant="outline">
              <Link to="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl border border-blue-100 bg-white transition duration-300 hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="text-center flex flex-col items-center gap-3">
          {/* Security Icon with glow */}
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full shadow-md">
            <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-2xl font-semibold text-blue-900">
            Securia Access
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please re-enter your password to access the secure Securia portal.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSecuriaLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
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
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={securiaReauth.isPending || !password.trim()}
            >
              {securiaReauth.isPending ? "Verifying..." : "Access Securia"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button asChild variant="ghost" size="sm">
              <Link to="/" className="text-sm underline text-blue-600">
                Cancel and return to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
