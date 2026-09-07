"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AuthLayout from "../AuthLayout";
import { validateLoginForm } from "@/lib/validators";

/**
 * Onboarding completion thresholds per role.
 *
 *   student  →  flag >= 2  (2 steps)
 *   mentor   →  flag >= 3  (3 steps)
 *   industry →  flag >= 3  (3 meaningful steps)
 *   college  →  flag >= 4  (4 steps)
 *
 * This single source-of-truth is used both here (post-login routing) and
 * in each onboarding component so the thresholds are never out of sync.
 */
const ONBOARDING_COMPLETE: Record<string, number> = {
  student: 2,
  mentor: 3,
  industry: 3,
  college: 4
};

function isFullyOnboarded(role: string, flag: number): boolean {
  const threshold = ONBOARDING_COMPLETE[role] ?? 1;
  return flag >= threshold;
}

export default function LoginPage() {
  const [appName] = useState<string>("StrideNex");
  const [bgImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isAuthenticated, login, role, isOnboarded } = useAuth();
  const router = useRouter();

  // ─── Post-login / page-load routing ──────────────────────────────────────────
  useEffect(() => {
    // Wait until all auth state is populated
    if (
      !isAuthenticated ||
      !role ||
      isOnboarded === null ||
      isOnboarded === undefined
    )
      return;

    const flag = parseInt(isOnboarded, 10);

    if (isFullyOnboarded(role, flag)) {
      // Fully onboarded → go straight to dashboard
      router.push(`/${role}/dashboard`);
    } else {
      // Not yet fully onboarded → resume the onboarding flow.
      // Each onboarding component reads `isOnboarded` from context and
      // resumes at the correct step automatically.
      router.push(`/onboarding/${role}`);
    }
  }, [isAuthenticated, role, isOnboarded, router]);

  // ─── Form fields ──────────────────────────────────────────────────────────────
  const loginFields: FormField[] = [
    {
      fieldname: "username",
      label: "Email or Username",
      fieldtype: "Data",
      required: true,
      placeholder: "student@college.edu"
    },
    {
      fieldname: "password",
      label: "Password",
      fieldtype: "Password",
      required: true,
      placeholder: "••••••••"
    }
  ];

  const handleFormChange = (data: any) => {
    setFormValues(data);
  };

  // ─── Login handler ────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    const errors = validateLoginForm({
      username: formValues.username,
      password: formValues.password
    });

    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}method/stridenex_app.api_stridenex_app.app.login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usr: formValues.username,
            pwd: formValues.password
          })
        }
      );

      const data = await response.json();

      if (data.message === "Logged In") {
        const { api_key, api_secret } = data.key_details;
        const fullName =
          data.full_name ||
          formValues.username.split("@")[0];
        const email = data.user || formValues.username;

        // ── Role resolution ────────────────────────────────────────────────
        let userRole = "student";

        if (data.roles && Array.isArray(data.roles)) {
          const lowerRoles = data.roles.map((r: string) =>
            r.toLowerCase()
          );
          if (
            lowerRoles.some((r: string) => r.includes("college"))
          ) {
            userRole = "college";
          } else if (
            lowerRoles.some((r: string) =>
              r.includes("industry")
            )
          ) {
            userRole = "industry";
          } else if (
            lowerRoles.some((r: string) => r.includes("mentor"))
          ) {
            userRole = "mentor";
          } else if (
            lowerRoles.some((r: string) =>
              r.includes("student")
            )
          ) {
            userRole = "student";
          }
        } else if (data.role) {
          const r = data.role.toLowerCase();
          if (r.includes("college") || r.includes("admin")) {
            userRole = "college";
          } else if (r.includes("industry")) {
            userRole = "industry";
          } else if (r.includes("mentor")) {
            userRole = "mentor";
          } else if (r.includes("student")) {
            userRole = "student";
          }
        }

        /**
         * Persist auth — navigation is intentionally NOT triggered here.
         * The useEffect above watches [isAuthenticated, role, isOnboarded]
         * and handles ALL routing after `login()` updates context.
         *
         * This means:
         *  • A fully-onboarded mentor (flag=3) → /mentor/dashboard
         *  • A mid-onboarding mentor (flag=1) → /onboarding/mentor  (step 2)
         *  • A brand-new mentor (flag=0) → /onboarding/mentor        (step 1)
         */
        await login(api_key, api_secret, {
          email,
          fullName,
          role: userRole,
          isOnboarded: data.is_onboarded,
          userImage: data.user_image
        });

        if (userRole === "college") {
          try {
            const { getCollegeDetails } = await import("@/services/college.services");
            const res = await getCollegeDetails(email);
            const collegeDataObj = res?.data || res?.message?.data || res?.message;
            if (collegeDataObj && typeof collegeDataObj === 'object') {
              localStorage.setItem("collegeDetails", JSON.stringify(collegeDataObj));
            }
          } catch (err) {
            console.error("Failed to pre-fetch collegeDetails on login:", err);
          }
        }

        // Do NOT call router.push here — useEffect owns all routing.
      } else {
        const msg = data.message || "Login failed";
        setError(
          typeof msg === "string" ? msg : JSON.stringify(msg)
        );
        setLoading(false);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred during login";
      setError(
        typeof msg === "string" ? msg : JSON.stringify(msg)
      );
      console.error(err);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !/^\S+@\S+\.\S+$/.test(forgotPasswordEmail)) {
      setForgotPasswordError("Please enter a valid email address.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");
    setForgotPasswordSuccess(false);

    try {
      const response = await fetch(
        `${BASE_URL}method/stridenex_app.api_stridenex_app.app.forgot_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: forgotPasswordEmail
          })
        }
      );

      const data = await response.json();
      
      if (response.ok && data?.message === "Password reset instructions have been sent to your email") {
        setForgotPasswordSuccess(true);
        setResendCooldown(60);
      } else if (response.ok && data?.message) {
         setForgotPasswordSuccess(true);
         setResendCooldown(60);
      } else {
        setForgotPasswordError(data?.message || "Failed to send password reset email.");
      }
    } catch (err: any) {
      setForgotPasswordError(err?.message || "An error occurred.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue your skill development journey"
      alternateText="Don't have an account?"
      alternateLinkText="Create account"
      alternateLinkHref="/signup"
      appName={appName}
      bgImage={bgImage}
    >
      <div className="space-y-5">
        <DynamicForm
          fields={loginFields}
          onSubmit={() => { }}
          buttonLabel=""
          loading={loading}
          onChange={handleFormChange}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={checked =>
                setRememberMe(checked as boolean)
              }
              disabled={loading}
            />
            <Label
              htmlFor="remember"
              className="text-sm text-slate-600"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="button"
            variant="link"
            className="text-sm font-semibold p-0 h-auto text-accent hover:text-orange-600"
            disabled={loading}
            onClick={() => {
              if (formValues?.username) {
                setForgotPasswordEmail(formValues.username);
              }
              setShowForgotPasswordModal(true);
            }}
          >
            Forgot password?
          </Button>
        </div>

        <Button
          type="button"
          variant="accent"
          className="w-full"
          loading={loading}
          disabled={loading}
          onClick={handleLogin}
        >
          Sign In
        </Button>
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showForgotPasswordModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={() => !forgotPasswordLoading && setShowForgotPasswordModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-xl relative z-[101] overflow-hidden flex flex-col"
              >
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Reset Password</h3>
                  <button
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    disabled={forgotPasswordLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  {forgotPasswordSuccess ? (
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900">Email Sent!</h4>
                      <p className="text-slate-600 text-sm">
                        We've sent a password reset link to <span className="font-semibold">{forgotPasswordEmail}</span>. Please check your inbox.
                      </p>
                      {forgotPasswordError && (
                        <p className="text-red-500 text-sm mt-2">{forgotPasswordError}</p>
                      )}
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowForgotPasswordModal(false)}
                        >
                          Close
                        </Button>
                        <Button
                          type="button"
                          variant="accent"
                          className="flex-1"
                          disabled={resendCooldown > 0 || forgotPasswordLoading}
                          loading={forgotPasswordLoading}
                          onClick={handleForgotPassword}
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-slate-600 text-sm">
                        Enter your email address and we'll send you a link to reset your password.
                      </p>
                      <div className="space-y-1">
                        <Label htmlFor="reset-email">Email Address</Label>
                        <input
                          id="reset-email"
                          type="email"
                          className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="you@example.com"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        />
                      </div>
                      {forgotPasswordError && (
                        <p className="text-red-500 text-sm">{forgotPasswordError}</p>
                      )}
                      <Button
                        type="button"
                        variant="accent"
                        className="w-full mt-2"
                        loading={forgotPasswordLoading}
                        disabled={forgotPasswordLoading}
                        onClick={handleForgotPassword}
                      >
                        Send Reset Link
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </AuthLayout>
  );
}