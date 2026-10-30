"use client";

import { BASE_URL, getProfilePicture } from "@/services/api.services";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  apiKey: string | null;
  apiSecret: string | null;
  isAuthenticated: boolean;
  currentUser: string | null;
  fullName: string | null;
  role: string | null;
  userImage: string | null;
  login: (
    key: string,
    secret: string,
    userData?: {
      email?: string;
      fullName?: string;
      role?: string;
      isOnboarded?: string;
      userImage?: string | null;
    }
  ) => Promise<void>;
  logout: (redirectPath?: string) => void;
  isInitialized: boolean;
  getCurrentUser: () => Promise<string | null>;
  isOnboarded: string | null;
  updateOnboardedFlag: (flag: string) => void;
  updateUserImage: (url: string | null) => void;
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
  const [userImage, setUserImage] = useState<string | null>(null);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    const storedSecret = localStorage.getItem("apiSecret");
    const storedUser = localStorage.getItem("currentUser");
    const storedFullName = localStorage.getItem("fullName");
    const storedRole = localStorage.getItem("role");
    const storedOnboarded = localStorage.getItem("isOnboarded");

    const validKey = storedKey && storedKey !== "undefined" && storedKey !== "null" && storedKey.trim() !== "" ? storedKey.trim() : null;
    const validSecret = storedSecret && storedSecret !== "undefined" && storedSecret !== "null" && storedSecret.trim() !== "" ? storedSecret.trim() : null;

    if (validKey && validSecret) {
      setApiKey(validKey);
      setApiSecret(validSecret);
      setIsAuthenticated(true);
    } else {
      if (storedKey === "undefined" || storedKey === "null") localStorage.removeItem("apiKey");
      if (storedSecret === "undefined" || storedSecret === "null") localStorage.removeItem("apiSecret");
      setApiKey(null);
      setApiSecret(null);
      setIsAuthenticated(false);
    }

    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      setCurrentUser(storedUser);
    }

    if (storedFullName && storedFullName !== "undefined" && storedFullName !== "null") {
      setFullName(storedFullName);
    }

    if (storedRole && storedRole !== "undefined" && storedRole !== "null") {
      setRole(storedRole);
    }

    if (storedOnboarded && storedOnboarded !== "undefined" && storedOnboarded !== "null") {
      setIsOnboarded(storedOnboarded);
    }

    const storedUserImage = localStorage.getItem("userImage");
    if (storedUserImage && storedUserImage !== "undefined" && storedUserImage !== "null") {
      setUserImage(storedUserImage);
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

  // Auto-fetch profile picture if authenticated to keep in sync with DB
  useEffect(() => {
    let isMounted = true;

    if (apiKey && apiSecret && isInitialized) {
      getProfilePicture().then((imgUrl) => {
        if (isMounted) {
          setUserImage(imgUrl);
          if (imgUrl) {
            localStorage.setItem("userImage", imgUrl);
          } else {
            localStorage.removeItem("userImage");
          }
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey, apiSecret, isInitialized]);

  const getCurrentUser = async (): Promise<string | null> => {
    const validKey = apiKey && apiKey !== "undefined" && apiKey !== "null" ? apiKey : null;
    const validSecret = apiSecret && apiSecret !== "undefined" && apiSecret !== "null" ? apiSecret : null;
    if (!validKey || !validSecret) return null;

    try {
      const response = await fetch(
        `${BASE_URL}method/frappe.auth.get_logged_user`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `token ${validKey}:${validSecret}`,
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
      console.warn("Error fetching current user:", error);
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
      isOnboarded?: string;
      userImage?: string | null;
    }
  ) => {
    try {
      const cleanKey = key && key !== "undefined" && key !== "null" ? key.trim() : null;
      const cleanSecret = secret && secret !== "undefined" && secret !== "null" ? secret.trim() : null;

      if (cleanKey && cleanSecret) {
        setApiKey(cleanKey);
        setApiSecret(cleanSecret);
        setIsAuthenticated(true);
        localStorage.setItem("apiKey", cleanKey);
        localStorage.setItem("apiSecret", cleanSecret);
      } else {
        setApiKey(null);
        setApiSecret(null);
        localStorage.removeItem("apiKey");
        localStorage.removeItem("apiSecret");
      }

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

        if (userData.userImage !== undefined) {
          const imgVal = userData.userImage || null;
          setUserImage(imgVal);
          if (imgVal) {
            localStorage.setItem("userImage", imgVal);
          } else {
            localStorage.removeItem("userImage");
          }
        }
      } else {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          localStorage.setItem("currentUser", user);
        }
      }
    } catch (error) {
      console.warn("Error during login:", error);

      setApiKey(null);
      setApiSecret(null);
      setIsAuthenticated(false);
      setFullName(null);
      setRole(null);
      setIsOnboarded(null); // ✅ ADD THIS
      setUserImage(null);

      localStorage.removeItem("apiKey");
      localStorage.removeItem("apiSecret");
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      localStorage.removeItem("isOnboarded"); // ✅ ADD THIS
      localStorage.removeItem("userImage");
    }
  };

  const updateOnboardedFlag = (flag: string) => {
    setIsOnboarded(flag);
    localStorage.setItem("isOnboarded", flag);
  };

  const updateUserImage = (url: string | null) => {
    setUserImage(url);
    if (url) {
      localStorage.setItem("userImage", url);
    } else {
      localStorage.removeItem("userImage");
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
      console.warn("Logout API error:", error);
    }

    // Clear state
    setApiKey(null);
    setApiSecret(null);
    setCurrentUser(null);
    setFullName(null);
    setIsAuthenticated(false);
    setIsOnboarded(null);
    setUserImage(null);

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
        userImage,
        login,
        logout,
        getCurrentUser,
        isInitialized,
        isOnboarded,
        updateOnboardedFlag,
        updateUserImage,
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