import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./useAuth";

interface SecuriaSessionContextType {
  isSecuriaAuthenticated: boolean;
  setSecuriaAuthenticated: (authenticated: boolean) => void;
  clearSecuriaSession: () => void;
}

const SecuriaSessionContext = createContext<SecuriaSessionContextType | undefined>(undefined);

export function SecuriaSessionProvider({ children }: { children: React.ReactNode }) {
  const [isSecuriaAuthenticated, setIsSecuriaAuthenticated] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check for stored Securia session on component mount
    const storedSecuriaAuth = localStorage.getItem('securia_authenticated');
    const storedUserId = localStorage.getItem('securia_user_id');
    
    // Validate that the stored session belongs to the current user
    if (storedSecuriaAuth === 'true' && storedUserId === user?.id) {
      setIsSecuriaAuthenticated(true);
    } else {
      // Clear invalid session
      clearSecuriaSession();
    }
  }, [user?.id]);

  const setSecuriaAuthenticated = (authenticated: boolean) => {
    setIsSecuriaAuthenticated(authenticated);
    if (authenticated && user?.id) {
      localStorage.setItem('securia_authenticated', 'true');
      localStorage.setItem('securia_user_id', user.id);
    } else {
      clearSecuriaSession();
    }
  };

  const clearSecuriaSession = () => {
    setIsSecuriaAuthenticated(false);
    localStorage.removeItem('securia_authenticated');
    localStorage.removeItem('securia_user_id');
  };

  const value = {
    isSecuriaAuthenticated,
    setSecuriaAuthenticated,
    clearSecuriaSession
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
