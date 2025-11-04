import { createContext, useEffect, useMemo, useState } from 'react';
import { getProfile, loginRequest, registerRequest } from '../services/authService.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const bootstrap = async () => {
      try {
        const profile = await getProfile(token);
        setUser(profile);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const login = async (credentials) => {
    const { token: newToken, user: profile } = await loginRequest(credentials);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(profile);
  };

  const register = async (payload) => {
    const { token: newToken, user: profile } = await registerRequest(payload);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, login, register, logout, isAuthenticated: Boolean(token), loading }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
