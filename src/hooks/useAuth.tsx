
import { useEffect, useState, createContext, useContext } from "react";

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface User {
  id: string;
  consultantId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  apiCall: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on component mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          if (data.error?.includes('deactivated') || data.error?.includes('inactive')) {
            return { error: { message: "Your account is inactive. Please contact your administrator." } };
          }
          return { error: { message: "Invalid email or password." } };
        }
        return { error: { message: data.error || "Login failed. Please try again." } };
      }

      if (data.success && data.token && data.user) {
        // Store authentication data
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        
        return { error: null };
      } else {
        return { error: { message: "Invalid response from server." } };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: { message: "Network error. Please check your connection and try again." } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Helper function for authenticated API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    signIn,
    signOut,
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}