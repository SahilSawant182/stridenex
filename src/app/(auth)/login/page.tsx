"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Eye, EyeOff, Mail, Lock, ArrowRight, RotateCw } from "lucide-react";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AuthLayout from "../AuthLayout";
import { validateLoginForm } from "@/lib/validators";
import { sendEmailOTP, verifyEmailOTP } from "@/services/onboarding.services";
import { apiService } from "@/services/api.services";

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
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formValues, setFormValues] = useState<any>({});

  // ─── Forgot / Reset Password state ──────────────────────────────────────────
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetStep, setResetStep] = useState<"email" | "otp" | "password" | "success">("email");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
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
    // Wait until basic auth state is populated
    if (!isAuthenticated || !role) return;

    // Partner bypass: Partners do not have onboarding, so we skip the isOnboarded check
    if (role === "partner") {
      router.push(`/partner`);
      return;
    }

    // For other roles, we must wait for isOnboarded state
    if (isOnboarded === null || isOnboarded === undefined) return;

    const flag = parseInt(isOnboarded as string, 10);

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
            lowerRoles.some((r: string) => r.includes("partner"))
          ) {
            userRole = "partner";
          } else if (
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
          if (r.includes("partner")) {
            userRole = "partner";
          } else if (r.includes("college") || r.includes("admin")) {
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
         */
        await login(api_key, api_secret, {
          email,
          fullName,
          role: userRole,
          isOnboarded: data.is_onboarded,
          userImage: data.user_image
        });

        // Sync roles and instructor flag for LMS integration
        if (data.roles && Array.isArray(data.roles)) {
          localStorage.setItem("roles", JSON.stringify(data.roles));
        } else if (userRole === "mentor") {
          localStorage.setItem("roles", JSON.stringify(["Mentor", "Instructor", "Course Creator"]));
        }

        if (userRole === "mentor" || (data.roles && (data.roles.includes("Instructor") || data.roles.includes("Course Creator")))) {
          localStorage.setItem("isInstructor", "true");
        } else {
          localStorage.setItem("isInstructor", "false");
        }

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

  // ─── Password Rules Validation (Identical to Signup) ────────────────────────
  const passwordCriteria = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.uppercase &&
    passwordCriteria.lowercase &&
    passwordCriteria.number &&
    passwordCriteria.special &&
    passwordCriteria.match;

  // ─── Forgot Password Handlers ────────────────────────────────────────────────
  const handleOpenForgotPassword = () => {
    setForgotPasswordEmail("");
    setResetStep("email");
    setOtp("");
    setOtpSuccessMessage("");
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setForgotPasswordError("");
    setShowForgotPasswordModal(true);
  };

  const handleSendOtp = async () => {
    if (!forgotPasswordEmail || !/^\S+@\S+\.\S+$/.test(forgotPasswordEmail.trim())) {
      setForgotPasswordError("Please enter a valid email address.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      const response = await sendEmailOTP(forgotPasswordEmail.trim());
      if (
        response?.message?.status === "success" ||
        response?.message?.message === "OTP sent successfully" ||
        (response as any)?.message === "OTP sent successfully" ||
        (response as any)?.status === "success"
      ) {
        setResetStep("otp");
        setResendCooldown(60);
      } else if (response?.message) {
        setResetStep("otp");
        setResendCooldown(60);
      } else {
        setForgotPasswordError((response as any)?.message || "Failed to send OTP. Please check the email.");
      }
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP. Please try again.";
      setForgotPasswordError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length < 4) {
      setForgotPasswordError("Please enter the verification code sent to your email.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      const response = await verifyEmailOTP(forgotPasswordEmail.trim(), otp.trim());
      const msg = response?.message;
      const isSuccess =
        msg === "Email verified successfully" ||
        response?.status === 200 ||
        response?.data?.success === true ||
        (typeof msg === "string" && !msg.toLowerCase().includes("invalid"));

      if (isSuccess) {
        setForgotPasswordError("");
        const successMsg = typeof msg === "string" ? msg : "Email verified successfully";
        setOtpSuccessMessage(successMsg);
        setForgotPasswordLoading(false);
        setTimeout(() => {
          setResetStep("password");
          setOtpSuccessMessage("");
        }, 2000);
        return;
      } else {
        setForgotPasswordError(
          typeof msg === "string" ? msg : "Invalid OTP. Please check the code and try again."
        );
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid OTP. Please check the code and try again.";
      setForgotPasswordError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid) {
      if (!passwordCriteria.match) {
        setForgotPasswordError("Passwords do not match.");
      } else {
        setForgotPasswordError("Please satisfy all password security requirements.");
      }
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      await apiService.post(
        "method/stridenex_app.api_stridenex_app.app.reset_user_password",
        {
          user: forgotPasswordEmail.trim(),
          new_password: newPassword,
        }
      );

      // Synchronize in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("userEmail", forgotPasswordEmail.trim());
        localStorage.setItem("userPassword", newPassword);
      }

      setResetStep("success");
    } catch (err: any) {
      console.error("Error resetting password:", err);
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to reset password. Please try again.";
      setForgotPasswordError(typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg));
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleBackToLoginAfterSuccess = () => {
    setShowForgotPasswordModal(false);
    setFormValues((prev: any) => ({
      ...prev,
      username: forgotPasswordEmail.trim()
    }));
    setSuccessBanner("Password reset successfully! Please sign in with your new password.");
    setResetStep("email");
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
        {successBanner && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-emerald-700 text-sm font-medium">
              {successBanner}
            </p>
          </div>
        )}

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
              className="text-sm text-slate-600 cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="button"
            variant="link"
            className="text-sm font-semibold p-0 h-auto text-accent hover:text-orange-600"
            disabled={loading}
            onClick={handleOpenForgotPassword}
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
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={() => !forgotPasswordLoading && setShowForgotPasswordModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.2 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-[101] overflow-hidden flex flex-col border border-slate-100"
              >
                {/* Modal Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-accent flex items-center justify-center font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {resetStep === "password"
                          ? "Set New Password"
                          : resetStep === "success"
                          ? "Password Reset Done"
                          : "Reset Password"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {resetStep === "email" && "Step 1 of 3: Verification"}
                        {resetStep === "otp" && "Step 2 of 3: Enter OTP"}
                        {resetStep === "password" && "Step 3 of 3: Create Password"}
                        {resetStep === "success" && "Account security updated"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForgotPasswordModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                    disabled={forgotPasswordLoading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1">
                  <div
                    className="bg-accent h-1 transition-all duration-300"
                    style={{
                      width:
                        resetStep === "email"
                          ? "33%"
                          : resetStep === "otp"
                          ? "66%"
                          : "100%"
                    }}
                  />
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  {/* STEP 1: EMAIL INPUT */}
                  {resetStep === "email" && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Enter your registered email address. We will send a secure verification code (OTP) to your inbox.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reset-email" className="text-xs font-semibold text-slate-700">
                          Registered Email Address
                        </Label>
                        <div className="relative">
                          <Input
                            id="reset-email"
                            type="email"
                            className="pl-10 h-11 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-accent"
                            placeholder="name@college.edu"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            autoCapitalize="none"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        </div>
                      </div>

                      {forgotPasswordError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                          <p className="text-red-600 text-xs font-medium text-center">
                            {forgotPasswordError}
                          </p>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="accent"
                        className="w-full h-11 text-sm font-semibold shadow-md shadow-accent/20"
                        loading={forgotPasswordLoading}
                        disabled={forgotPasswordLoading || !forgotPasswordEmail.trim()}
                        onClick={handleSendOtp}
                      >
                        Send OTP
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  )}

                  {/* STEP 2: OTP INPUT */}
                  {resetStep === "otp" && (
                    <div className="space-y-4">
                      <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">OTP Sent</span>
                          <button
                            type="button"
                            onClick={() => {
                              setResetStep("email");
                              setForgotPasswordError("");
                            }}
                            className="text-accent hover:underline text-xs font-semibold"
                            disabled={forgotPasswordLoading}
                          >
                            Change Email
                          </button>
                        </div>
                        <p className="text-slate-600 truncate">
                          Code sent to: <span className="font-semibold text-slate-900">{forgotPasswordEmail}</span>
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="otp-input" className="text-xs font-semibold text-slate-700">
                          Enter Verification Code (OTP)
                        </Label>
                        <Input
                          id="otp-input"
                          type="text"
                          maxLength={6}
                          className="h-12 text-center text-xl tracking-[0.3em] font-semibold bg-slate-50/50 border-slate-200 focus-visible:ring-accent"
                          placeholder="••••••"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/[^0-9a-zA-Z]/g, ""))}
                          autoFocus
                        />
                      </div>

                      {otpSuccessMessage && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <p className="text-emerald-700 text-xs font-semibold">
                            {otpSuccessMessage}
                          </p>
                        </div>
                      )}

                      {forgotPasswordError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                          <p className="text-red-600 text-xs font-medium text-center">
                            {forgotPasswordError}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-500">Didn&apos;t receive code?</span>
                        <button
                          type="button"
                          className="font-semibold text-accent hover:text-orange-600 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center gap-1"
                          disabled={resendCooldown > 0 || forgotPasswordLoading || !!otpSuccessMessage}
                          onClick={handleSendOtp}
                        >
                          <RotateCw className={`w-3 h-3 ${forgotPasswordLoading ? "animate-spin" : ""}`} />
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                        </button>
                      </div>

                      <Button
                        type="button"
                        variant={otpSuccessMessage ? "outline" : "accent"}
                        className={`w-full h-11 text-sm font-semibold ${otpSuccessMessage ? "border-emerald-500 text-emerald-700 bg-emerald-50" : "shadow-md shadow-accent/20"}`}
                        loading={forgotPasswordLoading}
                        disabled={forgotPasswordLoading || otp.trim().length < 4 || !!otpSuccessMessage}
                        onClick={handleVerifyOtp}
                      >
                        {otpSuccessMessage ? "Verified Successfully!" : "Verify OTP"}
                        {!otpSuccessMessage && <ArrowRight className="w-4 h-4 ml-1.5" />}
                      </Button>
                    </div>
                  )}

                  {/* STEP 3: NEW PASSWORD & CONFIRM PASSWORD */}
                  {resetStep === "password" && (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Create a strong password that you haven&apos;t used before.
                      </p>

                      {/* New Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="new-password" className="text-xs font-semibold text-slate-700">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            className="pr-10 h-11 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-accent"
                            placeholder="Create a strong password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <Label htmlFor="confirm-password" className="text-xs font-semibold text-slate-700">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            className="pr-10 h-11 text-sm bg-slate-50/50 border-slate-200 focus-visible:ring-accent"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Password Requirements Checklist (Identical to Signup) */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                        <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                          Password Requirements
                        </p>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.length ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.length && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>8+ characters</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.uppercase ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.uppercase ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.uppercase && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>1 uppercase (A-Z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.lowercase ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.lowercase ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.lowercase && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>1 lowercase (a-z)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.number ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.number && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>1 number (0-9)</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.special ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.special ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.special && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>1 special character</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${passwordCriteria.match ? "text-emerald-600 font-medium" : "text-slate-500"}`}>
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${passwordCriteria.match ? "bg-emerald-100 text-emerald-600" : "bg-slate-200"}`}>
                              {passwordCriteria.match && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span>Passwords match</span>
                          </div>
                        </div>
                      </div>

                      {forgotPasswordError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
                          <p className="text-red-600 text-xs font-medium text-center">
                            {forgotPasswordError}
                          </p>
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="accent"
                        className="w-full h-11 text-sm font-semibold shadow-md shadow-accent/20"
                        loading={forgotPasswordLoading}
                        disabled={forgotPasswordLoading || !isPasswordValid}
                        onClick={handleResetPassword}
                      >
                        Reset Password & Sign In
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </div>
                  )}

                  {/* STEP 4: SUCCESS */}
                  {resetStep === "success" && (
                    <div className="text-center space-y-4 py-2">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Check className="w-7 h-7 stroke-[2.5]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-900">
                          Password Reset Successfully!
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                          Your new password has been set. You can now use it to sign in to your StrideNex account.
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="accent"
                        className="w-full h-11 text-sm font-semibold shadow-md shadow-accent/20"
                        onClick={handleBackToLoginAfterSuccess}
                      >
                        Back to Sign In
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