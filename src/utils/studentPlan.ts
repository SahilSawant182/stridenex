"use client";

import { getUserSubscriptionDashboard } from "@/services/common.services";
import { useState, useEffect } from "react";

/**
 * Checks whether the student has an active paid subscription plan.
 */
export const isStudentPlanActive = (dashboardData: any): boolean => {
  if (!dashboardData) return false;

  // 1. Check active_subscription
  if (
    dashboardData.active_subscription &&
    dashboardData.active_subscription.is_active !== false &&
    String(dashboardData.active_subscription.payment_status || "").toLowerCase() !== "unpaid" &&
    String(dashboardData.active_subscription.payment_status || "").toLowerCase() !== "failed"
  ) {
    return true;
  }

  // 2. Check summary active_subscription
  if (
    dashboardData.summary?.active_subscription === true &&
    dashboardData.summary?.current_package &&
    !String(dashboardData.summary.current_package).toLowerCase().includes("free")
  ) {
    return true;
  }

  // 3. Check history for paid & active packages
  if (Array.isArray(dashboardData.history)) {
    const hasPaidActiveInHistory = dashboardData.history.some(
      (item: any) =>
        item.is_active !== false &&
        String(item.payment_status || "").toLowerCase() === "paid"
    );
    if (hasPaidActiveInHistory) return true;
  }

  return false;
};

/**
 * Fetches the user subscription dashboard, determines plan status, and caches it in localStorage.
 */
export const fetchAndCacheStudentPlanStatus = async (): Promise<boolean> => {
  try {
    const res = await getUserSubscriptionDashboard();
    const isActive = isStudentPlanActive(res);
    if (typeof window !== "undefined") {
      localStorage.setItem("has_active_student_plan", isActive ? "true" : "false");
      window.dispatchEvent(
        new CustomEvent("student-plan-updated", { detail: { isActive } })
      );
    }
    return isActive;
  } catch (err) {
    console.error("Error fetching student plan status:", err);
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("has_active_student_plan");
      if (cached !== null) {
        return cached === "true";
      }
    }
    return false;
  }
};

/**
 * Returns cached plan status from localStorage, or null if not yet determined.
 */
export const getCachedStudentPlanStatus = (): boolean | null => {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem("has_active_student_plan");
  if (cached === null) return null;
  return cached === "true";
};

/**
 * React hook to observe student plan status in real time.
 */
export function useStudentPlan() {
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(() => {
    return getCachedStudentPlanStatus();
  });
  const [loading, setLoading] = useState<boolean>(hasActivePlan === null);

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const active = await fetchAndCacheStudentPlanStatus();
        if (isMounted) {
          setHasActivePlan(active);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    };

    check();

    const handleUpdate = (e: any) => {
      if (e?.detail?.isActive !== undefined) {
        setHasActivePlan(e.detail.isActive);
      } else {
        setHasActivePlan(getCachedStudentPlanStatus());
      }
      setLoading(false);
    };

    window.addEventListener("student-plan-updated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("student-plan-updated", handleUpdate);
    };
  }, []);

  return { hasActivePlan, loading };
}
