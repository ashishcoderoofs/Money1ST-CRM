import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./useAuth";

interface SecuriaSessionContextType {
  isSecuriaAuthenticated: boolean;
  securiaSessionId: string | null;
  loading: boolean;
  checkSecuriaSession: () => Promise<boolean>;
  authenticateSecuria: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutSecuria: () => Promise<void>;
}

const SecuriaSessionContext = createContext<SecuriaSessionContextType | undefined>(undefined);

export function SecuriaSessionProvider({ children }: { children: React.ReactNode }) {
  const { user, token, apiCall } = useAuth();
  const [isSecuriaAuthenticated, setIsSecuriaAuthenticated] = useState(false);
  const [securiaSessionId, setSecuriaSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored Securia session on mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('securia_session_id');
    if (storedSessionId && user) {
      setSecuriaSessionId(storedSessionId);
      checkSecuriaSession();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Clear Securia session when user logs out
  useEffect(() => {
    if (!user) {
      clearSecuriaSession();
    }
  }, [user]);

  const clearSecuriaSession = () => {
    localStorage.removeItem('securia_session_id');
    setSecuriaSessionId(null);
    setIsSecuriaAuthenticated(false);
  };

  const checkSecuriaSession = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiCall('/api/securia/status');
      
      if (response.ok) {
        const data = await response.json();
        const hasAccess = data.hasSecuriaAccess || false;
        setIsSecuriaAuthenticated(hasAccess);
        
        if (!hasAccess) {
          clearSecuriaSession();
        }
        
        return hasAccess;
      } else {
        clearSecuriaSession();
        return false;
      }
    } catch (error) {
      console.error('Error checking Securia session:', error);
      clearSecuriaSession();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const authenticateSecuria = async (email: string, password: string) => {
    try {
      const response = await apiCall('/api/securia/reauth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSecuriaAuthenticated(true);
        
        // Store session ID if provided
        if (data.sessionId) {
          setSecuriaSessionId(data.sessionId);
          localStorage.setItem('securia_session_id', data.sessionId);
        }
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || 'Authentication failed' 
        };
      }
    } catch (error) {
      console.error('Securia authentication error:', error);
      return { 
        success: false, 
        message: 'Network error occurred' 
      };
    }
  };

  const logoutSecuria = async () => {
    try {
      await apiCall('/api/securia/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error logging out of Securia:', error);
    } finally {
      clearSecuriaSession();
    }
  };

  const value = {
    isSecuriaAuthenticated,
    securiaSessionId,
    loading,
    checkSecuriaSession,
    authenticateSecuria,
    logoutSecuria,
  };

  return (
    <SecuriaSessionContext.Provider value={value}>
      {children}
    </SecuriaSessionContext.Provider>
  );
}

export function useSecuriaSession() {
  const context = useContext(SecuriaSessionContext);
  if (context === undefined) {
    throw new Error('useSecuriaSession must be used within a SecuriaSessionProvider');
  }
  return context;
}
