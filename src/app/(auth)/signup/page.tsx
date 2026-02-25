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

export default function SignupPage() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("StrideNex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);

  const { isAuthenticated, login } = useAuth(); // Make sure login is available from your auth context
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/portal/dashboard");
    }
  }, [isAuthenticated, router]);

  // ONLY 5 FIELDS
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
        if (responseData?.message?.status === 200) {
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userFirstName", data.firstName);
          localStorage.setItem("userLastName", data.lastName);

          // Directly navigate to student onboarding
          router.push("/onboarding/student");
        } else {
          // Handle different error structures
          const errorMsg = responseData?.message?.message ||
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
        {/* Form with 5 fields - no button */}
        <DynamicForm
          fields={signupFields}
          onSubmit={() => { }} // Empty onSubmit
          buttonLabel="" // No button from DynamicForm
          loading={loading}
          onChange={handleFormChange}
        />

        {/* Terms Checkbox - ABOVE the button */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed">
            I agree to the{" "}
            <a href="/terms" className="text-accent hover:text-orange-600 font-medium">Terms of Service</a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent hover:text-orange-600 font-medium">Privacy Policy</a>
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