import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aaradhya_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aaradhya_admin_token'));
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    async function verifySession() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            if (res.user.role !== 'admin') {
              throw new Error('Access denied: Admin role required.');
            }
            setUser(res.user);
            localStorage.setItem('aaradhya_admin_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    }

    verifySession();

    const handleAuthLogout = () => logout();
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (!res.success || !res.token) {
      throw new Error(res.message || 'Login failed');
    }

    if (res.user?.role !== 'admin') {
      throw new Error('Unauthorized: This dashboard is strictly for platform administrators.');
    }

    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('aaradhya_admin_token', res.token);
    localStorage.setItem('aaradhya_admin_user', JSON.stringify(res.user));
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('aaradhya_admin_token');
    localStorage.removeItem('aaradhya_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
