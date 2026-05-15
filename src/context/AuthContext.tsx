"use client";

import { BASE_URL } from "@/services/api.services";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  apiKey: string | null;
  apiSecret: string | null;
  isAuthenticated: boolean;
  currentUser: string | null;
  fullName: string | null;
  role: string | null;
  login: (
    key: string,
    secret: string,
    userData?: {
      email?: string;
      fullName?: string;
      role?: string;
      isOnboarded?: string;
    }
  ) => Promise<void>;
  logout: (redirectPath?: string) => void;
  isInitialized: boolean;
  getCurrentUser: () => Promise<string | null>;
  isOnboarded: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isOnboarded, setIsOnboarded] = useState<string | null>(null);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Load from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    const storedSecret = localStorage.getItem("apiSecret");
    const storedUser = localStorage.getItem("currentUser");
    const storedFullName = localStorage.getItem("fullName");
    const storedRole = localStorage.getItem("role");
    const storedOnboarded = localStorage.getItem("isOnboarded");

    if (storedKey && storedSecret) {
      setApiKey(storedKey);
      setApiSecret(storedSecret);
      setIsAuthenticated(true);
    }

    if (storedUser) {
      setCurrentUser(storedUser);
    }

    if (storedFullName) {
      setFullName(storedFullName);
    }

    if (storedRole) {
      setRole(storedRole);
    }

    if (storedOnboarded) {   // ✅ ADD THIS
      setIsOnboarded(storedOnboarded);
    }

    setIsInitialized(true);
  }, []);

  // Auto-fetch current user if authenticated but user not known
  useEffect(() => {
    let isMounted = true;

    if (apiKey && apiSecret && !currentUser && isInitialized) {
      getCurrentUser().then((user) => {
        if (isMounted && user) {
          setCurrentUser(user);
          localStorage.setItem("currentUser", user);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey, apiSecret, currentUser, isInitialized]);

  const getCurrentUser = async (): Promise<string | null> => {
    if (!apiKey || !apiSecret) return null;

    try {
      const response = await fetch(
        "http://103.219.1.138:4412/api/method/frappe.auth.get_logged_user",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `token ${apiKey}:${apiSecret}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message || null;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  const login = async (
    key: string,
    secret: string,
    userData?: {
      email?: string;
      fullName?: string;
      role?: string;
      isOnboarded?: string; // ✅ ADD THIS
    }
  ) => {
    try {
      setApiKey(key);
      setApiSecret(secret);
      setIsAuthenticated(true);

      localStorage.setItem("apiKey", key);
      localStorage.setItem("apiSecret", secret);

      if (userData) {
        if (userData.email) {
          setCurrentUser(userData.email);
          localStorage.setItem("currentUser", userData.email);
        }

        if (userData.fullName) {
          setFullName(userData.fullName);
          localStorage.setItem("fullName", userData.fullName);
        }

        if (userData.role) {
          setRole(userData.role);
          localStorage.setItem("role", userData.role);
        }

        if (userData.isOnboarded !== undefined) {   // ✅ ADD THIS
          setIsOnboarded(userData.isOnboarded);
          localStorage.setItem("isOnboarded", userData.isOnboarded);
        }
      } else {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          localStorage.setItem("currentUser", user);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);

      setApiKey(null);
      setApiSecret(null);
      setIsAuthenticated(false);
      setFullName(null);
      setRole(null);
      setIsOnboarded(null); // ✅ ADD THIS

      localStorage.removeItem("apiKey");
      localStorage.removeItem("apiSecret");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      localStorage.removeItem("isOnboarded"); // ✅ ADD THIS
    }
  };

  const logout = async (redirectPath: string = "/") => {
    try {
      if (apiKey && apiSecret) {
        await fetch(
          `${BASE_URL}method/stridenex_app.api_stridenex_app.app.logout`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `token ${apiKey}:${apiSecret}`,
            },
            credentials: "include",
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }

    // Clear state
    setApiKey(null);
    setApiSecret(null);
    setCurrentUser(null);
    setFullName(null);
    setIsAuthenticated(false);
    setIsOnboarded(null);

    // Clear localStorage
    localStorage.clear();

    // Use setTimeout to ensure state updates complete before redirect
    setTimeout(() => {
      // Force a hard navigation to the specified path
      window.location.href = redirectPath;
    }, 100);
  };

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        apiSecret,
        isAuthenticated,
        currentUser,
        fullName,
        role,
        login,
        logout,
        getCurrentUser,
        isInitialized,
        isOnboarded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};