import { createContext, useContext, useState, useCallback } from 'react';
import { getAdminPassword } from './StoreContext';

const SESSION_KEY = 'vitrine_admin_session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  const login = useCallback((password) => {
    if (password === getAdminPassword()) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
