import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiGetCurrentUser, apiLogout } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // hydrating session

  // On mount — try to restore session from localStorage
  useEffect(() => {
    const hydrate = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const current = await apiGetCurrentUser();
        setUser(current);
      } catch (error) {
        console.error('Session hydration failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    hydrate();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const value = {
    user,
    loading,
    role: user?.role ?? null,
    isEmployee: user?.role === 'employee',
    isHR: user?.role === 'hr',
    isAdmin: user?.role === 'admin',
    isAdminOrHR: user?.role === 'admin' || user?.role === 'hr',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
