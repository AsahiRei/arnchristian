"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  loading: true,
});

const AUTH_KEY = "arnchristian_admin_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored === "true") {
        setIsAuthenticated(true);
      }
    } catch {
      // sessionStorage not available
    }
    setLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const envUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (username === envUser && password === envPass) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem(AUTH_KEY, "true");
      } catch {
        // sessionStorage not available
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      // sessionStorage not available
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
