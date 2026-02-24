"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  apiKey: string | null;
  apiSecret: string | null;
  isAuthenticated: boolean;
  currentUser: string | null;
  fullName: string | null;
  login: (key: string, secret: string, userData?: { email?: string; fullName?: string }) => Promise<void>;
  logout: () => void;
  isInitialized: boolean;
  getCurrentUser: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiSecret, setApiSecret] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    const storedSecret = localStorage.getItem("apiSecret");
    const storedUser = localStorage.getItem("currentUser");
    const storedFullName = localStorage.getItem("fullName");

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

  const login = async (key: string, secret: string, userData?: { email?: string; fullName?: string }) => {
    try {
      // Set state immediately
      setApiKey(key);
      setApiSecret(secret);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem("apiKey", key);
      localStorage.setItem("apiSecret", secret);

      // If userData is provided, use it
      if (userData) {
        if (userData.email) {
          setCurrentUser(userData.email);
          localStorage.setItem("currentUser", userData.email);
        }
        if (userData.fullName) {
          setFullName(userData.fullName);
          localStorage.setItem("fullName", userData.fullName);
        }
      } else {
        // Fallback: Fetch current user after login
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          localStorage.setItem("currentUser", user);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      // If error occurs, clean up
      setApiKey(null);
      setApiSecret(null);
      setIsAuthenticated(false);
      setFullName(null);
      localStorage.removeItem("apiKey");
      localStorage.removeItem("apiSecret");
      localStorage.removeItem("fullName");
    }
  };

  const logout = async () => {
    try {
      if (apiKey && apiSecret) {
        await fetch(
          "http://103.219.1.138:4412/api/method/logout",
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

    // Clear localStorage
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    localStorage.removeItem("posProfile");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("fullName");
    localStorage.removeItem("csrfToken");

    router.push("/login");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        apiKey, 
        apiSecret, 
        isAuthenticated, 
        currentUser, 
        fullName,
        login, 
        logout, 
        getCurrentUser,
        isInitialized,
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