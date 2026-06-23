"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { apiService } from "@/services/api.services";

//Types

export interface FeatureEntitlement {
  limit: number | "Unlimited";
  used: number;
  remaining: number | "Unlimited";
}

export type EntitlementsMap = Record<string, FeatureEntitlement>;

interface EntitlementContextType {
  entitlements: EntitlementsMap;
  loading: boolean;
  checkAndConsume: (featureCode: string) => Promise<true>;
  refreshEntitlements: () => Promise<void>;
  hasQuota: (featureCode: string) => boolean;
  getRemaining: (featureCode: string) => number | "Unlimited" | null;
}

export class QuotaExceededError extends Error {
  featureCode: string;
  constructor(featureCode: string) {
    super(`Quota exhausted for feature: ${featureCode}`);
    this.name = "QuotaExceededError";
    this.featureCode = featureCode;
  }
}

// Context
const EntitlementContext = createContext<EntitlementContextType | undefined>(
  undefined
);

// API helpers

const fetchEntitlements = async (): Promise<EntitlementsMap> => {
  const data = await apiService.get(
    "method/quantbit_billing_platform.quantbit_billing_platform.api.get_user_entitlements"
  );
  // Response shape: { message: { feature_code: { limit, used, remaining } } }
  return (data?.message ?? {}) as EntitlementsMap;
};

const postConsumeQuota = async (featureCode: string): Promise<void> => {
  // The backend throws HTTP 417 when the quota is exhausted.
  // apiService already re-throws errors with a `.status` property.
  const data = await apiService.post(
    "method/quantbit_billing_platform.quantbit_billing_platform.api.consume_quota",
    { feature_code: featureCode }
  );

  if (data?.message?.status !== "success") {
    throw new Error(`consume_quota returned unexpected status for ${featureCode}`);
  }
};

// Provider
export const EntitlementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [entitlements, setEntitlements] = useState<EntitlementsMap>({});
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const refreshEntitlements = useCallback(async () => {
    try {
      const data = await fetchEntitlements();
      if (isMounted.current) setEntitlements(data);
    } catch (err) {
      console.error("[EntitlementContext] Failed to fetch entitlements:", err);
    }
  }, []);

  // Fetch on mount (only if a user is logged in)
  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    refreshEntitlements().finally(() => {
      if (isMounted.current) setLoading(false);
    });
  }, [refreshEntitlements]);

  const hasQuota = useCallback(
    (featureCode: string): boolean => {
      const ent = entitlements[featureCode];
      if (!ent) return true; // Unknown feature → optimistically allow
      if (ent.remaining === "Unlimited") return true;
      return (ent.remaining as number) > 0;
    },
    [entitlements]
  );

  const getRemaining = useCallback(
    (featureCode: string): number | "Unlimited" | null => {
      const ent = entitlements[featureCode];
      if (!ent) return null;
      return ent.remaining;
    },
    [entitlements]
  );

  const checkAndConsume = useCallback(
    async (featureCode: string): Promise<true> => {
      // 1. Refresh entitlements so we have the freshest data
      await refreshEntitlements();

      // 2. Optimistic local check (avoids an extra round-trip in obvious cases)
      const ent = entitlements[featureCode];
      if (ent && ent.remaining !== "Unlimited" && (ent.remaining as number) <= 0) {
        throw new QuotaExceededError(featureCode);
      }

      // 3. Let the backend be the source of truth (it sends 417 on exhaustion)
      try {
        await postConsumeQuota(featureCode);
      } catch (err: any) {
        // HTTP 417 = quota exhausted (by backend contract)
        if (err?.status === 417) {
          // Refresh so the UI reflects the exhausted state immediately
          await refreshEntitlements();
          throw new QuotaExceededError(featureCode);
        }
        throw err; // Re-throw other errors unchanged
      }

      // 4. Refresh state so the displayed counts are up-to-date
      await refreshEntitlements();
      return true;
    },
    [entitlements, refreshEntitlements]
  );

  return (
    <EntitlementContext.Provider
      value={{
        entitlements,
        loading,
        checkAndConsume,
        refreshEntitlements,
        hasQuota,
        getRemaining,
      }}
    >
      {children}
    </EntitlementContext.Provider>
  );
};

// Hook
export const useEntitlements = () => {
  const ctx = useContext(EntitlementContext);
  if (!ctx) {
    throw new Error("useEntitlements must be used within an EntitlementProvider");
  }
  return ctx;
};
