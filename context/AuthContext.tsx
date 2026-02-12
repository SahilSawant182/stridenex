"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  apiKey: string | null;
  apiSecret: string | null;
  login: (key: string, secret: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("apiKey");
    const secret = localStorage.getItem("apiSecret");

    if (key && secret) {
      setApiKey(key);
      setApiSecret(secret);
    }
  }, []);

  const login = (key: string, secret: string) => {
    setApiKey(key);
    setApiSecret(secret);
    localStorage.setItem("apiKey", key);
    localStorage.setItem("apiSecret", secret);
  };

  const logout = () => {
    setApiKey(null);
    setApiSecret(null);
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
  };

  return (
    <AuthContext.Provider value={{ apiKey, apiSecret, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};