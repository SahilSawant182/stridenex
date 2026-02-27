"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchBackgroundImage, fetchProjectDetails } from "@/services/api.services";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AuthLayout from "../AuthLayout";
import { validateLoginForm } from "@/lib/validators";

export default function LoginPage() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("StrideNex");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/portal/dashboard");
    }
  }, [isAuthenticated, router]);

  const loginFields: FormField[] = [
    {
      fieldname: "username",
      label: "Email or Username",
      fieldtype: "Data",
      required: true,
      placeholder: "student@college.edu",
    },
    {
      fieldname: "password",
      label: "Password",
      fieldtype: "Password",
      required: true,
      placeholder: "••••••••",
    },
  ];

  const handleLogin = async (formData: any) => {
  // Validate form using the reusable validator
  const errors = validateLoginForm({
    username: formData.username,
    password: formData.password
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usr: formData.username,
          pwd: formData.password
        }),
      }
    );

    const data = await response.json();
    console.log("Login response:", data); // For debugging

    // Check if login was successful
    if (data.message === "Logged In") {
      const { api_key, api_secret } = data.key_details;
      const fullName = data.full_name || formData.username.split('@')[0];
      const email = data.user || formData.username;
      
      await login(api_key, api_secret, {
        email: email,
        fullName: fullName
      });

      router.push("/portal/dashboard");
    } else {
      // Handle error case
      const errorMessage = data.message || "Login failed";
      setError(errorMessage);
    }
  } catch (err) {
    setError("An error occurred during login");
    console.error(err);
  } finally {
    setLoading(false);
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
      <DynamicForm
        fields={loginFields}
        onSubmit={handleLogin}
        buttonLabel={loading ? "Signing in..." : "Sign In"}
        loading={loading}
      />

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={loading}
          />
          <Label htmlFor="remember" className="text-sm text-slate-600">
            Remember me
          </Label>
        </div>

        <Button
          type="button"
          variant="link"
          className="text-sm font-semibold p-0 h-auto text-accent hover:text-orange-600"
          disabled={loading}
        >
          Forgot password?
        </Button>
      </div>

      {/* <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 mb-2">Sign in as:</p>
        <div className="flex justify-center gap-3">
          <span className="text-xs px-2 py-1 bg-primary/5 text-primary rounded-full">Student</span>
          <span className="text-xs px-2 py-1 bg-accent/5 text-accent rounded-full">Institute</span>
          <span className="text-xs px-2 py-1 bg-emerald-500/5 text-emerald-600 rounded-full">Industry</span>
        </div>
      </div> */}
    </AuthLayout>
  );
}