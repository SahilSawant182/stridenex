"use client";

import React, { createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const showToast = useCallback((message: string, type: ToastType) => {
    // Only show native alerts for errors/warnings as requested
    if (type === "error" || type === "warning") {
      window.alert(message);
    } else {
      // Just log success messages to console instead of alerting the user
      console.log(`[Notification] ${type}: ${message}`);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
