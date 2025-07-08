import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAuth } from "./useAuth";

interface SecuriaSessionContextType {
  isSecuriaAuthenticated: boolean;
  securiaSessionId: string | null;
  loading: boolean;
  isAuthenticating: boolean;
  checkSecuriaSession: (skipLoadingState?: boolean) => Promise<boolean>;
  authenticateSecuria: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutSecuria: () => Promise<void>;
}

const SecuriaSessionContext = createContext<SecuriaSessionContextType | undefined>(undefined);

export function SecuriaSessionProvider({ children }: { children: React.ReactNode }) {
  const { user, token, apiCall } = useAuth();
  const [isSecuriaAuthenticated, setIsSecuriaAuthenticated] = useState(false);
  const [securiaSessionId, setSecuriaSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to prevent initial flash
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const clearSecuriaSession = useCallback(() => {
    localStorage.removeItem('securia_session_id');
    setSecuriaSessionId(null);
    setIsSecuriaAuthenticated(false);
  }, []);

  const checkSecuriaSession = useCallback(async (skipLoadingState = false): Promise<boolean> => {
    if (!user) {
      if (!skipLoadingState) setLoading(false);
      return false;
    }

    try {
      if (!skipLoadingState) setLoading(true);
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
      if (!skipLoadingState) setLoading(false);
    }
  }, [user, apiCall, clearSecuriaSession]);

  // Check for stored Securia session on mount
  useEffect(() => {
    if (hasInitialized || !user) return;
    
    setLoading(true); // Set loading only when we actually start checking
    const storedSessionId = localStorage.getItem('securia_session_id');
    if (storedSessionId) {
      // Don't set the session ID until we verify it's valid
      // Check session status without showing loading spinner again
      checkSecuriaSession(true).then((isValid) => {
        if (isValid) {
          setSecuriaSessionId(storedSessionId);
        } else {
          // Session is invalid, clear it
          localStorage.removeItem('securia_session_id');
          setSecuriaSessionId(null);
        }
      }).finally(() => {
        setLoading(false);
        setHasInitialized(true);
      });
    } else {
      setLoading(false);
      setHasInitialized(true);
    }
  }, [user, checkSecuriaSession, hasInitialized]);

  // Clear Securia session when user logs out
  useEffect(() => {
    if (!user) {
      clearSecuriaSession();
      setLoading(false);
      setHasInitialized(false); // Reset initialization when user logs out
    }
  }, [user, clearSecuriaSession]);

  const authenticateSecuria = useCallback(async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      const response = await apiCall('/api/securia/reauth', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      let data: any = {};
      if (!response.bodyUsed) {
        data = await response.json();
      }
      if (response.ok && data.success) {
        setIsSecuriaAuthenticated(true);
        if (data.sessionId) {
          setSecuriaSessionId(data.sessionId);
          localStorage.setItem('securia_session_id', data.sessionId);
        }
        return { success: true };
      }
      // If not ok, use the same data for error
      return {
        success: false,
        message: data.message || 'Authentication failed'
      };
    } catch (error) {
      console.error('Securia authentication error:', error);
      return { 
        success: false, 
        message: 'Network error occurred' 
      };
    } finally {
      setIsAuthenticating(false);
    }
  }, [apiCall]);

  const logoutSecuria = useCallback(async () => {
    try {
      await apiCall('/api/securia/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error logging out of Securia:', error);
    } finally {
      clearSecuriaSession();
    }
  }, [apiCall, clearSecuriaSession]);

  const value = {
    isSecuriaAuthenticated,
    securiaSessionId,
    loading,
    isAuthenticating,
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