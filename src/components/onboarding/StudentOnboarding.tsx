"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEmail, validateRequired } from "@/lib/validators";
import {
  sendMobileOTP,
  verifyMobileOTP,
  sendEmailOTP,
  verifyEmailOTP
} from "@/services/onboarding.services";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { BASE_URL } from "@/services/api.services";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

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
  const [skills, setSkills] = useState<string[]>([]);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [mobileVerificationCode, setMobileVerificationCode] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fetchedFieldsRef = useRef<Set<string>>(new Set());
  const [departmentOptions, setDepartmentOptions] = useState<Array<{ value: string; label: string; academicYears: string }>>([]);

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
    state: "",
    district: "",
    college: "",
    collegeName: "",
    department: "",
    academicYear: "",
    dateOfBirth: "",
    stream: "",
    course: "",
    samester: "",
  });

  // Step 1 fields
  const step1Fields: FormField[] = [
    {
      fieldname: "email",
      label: "Email Address",
      fieldtype: "Data",
      required: true,
      placeholder: "Enter your email address",
      layout: "full"
    }
  ];

  // Step 2 fields
  const step2Fields: FormField[] = [
    {
      fieldname: "mobileNo",
      label: "Mobile Number",
      fieldtype: "Data",
      required: true,
      placeholder: "Enter 10-digit mobile number",
      layout: "full",
      maxLength: 10
    }
  ];

  // Step 3 fields with dependent department dropdown
  // Step 3 fields with dependent department dropdown
  const step3Fields: FormField[] = [
    {
      fieldname: "state",
      label: "State",
      fieldtype: "Data",
      required: true,
      placeholder: "Select State",
      layout: "half",
      apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.college.masters.get_state`,
      mapOptions: (data) => {
        // Handle the response structure: { message: [...], data: [] }
        const states = data.message || [];
        return states.map((state: any) => ({
          value: state.name,
          label: state.state_name
        }));
      }
    },
    {
      fieldname: "district",
      label: "District",
      fieldtype: "Data",
      required: true,
      placeholder: "Select District",
      layout: "half",
      // You can add district API here later
      // apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.college.masters.get_district?state_name=${encodeURIComponent(formData.state)}`,
      // mapOptions: (data) => {
      //   const districts = data.message || [];
      //   return districts.map((district: any) => ({
      //     value: district.name,
      //     label: district.district_name
      //   }));
      // },
      // disabled: !formData.state
    },
    {
      fieldname: "college",
      label: "College",
      fieldtype: "Data",
      required: true,
      placeholder: "Select college",
      layout: "half",
      apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college`,
      mapOptions: (data) => {
        const colleges = data.data || [];
        return colleges.map((college: any) => ({
          value: college.name,
          label: college.college_name
        }));
      }
    },
    {
      fieldname: "department",
      label: "Department",
      fieldtype: "Data",
      required: true,
      placeholder: "Select department",
      layout: "half",
      apiEndpoint: formData.college
        ? `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college_departments?college_name=${encodeURIComponent(formData.college)}`
        : undefined,
      mapOptions: (data) => {
        const departments = data.data || [];
        console.log("Department API response:", departments);

        const deptOptions = departments.map((dept: any) => ({
          value: dept.department,
          label: dept.department,
          academicYears: dept.academic_years
        }));

        console.log("Mapped department options:", deptOptions);

        setDepartmentOptions(deptOptions);

        return deptOptions.map((option: any) => ({ value: option.value, label: option.label }));
      },
      disabled: !formData.college
    },
    {
      fieldname: "academicYear",
      label: "Academic Year",
      fieldtype: "Data",
      required: true,
      placeholder: "Academic years",
      layout: "half",
      read_only: true
    },
    {
      fieldname: "stream",
      label: "Stream",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Stream",
      layout: "half",
      // apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college`,
      // mapOptions: (data) => {
      //   const streams = data.data || [];
      //   return streams.map((stream: any) => ({
      //     value: stream.name,
      //     label: stream.stream_name
      //   }));
      // }
    },
    {
      fieldname: "course",
      label: "Course",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Course",
      layout: "half",
      // apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college`,
      // mapOptions: (data) => {
      //   const courses = data.data || [];
      //   return courses.map((course: any) => ({
      //     value: course.name,
      //     label: course.course_name
      //   }));
      // }
    },
    {
      fieldname: "samester",
      label: "Semester",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Semester",
      layout: "half",
      // apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_college`,
      // mapOptions: (data) => {
      //   const semesters = data.data || [];
      //   return semesters.map((semester: any) => ({
      //     value: semester.name,
      //     label: semester.semester_name
      //   }));
      // }
    },
    {
      fieldname: "dateOfBirth",
      label: "Date of Birth",
      fieldtype: "Date",
      required: true,
      placeholder: "DD/MM/YYYY",
      layout: "half",
      inputClassName: "uppercase"
    },
    {
      fieldname: "courses",
      label: "Courses Type",
      fieldtype: "Data",
      required: true,
      placeholder: "Select courses",
      layout: "half",
      multiSelect: true,
      apiEndpoint: `${BASE_URL}method/stridenex_app.api_stridenex_app.student.masters.get_courses_type`,
      mapOptions: (data) => {
        const courses = data.data || [];
        return courses.map((course: any) => ({
          value: course.name,
          label: course.course_type
        }));
      }
    }
  ];

  // ============ STEP 1: EMAIL VERIFICATION ============
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

      if (response?.message === "Email verified successfully") {
        setFormData(prev => ({ ...prev, emailVerified: true }));
        setSuccess(response.message);
        setError("");
      } else {
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
    // Clear previous messages
    setError("");
    setSuccess("");

    // Check if mobile number is exactly 10 digits
    if (!formData.mobileNo || formData.mobileNo.length !== 10) {
      setFieldErrors(prev => ({
        ...prev,
        mobileNo: "Please enter a valid 10-digit mobile number"
      }));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await sendMobileOTP(formData.mobileNo);
      console.log("Send mobile OTP response:", response);

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

    const stateValidation = validateRequired(formData.state, "State");
    if (!stateValidation.isValid) {
      errors.state = stateValidation.error || "State is required";
    }

    const districtValidation = validateRequired(formData.district, "District");
    if (!districtValidation.isValid) {
      errors.district = districtValidation.error || "District is required";
    }

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

    // Add validation for new fields
    const streamValidation = validateRequired(formData.stream, "Stream");
    if (!streamValidation.isValid) {
      errors.stream = streamValidation.error || "Stream is required";
    }

    const courseValidation = validateRequired(formData.course, "Course");
    if (!courseValidation.isValid) {
      errors.course = courseValidation.error || "Course is required";
    }

    const semesterValidation = validateRequired(formData.samester, "Semester");
    if (!semesterValidation.isValid) {
      errors.samester = semesterValidation.error || "Semester is required";
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
    console.log('handle submit')
    e.preventDefault();

    // if (!validateStep3()) {
    //   return;
    // }

    setLoading(true);
    setError("");

    try {
      // Format mobile number with country code
      const formattedMobile = `+91-${formData.mobileNo}`;

      // Prepare the payload according to the API specification
      const payload = {
        first_name: localStorage.getItem("userFirstName") || formData.firstName || "Test",
        last_name: localStorage.getItem("userLastName") || formData.lastName || "User",
        mobile_no: formattedMobile,
        email_id: localStorage.getItem("userEmail") || formData.email,
        // state: formData.state || "Maharashtra",
        // district: formData.district || "Pune",
        college: formData.college || "KIT",
        department: formData.department || "Computer Science",
        academic_year: formData.academicYear || "2025-2026",
        course: formData.course || "Computer Science", // Static fallback
        semester: formData.samester || "8", // Static fallback
        date_of_birth: formData.dateOfBirth || "2005-01-25",
        courses_type: skills.length > 0 ? skills.join(',') : "PG",
        terms_and_conditions: formData.termsAccepted ? "accepted" : ""
      };

      console.log("Submitting payload:", payload);

      const response = await fetch(
        `${BASE_URL}method/stridenex_app.api_stridenex_app.student.student.create_student`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();
      console.log("Registration response:", responseData);

      // Check if registration was successful (adjust based on actual response structure)
      if (response.ok || responseData?.message === "Student created successfully") {
        setSuccess("Onboarding completed successfully!");

        // Clear onboarding-specific localStorage items
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userLastName");

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        // Handle error response
        const errorMsg = responseData?.message ||
          responseData?.error ||
          "Registration failed. Please try again.";
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Error submitting onboarding data:", err);
      setError(err?.message || "An error occurred during registration");
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
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <DynamicForm
            fields={step1Fields}
            onSubmit={() => { }}
            buttonLabel=""
            loading={loading}
            onChange={(data) => {
              setSuccess('');
              setError('');
              if (data.email !== formData.email) {
                setEmailOtpSent(false);
                setEmailVerificationCode('');
                setFormData(prev => ({
                  ...prev,
                  email: data.email,
                  emailVerified: false
                }));
              }
            }}
          />
        </div>

        {/* Show Send OTP button when email is not verified */}
        {!formData.emailVerified && (
          <Button
            type="button"
            onClick={handleSendEmailOTP}
            disabled={!formData.email || loading}
            variant="accent"
            className="mt-7 whitespace-nowrap" // mt-7 to align with input field
          >
            Send OTP
          </Button>
        )}
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
                className="whitespace-nowrap"
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
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <DynamicForm
            fields={step2Fields}
            onSubmit={() => { }}
            buttonLabel=""
            loading={loading}
            onChange={(data) => {
              setSuccess("");
              setError("");

              // Get the mobile number, remove non-digits, and enforce max 10 digits
              let mobileNo = data.mobileNo || "";
              mobileNo = mobileNo.replace(/\D/g, '').slice(0, 10);

              // Clear field error when user starts typing
              setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.mobileNo;
                return newErrors;
              });

              // Only update if the value has changed
              if (mobileNo !== formData.mobileNo) {
                setMobileOtpSent(false);
                setMobileVerificationCode('');
                setFormData(prev => ({
                  ...prev,
                  mobileNo,
                  mobileVerified: false
                }));
              }
            }}
          />
        </div>

        {/* Show Send OTP button when mobile is not verified */}
        {!formData.mobileVerified && (
          <Button
            type="button"
            onClick={handleSendMobileOTP}
            disabled={!formData.mobileNo || formData.mobileNo.length !== 10 || loading}
            variant="accent"
            className="mt-7 whitespace-nowrap"
          >
            Send OTP
          </Button>
        )}
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
                className="whitespace-nowrap"
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

      {/* Show continue button when mobile is verified */}
      {formData.mobileVerified && (
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
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <DynamicForm
        fields={step3Fields}
        onSubmit={() => { }}
        buttonLabel=""
        loading={loading}
        initialValues={{
          state: formData.state,
          district: formData.district,
          college: formData.college,
          department: formData.department,
          academicYear: formData.academicYear,
          stream: formData.stream,
          course: formData.course,
          samester: formData.samester,
          dateOfBirth: formData.dateOfBirth,
          courses: skills
        }}

        onChange={(data) => {
          console.log("Form data changed:", data);

          // Check if state changed
          if (data.state !== formData.state) {
            console.log("State changed from", formData.state, "to", data.state);

            // Reset district and maybe college when state changes
            setFormData(prev => ({
              ...prev,
              state: data.state || prev.state,
              district: "", // Reset district
              college: data.college || prev.college,
              department: data.department || prev.department,
              academicYear: data.academicYear || prev.academicYear,
              stream: data.stream || prev.stream,
              course: data.course || prev.course,
              samester: data.samester || prev.samester,
              dateOfBirth: data.dateOfBirth || prev.dateOfBirth
            }));
          }
          // Check if college changed
          else if (data.college !== formData.college) {
            console.log("College changed from", formData.college, "to", data.college);

            // Reset department and academic year when college changes
            setFormData(prev => ({
              ...prev,
              state: data.state || prev.state,
              district: data.district || prev.district,
              college: data.college || prev.college,
              department: "",
              academicYear: "",
              stream: data.stream || prev.stream,
              course: data.course || prev.course,
              samester: data.samester || prev.samester,
              dateOfBirth: data.dateOfBirth || prev.dateOfBirth
            }));

            // Clear any department-related errors
            setFieldErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.department;
              delete newErrors.academicYear;
              return newErrors;
            });

            // Remove department from fetched fields so it fetches again
            fetchedFieldsRef.current.delete('department');
          }
          // Check if department changed
          else if (data.department !== formData.department && data.department) {
            console.log("Department changed from", formData.department, "to", data.department);

            // Find the selected department in our stored options
            const selectedDept = departmentOptions.find(
              dept => dept.value === data.department
            );

            console.log("Selected department:", selectedDept);

            const academicYearValue = selectedDept ? `${selectedDept.academicYears} Years` : "";
            console.log("Setting academic year to:", academicYearValue);

            // Update form data with department and its academic years
            setFormData(prev => ({
              ...prev,
              state: data.state || prev.state,
              district: data.district || prev.district,
              college: data.college || prev.college,
              department: data.department,
              academicYear: academicYearValue,
              stream: data.stream || prev.stream,
              course: data.course || prev.course,
              samester: data.samester || prev.samester,
              dateOfBirth: data.dateOfBirth || prev.dateOfBirth
            }));
          }
          else {
            // Normal update for all fields
            setFormData(prev => ({
              ...prev,
              state: data.state || prev.state,
              district: data.district || prev.district,
              college: data.college || prev.college,
              department: data.department || prev.department,
              academicYear: data.academicYear || prev.academicYear,
              stream: data.stream || prev.stream,
              course: data.course || prev.course,
              samester: data.samester || prev.samester,
              dateOfBirth: data.dateOfBirth || prev.dateOfBirth
            }));
          }

          // Update skills for multi-select
          if (data.courses) {
            setSkills(data.courses);
          }
        }}
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
          onClick={handleSubmit}
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