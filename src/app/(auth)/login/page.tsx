"use client";

import { useEffect, useState } from "react";
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
  const [formValues, setFormValues] = useState<any>({});
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { isAuthenticated, login, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      const dashboardRole = role || "student";
      router.push(`/${dashboardRole}/dashboard`);
    }
  }, [isAuthenticated, router, role]);


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

  const handleFormChange = (data: any) => {
    setFormValues(data);
  };

  const handleLogin = async () => {
    const formData = formValues;

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
      console.log("Login response:", data);

      if (data.message === "Logged In") {
        const { api_key, api_secret } = data.key_details;
        const fullName = data.full_name || formData.username.split('@')[0];
        const email = data.user || formData.username;

        let userRole = 'student';

        if (data.roles && Array.isArray(data.roles)) {
          const lowerRoles: string[] = data.roles.map((r: string) => r.toLowerCase());

          if (lowerRoles.some((r: string) => r.includes('college'))) {
            userRole = 'college';
          } else if (lowerRoles.some((r: string) => r.includes('industry'))) {
            userRole = 'industry';
          } else if (lowerRoles.some((r: string) => r.includes('mentor'))) {
            userRole = 'mentor';
          } else if (lowerRoles.some((r: string) => r.includes('student'))) {
            userRole = 'student';
          }
        } else if (data.role) {
          const r = data.role.toLowerCase();
          if (r.includes('college') || r.includes('admin')) {
            userRole = 'college';
          } else if (r.includes('industry')) {
            userRole = 'industry';
          } else if (r.includes('mentor')) {
            userRole = 'mentor';
          } else if (r.includes('student')) {
            userRole = 'student';
          }
        }

        await login(api_key, api_secret, {
          email: email,
          fullName: fullName,
          role: userRole
        });
        router.push(`/${userRole}/dashboard`);
      } else {
        const msg = data.message || "Login failed";
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        setLoading(false);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "An error occurred during login";
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      console.error(err);
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
      <div className="space-y-5">
        <DynamicForm
          fields={loginFields}
          onSubmit={() => { }} // Empty onSubmit
          buttonLabel="" // No button from DynamicForm
          loading={loading}
          onChange={handleFormChange}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
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
    </AuthLayout>
  );
}