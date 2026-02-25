"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { validateEmail, validateRequired } from "@/lib/validators";
import {
  sendMobileOTP,
  verifyMobileOTP,
  College,
  sendEmailOTP,
  verifyEmailOTP
} from "@/services/onboarding.services";
import Dropdown from "../ui/Dropdown";
import { BASE_URL } from "@/services/api.services";

interface StudentOnboardingProps {
  onSubmit?: (data: any) => Promise<void>;
  onSkip?: () => void;
}

type Step = 1 | 2 | 3;

export default function StudentOnboarding({
  onSubmit,
  onSkip
}: StudentOnboardingProps) {
  const router = useRouter();
  const { apiKey, apiSecret } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [collegesFetched, setCollegesFetched] = useState(false);
  const [collegeError, setCollegeError] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [mobileVerificationCode, setMobileVerificationCode] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: typeof window !== 'undefined' ? localStorage.getItem("userEmail") || "" : "",
    emailVerified: false,
    termsAccepted: false,
    privacyAccepted: false,
    mobileNo: "",
    mobileVerified: false,
    firstName: typeof window !== 'undefined' ? localStorage.getItem("userFirstName") || "" : "",
    lastName: typeof window !== 'undefined' ? localStorage.getItem("userLastName") || "" : "",
    college: "",
    collegeName: "",
    department: "",
    academicYear: "",
    dateOfBirth: "",
  });

  // Reset colleges fetched when leaving step 3
  useEffect(() => {
    if (currentStep !== 3) {
      setCollegesFetched(false);
      setColleges([]);
      setCollegeError("");
    }
  }, [currentStep]);

  // Mobile validation - exactly 10 digits
  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    if (name === 'mobileNo') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setFieldErrors(prev => ({
          ...prev,
          mobileNo: "Mobile number must be 10 digits"
        }));
      }
      return;
    }

    if (name === 'college') {
      const selectedCollege = colleges.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        collegeName: selectedCollege?.college_name || value
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ============ STEP 2: MOBILE VERIFICATION (REAL APIS) ============
  const handleSendEmailOTP = async () => {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setFieldErrors(prev => ({
        ...prev,
        email: emailValidation.error || "Invalid email"
      }));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendEmailOTP(formData.email);
      console.log("Send email OTP response:", response);

      if (response?.message?.status === "success") {
        setSuccess(response.message.message || "OTP sent successfully");
        setEmailOtpSent(true);
      } else {
        setError(response?.message?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("Error sending email OTP:", err);
      setError(err?.response?.data?.message?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyEmailOTP(formData.email, emailVerificationCode);
      console.log("Verify email response:", response);

      // Success Response: {"message":"Email verified successfully"}
      // Error Response: {"message":"Invalid OTP","data":{"success":false}}

      if (response?.message === "Email verified successfully") {
        setFormData(prev => ({ ...prev, emailVerified: true }));
        setSuccess(response.message);
        setError("");
      } else {
        // Handle error case
        setError(response?.message || "Invalid verification code");
      }
    } catch (err: any) {
      console.error("Error verifying email OTP:", err);
      const errorMessage = err?.response?.data?.message || "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============ STEP 2: MOBILE VERIFICATION ============
  const handleSendMobileOTP = async () => {
    if (!validateMobile(formData.mobileNo)) {
      setFieldErrors(prev => ({
        ...prev,
        mobileNo: "Please enter a valid 10-digit mobile number"
      }));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendMobileOTP(formData.mobileNo);
      console.log("Send mobile OTP response:", response);

      // Response: {"message":"OTP sent successfully"}
      if (response?.message === "OTP sent successfully") {
        setSuccess(response.message);
        setMobileOtpSent(true);
        if (response.data) {
          console.log("OTP received:", response.data);
        }
      } else {
        setError(response?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("Error sending mobile OTP:", err);
      setError(err?.response?.data?.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyMobileOTP(formData.mobileNo, mobileVerificationCode);
      console.log("Verify mobile response:", response);

      // Success Response: {"message":"Mobile number verified successfully"}
      // Error Response: {"message":"Invalid OTP","data":{"success":false}}

      if (response?.message === "Mobile number verified successfully") {
        setFormData(prev => ({ ...prev, mobileVerified: true }));
        setSuccess(response.message);
        setError("");
      } else {
        setError(response?.message || "Invalid verification code");
      }
    } catch (err: any) {
      console.error("Error verifying mobile OTP:", err);
      setError(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };



  // ============ STEP VALIDATIONS ============
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.emailVerified) {
      errors.email = "Please verify your email first";
    }
    if (!formData.termsAccepted) {
      errors.terms = "You must accept the Terms and Conditions";
    }
    if (!formData.privacyAccepted) {
      errors.privacy = "You must accept the Privacy Policy";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToStep2 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setSuccess("");
      setEmailVerificationCode("");
      setEmailOtpSent(false);
      setFieldErrors({});
    }
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.mobileVerified) {
      errors.mobileNo = "Please verify your mobile number first";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToStep3 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      setSuccess("");
      setMobileVerificationCode("");
      setMobileOtpSent(false);
      setFieldErrors({});
    }
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    const collegeValidation = validateRequired(formData.college, "College");
    if (!collegeValidation.isValid) {
      errors.college = collegeValidation.error || "College is required";
    }

    const departmentValidation = validateRequired(formData.department, "Department");
    if (!departmentValidation.isValid) {
      errors.department = departmentValidation.error || "Department is required";
    }

    const yearValidation = validateRequired(formData.academicYear, "Academic year");
    if (!yearValidation.isValid) {
      errors.academicYear = yearValidation.error || "Academic year is required";
    }

    const dobValidation = validateRequired(formData.dateOfBirth, "Date of birth");
    if (!dobValidation.isValid) {
      errors.dateOfBirth = dobValidation.error || "Date of birth is required";
    }

    if (skills.length === 0) {
      errors.skills = "Please add at least one course";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const finalData = {
        ...formData,
        courses: skills,
        completedSteps: {
          emailVerified: formData.emailVerified,
          mobileVerified: formData.mobileVerified,
          profileCompleted: true
        }
      };

      if (onSubmit) {
        await onSubmit(finalData);
      } else {
        setSuccess("Onboarding completed successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (err) {
      setError("Error submitting onboarding data");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push("/portal/dashboard");
    }
  };

  const goToStep1 = () => {
    setCurrentStep(1);
    setSuccess("");
    setError("");
    setFieldErrors({});
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Verify your email";
      case 2: return "Verify your mobile number";
      case 3: return "Complete your profile";
      default: return "Build your student profile";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Please verify your email address to get started.";
      case 2: return "We need to verify your mobile number for security.";
      case 3: return "Tell us about your academic background.";
      default: return "";
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2 mt-1">
          <div className="flex-1">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;
                setSuccess('')
                setError('')
                if (value !== formData.email) {
                  setEmailOtpSent(false);
                  setEmailVerificationCode('');
                  setFormData(prev => ({
                    ...prev,
                    email: value,
                    emailVerified: false
                  }));
                }
              }}
              placeholder="Enter your email address"
              disabled={loading}   // ❌ removed emailVerified disable
              className={fieldErrors.email ? "border-red-500" : ""}
              required
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
          </div>

          {/* Show Send OTP button when email is not verified */}
          {!formData.emailVerified && (
            <Button
              type="button"
              onClick={handleSendEmailOTP}
              disabled={!formData.email || loading}
              variant="accent"
            >
              Send OTP
            </Button>
          )}
        </div>
      </div>

      {/* Show OTP verification field only if OTP has been sent and email is not verified */}
      {emailOtpSent && !formData.emailVerified && (
        <>
          <div>
            <Label htmlFor="emailOtp" className="text-sm font-medium text-slate-700">
              Verification Code <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="emailOtp"
                value={emailVerificationCode}
                onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleVerifyEmail}
                disabled={emailVerificationCode.length !== 6 || loading}
                variant="accent"
              >
                Verify
              </Button>
            </div>
          </div>

          {/* Resend OTP link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSendEmailOTP}
              className="text-xs text-accent hover:underline"
              disabled={loading}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </>
      )}

      {formData.emailVerified && (
        <>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="terms" className="text-sm text-slate-700">
                  I accept the Terms and Conditions *
                </Label>
                {fieldErrors.terms && <p className="text-xs text-red-500 mt-1">{fieldErrors.terms}</p>}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) =>
                  setFormData(prev => ({ ...prev, privacyAccepted: checked as boolean }))
                }
              />
              <div className="flex-1">
                <Label htmlFor="privacy" className="text-sm text-slate-700">
                  I agree to the Privacy Policy *
                </Label>
                {fieldErrors.privacy && <p className="text-xs text-red-500 mt-1">{fieldErrors.privacy}</p>}
              </div>
            </div>
          </div>

          {formData.termsAccepted && formData.privacyAccepted && (
            <Button
              type="button"
              onClick={handleContinueToStep2}
              variant="accent"
              className="w-full"
            >
              Continue to Mobile Verification
            </Button>
          )}
        </>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mobileNo" className="text-sm font-medium text-slate-700">
          Mobile Number <span className="text-red-500">*</span>
        </Label>
        <div className="flex gap-2 mt-1">
          <div className="flex-1">

            <Input
              id="mobileNo"
              name="mobileNo"
              type="tel"
              value={formData.mobileNo}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setSuccess("")
                setError("")
                if (value !== formData.mobileNo) {
                  setMobileOtpSent(false);
                  setMobileVerificationCode('');
                  setFormData(prev => ({
                    ...prev,
                    mobileNo: value,
                    mobileVerified: false
                  }));
                }
              }}
              placeholder="Enter 10-digit mobile number"
              disabled={loading}   // ❌ removed mobileVerified disable
              className={fieldErrors.mobileNo ? "border-red-500" : ""}
              required
              maxLength={10}
            />
            {fieldErrors.mobileNo && <p className="text-xs text-red-500 mt-1">{fieldErrors.mobileNo}</p>}
          </div>

          {/* Show Send OTP button when mobile is not verified */}
          {!formData.mobileVerified && (
            <Button
              type="button"
              onClick={handleSendMobileOTP}
              disabled={!formData.mobileNo || formData.mobileNo.length !== 10 || loading}
              variant="accent"
            >
              Send OTP
            </Button>
          )}
        </div>
      </div>

      {/* Show OTP verification field only if OTP has been sent and mobile is not verified */}
      {mobileOtpSent && !formData.mobileVerified && (
        <>
          <div>
            <Label htmlFor="mobileOtp" className="text-sm font-medium text-slate-700">
              Verification Code <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="mobileOtp"
                value={mobileVerificationCode}
                onChange={(e) => setMobileVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="button"
                onClick={handleVerifyMobile}
                disabled={mobileVerificationCode.length !== 6 || loading}
                variant="accent"
              >
                Verify
              </Button>
            </div>
          </div>

          {/* Resend OTP link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleSendMobileOTP}
              className="text-xs text-accent hover:underline"
              disabled={loading}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </>
      )}

      {/* Show success message and continue button when mobile is verified */}
      {formData.mobileVerified && (
        <>
          {/* Navigation buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={goToStep1}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleContinueToStep3}
              variant="accent"
              className="flex-1"
            >
              Continue to Profile
            </Button>
          </div>
        </>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* College Dropdown - Single select */}
        <Dropdown
          id="college"
          label="College"
          value={formData.college}
          onChange={(value) => {
            handleChange({
              target: { name: 'college', value }
            } as React.ChangeEvent<HTMLSelectElement>);
          }}
          endpoint={`${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college`}
          mapOptions={(data) =>
            data
              .filter((college: any) => college.is_active === 1 && college.status === "Active")
              .map((college: any) => ({
                value: college.name,
                label: college.college_name
              }))
          }
          required
          error={fieldErrors.college}
          placeholder="Select college"
        />

        {/* Department Dropdown - Single select */}
        <Dropdown
          id="department"
          label="Department"
          value={formData.department}
          onChange={(value) => {
            handleChange({
              target: { name: 'department', value }
            } as React.ChangeEvent<HTMLSelectElement>);
          }}
          endpoint={`${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_department`}
          mapOptions={(data) =>
            data.map((dept: any) => ({
              value: dept.name,
              label: dept.department_name
            }))
          }
          required
          error={fieldErrors.department}
          placeholder="Select department"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="academicYear" className="text-sm font-medium text-slate-700">
            Academic Year <span className="text-red-500">*</span>
          </Label>
          <select
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className={`w-full h-10 rounded-md border ${fieldErrors.academicYear ? "border-red-500" : "border-slate-200"
              } bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent mt-1`}
            required
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="5th Year">5th Year</option>
          </select>
          {fieldErrors.academicYear && <p className="text-xs text-red-500 mt-1">{fieldErrors.academicYear}</p>}
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            style={{ textTransform: "uppercase" }}
            onChange={handleChange}
            className={`mt-1 focus:ring-accent focus:border-accent ${fieldErrors.dateOfBirth ? "border-red-500" : ""
              }`}
            required
          />
          {fieldErrors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{fieldErrors.dateOfBirth}</p>}
        </div>
      </div>

      {/* Courses Type - Multi-select dropdown */}
      <Dropdown
        id="courses"
        label="Courses Type"
        value={skills} // skills array from your state
        onChange={(selectedValues) => {
          setSkills(selectedValues); // Update skills state with selected values
        }}
        endpoint={`${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_courses_type`}
        mapOptions={(data) =>
          data.map((course: any) => ({
            value: course.name,
            label: course.course_type
          }))
        }
        required
        error={fieldErrors.skills}
        placeholder="Select courses"
        multiSelect={true} // Enable multi-select
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(2)}
        >
          Back
        </Button>
        <Button
          type="submit"
          variant="accent"
          className="flex-1"
          loading={loading}
          disabled={loading}
        >
          Complete Registration
        </Button>
      </div>
    </div>
  );

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={3}
      title={getStepTitle()}
      description={getStepDescription()}
      onSkip={handleSkip}
      showSkip={currentStep === 1}
    >
      {/* Success Message */}
      {success && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>
    </OnboardingLayout>
  );
}