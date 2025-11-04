import React, { createContext, useContext, useMemo, useState } from 'react';

// The context exposes the authenticated user and helper actions so the UI
// can react to login/logout events without prop drilling.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Track the current user. The null default represents an anonymous visitor.
  const [user, setUser] = useState(null);

  // Memoise the context value so consumer components only re-render when the
  // user object actually changes.
  const value = useMemo(
    () => ({
      user,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null)
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider component.');
  }
  return context;
}
