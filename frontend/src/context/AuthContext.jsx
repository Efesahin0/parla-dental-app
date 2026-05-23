import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('parla_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('parla_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function loadMe() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest('/auth/me');
        setUser(data.user);
        localStorage.setItem('parla_user', JSON.stringify(data.user));
      } catch {
        localStorage.removeItem('parla_token');
        localStorage.removeItem('parla_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [token]);

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('parla_token', data.token);
    localStorage.setItem('parla_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);

    return data.user;
  }

  function logout() {
    localStorage.removeItem('parla_token');
    localStorage.removeItem('parla_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(token && user)
  }), [token, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
