/**
 * Utility to verify and enforce LMS Studio access based on role & subscription plans
 */

export async function checkLmsAccess(emailOverride?: string | null): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const role = (localStorage.getItem("role") || "").toLowerCase();
  const rolesStr = (localStorage.getItem("roles") || "").toLowerCase();

  // 1. PARTNER HAS NO PLANS: Partner users have NO plan restrictions and 100% free full authoring
  if (role.includes("partner") || rolesStr.includes("partner")) {
    localStorage.setItem("has_lms_access", "true");
    localStorage.setItem("isInstructor", "true");
    document.cookie = "has_lms_access=true; path=/";
    return true;
  }

  // 2. Administrators always have 100% full access
  try {
    const rawRoles = localStorage.getItem("roles");
    if (rawRoles) {
      const parsed = rawRoles.startsWith("[") ? JSON.parse(rawRoles) : rawRoles;
      const isAdmin = Array.isArray(parsed)
        ? parsed.some((r: string) => ["administrator", "system manager"].includes(r.toLowerCase()))
        : /administrator|system manager/i.test(rawRoles);
      if (isAdmin) {
        localStorage.setItem("has_lms_access", "true");
        localStorage.setItem("isInstructor", "true");
        document.cookie = "has_lms_access=true; path=/";
        return true;
      }
    }
  } catch {}

  // 3. For College, Industry, Mentor and other accounts: Live backend verification
  // Do NOT permanently trust stale localStorage cache
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
      document.cookie = "has_lms_access=true; path=/";
      return true;
    } else {
      localStorage.setItem("has_lms_access", "false");
      localStorage.setItem("isInstructor", "false");
      document.cookie = "has_lms_access=false; path=/";
      return false;
    }
  } catch (err) {
    console.error("Error checking LMS access:", err);
    return false;
  }
}

