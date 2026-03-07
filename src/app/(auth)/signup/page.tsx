"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/services/api.services";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/context/AuthContext";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("StrideNex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/portal/dashboard");
    }
  }, [isAuthenticated, router]);

  // Password validation function
  const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, message: "Password must contain at least one special character" };
    }
    return { isValid: true, message: "" };
  };

  // Update the form fields with custom input for password fields
  const signupFields: FormField[] = [
    {
      fieldname: "firstName",
      label: "First Name",
      fieldtype: "Data",
      required: true,
      placeholder: "Enter first name",
      layout: "half"
    },
    {
      fieldname: "lastName",
      label: "Last Name",
      fieldtype: "Data",
      required: true,
      placeholder: "Enter last name",
      layout: "half"
    },
    {
      fieldname: "email",
      label: "Email",
      fieldtype: "Data",
      required: true,
      placeholder: "name@college.edu",
    },
    {
      fieldname: "password",
      label: "Password",
      fieldtype: "Password",
      required: true,
      placeholder: "Create a password",
    },
    {
      fieldname: "confirmPassword",
      label: "Confirm Password",
      fieldtype: "Password",
      required: true,
      placeholder: "Confirm your password",
    },
  ];

  const handleFormChange = (data: any) => {
    setFormValues(data);
  };

  const handleSubmit = () => {
    // Use the stored form values
    const data = formValues || {};

    // Simple validation
    if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
      setError("All fields are required");
      return;
    }

    // Password strength validation
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the Terms of Service");
      return;
    }

    setLoading(true);
    setError("");

    // Call API
    fetch(`${BASE_URL}method/stridenex_app.api_stridenex_app.app.signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log("API Response:", responseData);
        if (responseData?.message === "User created successfully") {
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userFirstName", data.firstName);
          localStorage.setItem("userLastName", data.lastName);

          // Directly navigate to student onboarding
          router.push("/onboarding/student");
        } else {
          // Handle different error structures
          const errorMsg = responseData?.message ||
            responseData?.message?.error ||
            "Signup failed";
          setError(errorMsg);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("An error occurred during signup");
        setLoading(false);
      });
  };

  // Custom password input component for DynamicForm
  const PasswordInput = ({ field, value, onChange, showPassword, toggleShow }: any) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(e) => onChange(field.fieldname, e.target.value)}
        className="w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-all text-sm text-slate-900 placeholder:text-slate-400 border-slate-200 pr-10"
        required={field.required}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  // Override the Password field rendering in DynamicForm
  const renderPasswordField = (field: FormField, value: any, onChange: any) => {
    if (field.fieldname === "password") {
      return (
        <PasswordInput
          field={field}
          value={value}
          onChange={onChange}
          showPassword={showPassword}
          toggleShow={() => setShowPassword(!showPassword)}
        />
      );
    }
    if (field.fieldname === "confirmPassword") {
      return (
        <PasswordInput
          field={field}
          value={value}
          onChange={onChange}
          showPassword={showConfirmPassword}
          toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      );
    }
    return null;
  };

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join StrideNex to start your career development journey"
      alternateText="Already have an account?"
      alternateLinkText="Sign in"
      alternateLinkHref="/login"
      appName={appName}
      bgImage={bgImage}
    >
      <div className="space-y-5">
        {/* Form with 5 fields */}
        <DynamicForm
          fields={signupFields}
          onSubmit={() => { }}
          buttonLabel=""
          loading={loading}
          onChange={handleFormChange}
        />

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
            I agree to the{" "}
            <Link
              href="/terms-of-use"
              target="_blank"
              className="text-accent hover:text-orange-600 font-medium"
            >
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="text-accent hover:text-orange-600 font-medium"
            >
              Privacy Policy
            </Link>
          </Label>
        </div>

        {/* Create Account Button */}
        <Button
          type="button"
          variant="accent"
          className="w-full"
          loading={loading}
          disabled={loading}
          onClick={handleSubmit}
        >
          Create Account
        </Button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}