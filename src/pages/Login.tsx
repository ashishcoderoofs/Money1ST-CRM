
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserCount } from "@/hooks/useUserCount";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signIn, user } = useAuth();
  const { userCount, loading: userCountLoading } = useUserCount();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  console.log("Login component - userCount:", userCount, "loading:", userCountLoading);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // Show red error toast for account status issues
        toast.error(error.message, {
          style: {
            backgroundColor: '#fef2f2',
            borderColor: '#fca5a5',
            color: '#dc2626'
          }
        });
        setLoading(false);
      } else {
        // Only show success and navigate if no error
        toast.success("Welcome!");
        // Don't set loading to false here - let the auth state change handle navigation
        // setLoading will be reset when component unmounts or user state changes
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (userCountLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6">
        <form
          onSubmit={handleSignIn}
          className="p-8 border border-border rounded-lg bg-card shadow-lg"
        >
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Money 1st Financial.net CRM</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>

          <div className="space-y-4 mt-6">
            <Input
              type="email"
              placeholder="Email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
            />
            
            <Input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              Contact your admin to get access.
            </div>
          </div>
        </form>

        {/* Hide the Create Admin User component for now */}
        {/* <CreateAdminUser /> */}
      </div>
    </div>
  );
};

export default Login;
