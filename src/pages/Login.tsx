import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message, {
          style: {
            backgroundColor: "#fef2f2",
            borderColor: "#fca5a5",
            color: "#dc2626"
          }
        });
      } else {
        toast.success("Welcome!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userCountLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Money 1st Financial.net CRM</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition duration-150"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="text-xs text-center text-gray-400 mt-6">
          Contact your admin to get access.
        </div>

        <div className="text-[10px] text-center text-gray-300 mt-2">
          
        </div>
      </div>
    </div>
  );
};

export default Login;
