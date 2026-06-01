"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-white/90 border-emerald-100/80 dark:bg-slate-900/90 dark:border-emerald-900/50",
          iconColor: "text-emerald-500",
          textColor: "text-emerald-950 dark:text-emerald-50",
          borderColor: "border-l-emerald-500 border-l-4",
          Icon: CheckCircle,
        };
      case "error":
        return {
          bg: "bg-white/90 border-rose-100/80 dark:bg-slate-900/90 dark:border-rose-900/50",
          iconColor: "text-rose-500",
          textColor: "text-rose-950 dark:text-rose-50",
          borderColor: "border-l-rose-500 border-l-4",
          Icon: AlertCircle,
        };
      case "warning":
        return {
          bg: "bg-white/90 border-amber-100/80 dark:bg-slate-900/90 dark:border-amber-900/50",
          iconColor: "text-amber-500",
          textColor: "text-amber-950 dark:text-amber-50",
          borderColor: "border-l-amber-500 border-l-4",
          Icon: AlertTriangle,
        };
      case "info":
      default:
        return {
          bg: "bg-white/90 border-blue-100/80 dark:bg-slate-900/90 dark:border-blue-900/50",
          iconColor: "text-blue-500",
          textColor: "text-blue-950 dark:text-blue-50",
          borderColor: "border-l-blue-500 border-l-4",
          Icon: Info,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full p-4">
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            const ToastIcon = styles.Icon;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${styles.bg} ${styles.borderColor} overflow-hidden`}
              >
                <ToastIcon className={`w-5 h-5 mt-0.5 shrink-0 ${styles.iconColor}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold leading-relaxed ${styles.textColor}`}>
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
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
