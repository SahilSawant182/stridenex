"use client";

import { useEffect, useState } from "react";
import { BASE_URL, fetchBackgroundImage, fetchProjectDetails } from "@/services/api.services";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, GraduationCap, Building2, Briefcase } from "lucide-react";
import AuthLayout from "../AuthLayout";
import { useAuth } from "@/context/AuthContext";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { validateEmail, validatePassword, validateConfirmPassword, validateRequired, validateSignupForm } from "@/lib/validators";
import { useFormValidation } from "@/hooks/useFormValidation";

type UserRole = "student" | "institute" | "industry" | null;

export default function SignupPage() {
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>("StrideNex");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
  });

  // Use the custom validation hook
  const { errors, touched, setFieldTouched, shouldShowError } = useFormValidation<typeof formData>();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/portal/dashboard");
    }
  }, [isAuthenticated, router]);

  // Define signup fields
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

  // Conditionally add institution field for students
  // if (selectedRole === "student") {
  //   signupFields.push({
  //     fieldname: "institution",
  //     label: "College/University",
  //     fieldtype: "Data",
  //     required: true,
  //     placeholder: "Enter your institution name",
  //   });
  // }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setFieldTouched(field as keyof typeof formData);
  };

 const validateForm = (): boolean => {
  const errors = validateSignupForm({
    ...formData,
    selectedRole: selectedRole,
    acceptTerms
  });
  
  // Set errors if any
  if (Object.keys(errors).length > 0) {
    setError(Object.values(errors)[0]);
    return false;
  }
  
  return true;
};

  const handleDynamicFormSubmit = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BASE_URL}method/stridenex_app.stridenex_app.api.signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: selectedRole,
            institution: formData.institution,
          }),
        }
      );

      const data = await response.json();
      const result = data?.message;

      if (result?.status === 200) {
        if (selectedRole === "student") {
          router.push("/onboarding/student");
        } else if (selectedRole === "institute") {
          router.push("/onboarding/institute");
        } else if (selectedRole === "industry") {
          router.push("/onboarding/industry");
        }
      } else {
        let backendError = result?.error || result?.message || "Signup failed";
        const cleanError = backendError.replace(/<[^>]*>/g, "");
        setError(cleanError);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  // Check if passwords match for the indicator
  const doPasswordsMatch = formData.password && 
                          formData.confirmPassword && 
                          formData.password === formData.confirmPassword;

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap, color: "primary", gradient: "from-primary to-purple-600" },
    { id: "institute", label: "Institute", icon: Building2, color: "accent", gradient: "from-accent to-orange-600" },
    { id: "industry", label: "Industry", icon: Briefcase, color: "emerald", gradient: "from-emerald-600 to-emerald-500" },
  ];

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
    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
      {/* Dynamic Form for fields - this includes all input fields */}
      <DynamicForm
        fields={signupFields}
        onSubmit={handleDynamicFormSubmit}
        buttonLabel="" // Empty button label since we'll use our own button after checkbox
        loading={loading}
      />

      {/* Custom validation messages */}
      <div className="space-y-1">
        {shouldShowError('email') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
        
        {shouldShowError('password') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password}
          </p>
        )}
        
        {shouldShowError('confirmPassword') && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword}
          </p>
        )}

        {/* Password match indicator */}
        {formData.password && 
         formData.confirmPassword && 
         !errors.confirmPassword && 
         doPasswordsMatch && (
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span>✓</span> Passwords match
          </p>
        )}
      </div>

      {/* Terms Checkbox - This should be above the button */}
      <div className="flex items-start gap-3 mt-4">
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

      {/* Submit Button - Now below the checkbox */}
      <Button
        type="submit"
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
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Role-specific messaging */}
      <p className="text-xs text-center text-slate-400 mt-2">
        {selectedRole === "student" && "Start your career journey with industry-aligned skill development"}
        {selectedRole === "institute" && "Enhance student outcomes through industry collaboration"}
        {selectedRole === "industry" && "Build your talent pipeline with skilled graduates"}
      </p>
    </form>
  </AuthLayout>
);
}