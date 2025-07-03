
import { useEffect, useState, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";

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

  // Function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      console.log('🔍 Token expiration check:', {
        currentTime: new Date(currentTime * 1000).toLocaleString(),
        tokenExpiry: decodedToken.exp ? new Date(decodedToken.exp * 1000).toLocaleString() : 'No expiry',
        isExpired: decodedToken.exp ? decodedToken.exp < currentTime : false,
        timeUntilExpiry: decodedToken.exp ? ((decodedToken.exp - currentTime) / 60).toFixed(2) + ' minutes' : 'N/A'
      });
      
      // Check if token has expiration and if it's expired
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat invalid tokens as expired
    }
  };

  // Function to handle token expiration
  const handleTokenExpiration = () => {
    console.warn('🚨 JWT token has expired, logging out user');
    console.log('Token expiration time:', new Date().toLocaleString());
    
    // Clear all auth data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken(null);
    setUser(null);
    
    // Show user-friendly message (could be replaced with toast notification)
    alert('Your session has expired. Please log in again.');
    
    // Redirect to login
    window.location.href = '/login';
  };

  useEffect(() => {
    // Check for stored token on component mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      try {
        // Check if token is expired before setting it
        if (isTokenExpired(storedToken)) {
          console.warn('Stored token is expired, clearing auth data');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        } else {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setLoading(false);
  }, []);

  // Effect to periodically check token expiration
  useEffect(() => {
    if (!token) return;

    console.log('🔄 Starting token expiration monitoring...');

    // Check token expiration immediately
    if (isTokenExpired(token)) {
      handleTokenExpiration();
      return;
    }

    // Set up interval to check token expiration every 10 seconds for more responsive checking
    const intervalId = setInterval(() => {
      if (token && isTokenExpired(token)) {
        handleTokenExpiration();
      }
    }, 10000); // Check every 10 seconds

    // Cleanup interval on unmount or when token changes
    return () => {
      console.log('🛑 Stopping token expiration monitoring');
      clearInterval(intervalId);
    };
  }, [token]);

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
      // Call logout endpoint to clear server-side sessions (including Securia)
      if (token) {
        try {
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.warn('Error calling logout endpoint:', error);
          // Continue with local logout even if server call fails
        }
      }
      
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('securia_session_id'); // Also clear Securia session
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Helper function for authenticated API calls with token expiration handling
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        
        // Check if it's a token expiration or invalid token error
        if (errorData.error?.includes('token') || errorData.error?.includes('expired') || 
            errorData.error?.includes('invalid') || errorData.error?.includes('denied')) {
          console.warn('Token expired or invalid, signing out user');
          
          // Clear authentication state and Securia session
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('securia_session_id'); // Clear Securia session on JWT expiration
          setToken(null);
          setUser(null);
          
          // Optionally show a notification or redirect to login
          // This could be enhanced with a toast notification
          window.location.href = '/login';
        }
      }

      return response;
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
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