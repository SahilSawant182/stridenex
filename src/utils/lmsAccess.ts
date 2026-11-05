/**
 * Utility to verify and enforce LMS Studio access based on role & subscription plans
 */

export async function checkLmsAccess(emailOverride?: string | null): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const role = localStorage.getItem("role")?.toLowerCase();

  // 1. PARTNER HAS NO PLANS: Partner users have NO plan restrictions
  if (role === "partner") {
    localStorage.setItem("has_lms_access", "true");
    localStorage.setItem("isInstructor", "true");
    return true;
  }

  // 2. Administrators always have 100% full access
  try {
    const rolesStr = localStorage.getItem("roles");
    if (rolesStr) {
      const parsed = rolesStr.startsWith("[") ? JSON.parse(rolesStr) : rolesStr;
      const isAdmin = Array.isArray(parsed)
        ? parsed.some((r: string) => ["administrator", "system manager"].includes(r.toLowerCase()))
        : /administrator|system manager/i.test(rolesStr);
      if (isAdmin) {
        localStorage.setItem("has_lms_access", "true");
        localStorage.setItem("isInstructor", "true");
        return true;
      }
    }
  } catch {}

  // 3. Fast-path check from cached localStorage if already authorized
  const cachedAccess = localStorage.getItem("has_lms_access") === "true";
  const cachedInstructor = localStorage.getItem("isInstructor") === "true";
  if (cachedAccess && cachedInstructor) {
    return true;
  }

  // 4. Verify with backend endpoint
  try {
    const userEmail =
      emailOverride ||
      localStorage.getItem("user") ||
      localStorage.getItem("email") ||
      localStorage.getItem("currentUser") ||
      "";

    const res = await fetch("/api/method/lms.lms.stride_lms.check_lms_access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userEmail }),
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    const hasAccess = Boolean(data?.message?.has_access);
    const isInstructor = Boolean(data?.message?.is_instructor ?? hasAccess);

    if (hasAccess) {
      localStorage.setItem("has_lms_access", "true");
      localStorage.setItem("isInstructor", isInstructor ? "true" : "false");
      return true;
    } else {
      localStorage.setItem("has_lms_access", "false");
      localStorage.setItem("isInstructor", "false");
      return false;
    }
  } catch (err) {
    console.error("Error checking LMS access:", err);
    return false;
  }
}

