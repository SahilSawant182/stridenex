"use client";

import React, { useEffect, useRef, useState } from "react";
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
  verifyEmailOTP,
  createStudent
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

const API_BASE_URL = "https://devstridenex.quantcloud.in";

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
  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);
  const fetchedFieldsRef = useRef<Set<string>>(new Set());
  const [departmentOptions, setDepartmentOptions] = useState<Array<{
    value: string;
    label: string;
    academicYears: string;
    semester: string; // Add this
  }>>([]);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    emailVerified: false,
    termsAccepted: false,
    privacyAccepted: false,
    mobileNo: "",
    mobileVerified: false,
    firstName: "",
    lastName: "",
    state: "",
    district: "",
    college: "",
    collegeName: "",
    department: "",
    academicYear: "",
    dateOfBirth: "",
    stream: "",
    course: "",
    semester: "",
    courses: [],
    skills: [],
    careerInterest: [],
    gender: "",
    resume: null,
    linkedinUrl: "",
    githubUrl: ""
  });

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail") || "";
    const savedFirstName = localStorage.getItem("userFirstName") || "";
    const savedLastName = localStorage.getItem("userLastName") || "";
    setFormData(prev => ({
      ...prev,
      email: savedEmail,
      firstName: savedFirstName,
      lastName: savedLastName,
    }));
  }, []);

  console.log('form data', formData)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mobileTimer > 0) {
      interval = setInterval(() => {
        setMobileTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

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
  const step3Fields: FormField[] = [
    {
      fieldname: "state",
      label: "State",
      fieldtype: "Data",
      required: true,
      placeholder: "Select State",
      layout: "half",
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "State"
      },
      mapOptions: (data) => {
        console.log("State data received in mapOptions:", data); // This should be the array

        // 'data' is already the array, so just map it directly
        return data.map((state: any) => ({
          value: state.name,
          label: state.name
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
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: formData.state ? {
        doctype: "District",
        fields: ["name", "district_name"],
        filters: [["state", "=", formData.state]],
        order_by: "district_name asc",
        limit_page_length: 1000
      } : undefined,
      mapOptions: (data) => {
        console.log("District data in mapOptions:", data);
        // data is the array from the response
        return data.map((district: any) => ({
          value: district.name,
          label: district.district_name || district.name
        }));
      },
      disabled: !formData.state
    },
    {
      fieldname: "stream",
      label: "Stream",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Stream",
      layout: "half",
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "Stream"
      },
      mapOptions: (data) => {
        console.log("Stream data received in mapOptions:", data);
        return data.map((stream: any) => ({
          value: stream.name,
          label: stream.name
        }));
      }
    },

    {
      fieldname: "college",
      label: "College",
      fieldtype: "Data",
      required: true,
      placeholder: "Select College",
      layout: "half",
      // Only enable when stream, state, and district are selected
      apiEndpoint: (formData.stream && formData.state && formData.district)
        ? `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.student.masters.get_colleges_by_stream`
        : undefined,
      apiParams: (formData.stream && formData.state && formData.district) ? {
        stream: formData.stream,
        state: formData.state,
        district: formData.district
      } : undefined,
      mapOptions: (data) => {
        console.log("College data received in mapOptions:", data);

        // Handle the response structure: { message: "...", data: [...] }
        const colleges = data.data || data || [];

        return colleges.map((college: any) => ({
          value: college.name,
          label: college.college_name || college.name
        }));
      },
      disabled: !(formData.stream && formData.state && formData.district) // Disable until all filters are selected
    },
    {
      fieldname: "courses",
      label: "Courses Type",
      fieldtype: "Data",
      required: true,
      placeholder: "Select courses",
      layout: "full",
      multiSelect: true,
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "Course Type"  // Note the space in "Course Type"
      },
      mapOptions: (data) => {
        console.log("Courses Type data received in mapOptions:", data);

        // Handle the response structure (similar to state)
        const courses = data.data || data || [];

        return courses.map((course: any) => ({
          value: course.name,
          label: course.course_type || course.name
        }));
      }
    },
    {
      fieldname: "course",
      label: "Course",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Course",
      layout: "half",
      // Only enable when college is selected
      apiEndpoint: formData.college
        ? `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`
        : undefined,
      apiParams: formData.college ? {
        doctype: "Courses",
        fields: ["name", "course_name"], // Add fields if needed
        filters: [["college", "=", formData.college]], // Use array format like district field
        order_by: "course_name asc",
        limit_page_length: 1000
      } : undefined,
      mapOptions: (data) => {
        console.log("Course data received in mapOptions:", data);
        const courses = data.data || data || [];

        return courses.map((course: any) => ({
          value: course.name,
          label: course.course_name || course.name
        }));
      },
      disabled: !formData.college
    },

    {
      fieldname: "department",
      label: "Department",
      fieldtype: "Data",
      required: true,
      placeholder: "Select department",
      layout: "half",
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "College Department",
        fields: ["name", "academic_years", "semester"]
      },
      mapOptions: (data) => {
        console.log("Department data received in mapOptions:", data);

        const departments = data.data || data || [];

        const deptOptions = departments.map((dept: any) => ({
          value: dept.name,
          label: dept.name,
          academicYears: dept.academic_years,
          semester: dept.semester  // Make sure this is included
        }));

        console.log("Mapped department options:", deptOptions);

        setDepartmentOptions(deptOptions);

        return deptOptions.map(({ value, label }: { value: string; label: string }) => ({ value, label }));
      },
      disabled: false
    },

    {
      fieldname: "academicYear",
      label: "Academic Year",
      fieldtype: "Data",
      required: false,
      placeholder: "Academic years",
      layout: "half",
      read_only: true
    },


    {
      fieldname: "semester",
      label: "Semester",
      fieldtype: "Data",
      required: true,
      placeholder: "Select Semester",
      layout: "half",
      apiEndpoint: formData.department
        ? `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.student.masters.get_semester`
        : undefined,
      apiParams: formData.department ? {
        semester: departmentOptions.find(d => d.value === formData.department)?.semester || ""
      } : undefined,
      mapOptions: (data) => {
        console.log("Semester data received:", data);

        // Handle the response structure: { message: "...", data: [...] }
        const semesters = data.data || data || [];

        // Map each semester object to { value, label } format
        return semesters.map((sem: any) => ({
          value: sem.name,
          label: sem.name  // Use the name as both value and label
        }));
      },
      disabled: !formData.department
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
      fieldname: "gender",
      label: "Gender",
      fieldtype: "Select",
      required: false,
      placeholder: "Select Gender",
      layout: "half",
      options: ["Male", "Female", "Other", "Prefer not to say"]
    },

    {
      fieldname: "skills",
      label: "Skills",
      fieldtype: "Data",
      required: false,
      placeholder: "Select skills",
      layout: "full",
      multiSelect: true, // This makes it multi-select
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "Student Skill" // Updated doctype
      },
      mapOptions: (data) => {
        console.log("Skills data received:", data);
        const items = data.data || data || [];
        return items.map((item: any) => ({
          value: item.name,
          label: item.name || item.skill_name
        }));
      }
    },
    {
      fieldname: "careerInterest",
      label: "Career Interest",
      fieldtype: "Data",
      required: false,
      placeholder: "Select career interests",
      layout: "full",
      multiSelect: true, // This makes it multi-select
      apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
      apiParams: {
        doctype: "Student Career Interest" // Updated doctype
      },
      mapOptions: (data) => {
        console.log("Career Interest data received:", data);
        const items = data.data || data || [];
        return items.map((item: any) => ({
          value: item.name,
          label: item.name || item.career_interest_name
        }));
      }
    },

    {
      fieldname: "resume",
      label: "Resume (PDF only)",
      fieldtype: "File",
      required: false,
      placeholder: "Upload your resume (PDF)",
      layout: "full",
      accept: ".pdf",
    },
    {
      fieldname: "linkedinUrl",
      label: "LinkedIn Profile URL",
      fieldtype: "Data",
      required: false,
      placeholder: "https://linkedin.com/in/username",
      layout: "half",
      inputClassName: "font-mono text-sm"
    },
    {
      fieldname: "githubUrl",
      label: "GitHub Profile URL",
      fieldtype: "Data",
      required: false,
      placeholder: "https://github.com/username",
      layout: "half",
      inputClassName: "font-mono text-sm"
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

    // setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendEmailOTP(formData.email);
      console.log("Send email OTP response:", response);

      if (response?.message?.status === "success") {
        setSuccess(response.message.message || "OTP sent successfully");
        setEmailOtpSent(true);
        setEmailTimer(120); // Start 2 minute timer
      } else {
        setError(response?.message?.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("Error sending email OTP:", err);
      setError(err?.response?.data?.message?.message || "Failed to send verification code");
    } finally {
      // setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    // setLoading(true);
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
      // setLoading(false);
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

    // setLoading(true);
    setError("");

    try {
      const response = await sendMobileOTP(formData.mobileNo);
      console.log("Send mobile OTP response:", response);

      if (response?.message === "OTP sent successfully") {
        setSuccess(response.message);
        setMobileOtpSent(true);
        setMobileTimer(120); // Start 2 minute timer
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
      // setLoading(false);
    }
  };

  const handleVerifyMobile = async () => {
    // setLoading(true);
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
      // setLoading(false);
    }
  };

  // ============ STEP VALIDATIONS ============
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.emailVerified) {
      errors.email = "Please verify your email first";
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

  const validateStep3 = (): Record<string, string> => {
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
    const streamValidation = validateRequired(formData.stream, "Stream");
    if (!streamValidation.isValid) {
      errors.stream = streamValidation.error || "Stream is required";
    }

    const courseValidation = validateRequired(formData.course, "Course");
    if (!courseValidation.isValid) {
      errors.course = courseValidation.error || "Course is required";
    }

    const semesterValidation = validateRequired(formData.semester, "Semester");
    if (!semesterValidation.isValid) {
      errors.semester = semesterValidation.error || "Semester is required";
    }

    const dobValidation = validateRequired(formData.dateOfBirth, "Date of birth");
    if (!dobValidation.isValid) {
      errors.dateOfBirth = dobValidation.error || "Date of birth is required";
    }

    // Check if at least one course type is selected
    if (formData.courses.length === 0) {
      errors.courses = "Please select at least one course type";
    }

    // Check if at least one skill is selected
    if (formData.skills.length === 0) {
      errors.skills = "Please select at least one skill";
    }

    // Check if at least one career interest is selected
    if (formData.careerInterest.length === 0) {
      errors.careerInterest = "Please select at least one career interest";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateStep3();

    // If there are validation errors, show the first one and return
    if (Object.keys(validationErrors).length > 0) {
      // Set field errors to show under each field
      setFieldErrors(validationErrors);

      // Also show a general error message
      // const firstError = Object.values(validationErrors)[0];
      // setError(firstError);

      // Scroll to the top to show the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
    setFieldErrors({}); // Clear field errors

    try {
      // Format mobile number with country code
      const formattedMobile = `+91-${formData.mobileNo}`;

      // Format courses type as array of objects
      const coursesTypeArray = (formData.courses || []).map((course: string) => ({
        course_type: course
      }));

      // Format skills as array of objects
      const skillsArray = (formData.skills || []).map((skill: string) => ({
        skill: skill
      }));

      // Format career interests as array of objects
      const careerInterestArray = (formData.careerInterest || []).map((interest: string) => ({
        career_interest: interest
      }));

      // Extract just the number from academicYear (e.g., "2 Years" -> "2")
      let academicYearValue = formData.academicYear || "1";
      const numericMatch = academicYearValue.match(/\d+/);
      academicYearValue = numericMatch ? numericMatch[0] : "1";

      const payload = {
        first_name: localStorage.getItem("userFirstName") || formData.firstName || "Test",
        last_name: localStorage.getItem("userLastName") || formData.lastName || "User",
        mobile_no: formattedMobile,
        email_id: localStorage.getItem("userEmail") || formData.email || "",
        stream: formData.stream || "Engineering",
        courses_type: coursesTypeArray.length > 0 ? coursesTypeArray : [{ course_type: "PG" }],
        college: formData.college || "DRK",
        course: formData.course || "BA",
        department: formData.department || "Dispatch",
        academic_year: academicYearValue,
        semester: formData.semester || "1",
        date_of_birth: formData.dateOfBirth || new Date().toISOString().split('T')[0],
        skill: skillsArray.length > 0 ? skillsArray : [{ skill: "Creativity & innovation" }],
        career_interest: careerInterestArray.length > 0 ? careerInterestArray : [{ career_interest: "Biotechnology / Genetics" }],
        github: formData.githubUrl || "",
        linkedin: formData.linkedinUrl || "",
        resume: formData.resume || null
      };

      console.log("Submitting payload:", payload);

      // Call the createStudent service
      const responseData = await createStudent(payload);

      console.log("Registration response:", responseData);

      // Strict check: responseData status or internal message status
      const internalStatus = responseData?.message?.status;
      const isSuccess = (responseData?.status === 200 || internalStatus === 200 || internalStatus === "success" || responseData?.message === "Student registered successfully");

      if (isSuccess && internalStatus !== 500) {
        // Set success message (this will show in green Alert)
        setSuccess(typeof responseData?.message === 'string' ? responseData.message : "Student registered successfully!");

        // Clear onboarding-specific localStorage items
        localStorage.clear();

        // Clear any errors
        setError("");
        setFieldErrors({});

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        // Handle error response - this will show in red Alert
        let errorMsg = "Registration failed. Please try again.";
        
        if (responseData?._server_messages) {
          try {
            const messages = JSON.parse(responseData._server_messages);
            const parsedMessage = JSON.parse(messages[0]);
            errorMsg = parsedMessage.message || errorMsg;
          } catch (e) {
            errorMsg = responseData?.message?.message || responseData?.message || errorMsg;
          }
        } else {
          errorMsg = responseData?.message?.message || responseData?.message || responseData?.error || errorMsg;
        }
        
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Error submitting onboarding data:", err);

      let errorMessage = "An error occurred during registration";

      if (err?.response?.data?._server_messages) {
        try {
          const messages = JSON.parse(err.response.data._server_messages);
          const parsedMessage = JSON.parse(messages[0]);
          errorMessage = parsedMessage.message || errorMessage;
        } catch (parseError) {
          errorMessage = err?.response?.data?.message || err?.message || errorMessage;
        }
      } else {
        // Extract precise message if available
        const nestedMessage = err?.response?.data?.message;
        if (typeof nestedMessage === 'object' && nestedMessage !== null) {
          errorMessage = nestedMessage.message || errorMessage;
        } else if (typeof nestedMessage === 'string') {
          errorMessage = nestedMessage;
        } else {
          errorMessage = err?.response?.data?.error || err?.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push("/student/dashboard");
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
            initialValues={{ email: formData.email }} // Add this line
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

        {/* Show Send OTP button or Resend button based on timer */}
        {!formData.emailVerified && !emailOtpSent && (
          <Button
            type="button"
            onClick={handleSendEmailOTP}
            disabled={!formData.email || emailTimer > 0} // Remove loading from disabled condition
            variant="accent"
            className="mt-7 whitespace-nowrap"
          >
            {emailTimer > 0 ? `Resend in ${emailTimer}s` : "Send OTP"}
          </Button>
        )}

        {emailOtpSent && !formData.emailVerified && (
          <Button
            type="button"
            onClick={handleSendEmailOTP}
            disabled={emailTimer > 0} // Remove loading from disabled condition
            variant="accent"
            className="mt-7 whitespace-nowrap"
          >
            {emailTimer > 0 ? `Resend in ${emailTimer}s` : "Resend OTP"}
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
          {/* <div className="text-center">
            <button
              type="button"
              onClick={handleSendEmailOTP}
              className="text-xs text-accent hover:underline"
              disabled={loading || emailTimer > 0}
            >
              {emailTimer > 0 ? `Resend in ${emailTimer}s` : "Didn't receive OTP? Resend"}
            </button>
          </div> */}
        </>
      )}

      {formData.emailVerified && (
        <Button
          type="button"
          onClick={handleContinueToStep2}
          variant="accent"
          className="w-full"
        >
          Continue to Mobile Verification
        </Button>
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

        {/* Show Send OTP button or Resend button based on timer */}
        {!formData.mobileVerified && !mobileOtpSent && (
          <Button
            type="button"
            onClick={handleSendMobileOTP}
            disabled={!formData.mobileNo || formData.mobileNo.length !== 10 || loading || mobileTimer > 0}
            variant="accent"
            className="mt-7 whitespace-nowrap"
          >
            {mobileTimer > 0 ? `Resend in ${mobileTimer}s` : "Send OTP"}
          </Button>
        )}

        {mobileOtpSent && !formData.mobileVerified && (
          <Button
            type="button"
            onClick={handleSendMobileOTP}
            disabled={loading || mobileTimer > 0}
            variant="accent"
            className="mt-7 whitespace-nowrap"
          >
            {mobileTimer > 0 ? `Resend in ${mobileTimer}s` : "Resend OTP"}
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
          {/* <div className="text-center">
            <button
              type="button"
              onClick={handleSendMobileOTP}
              className="text-xs text-accent hover:underline"
              disabled={loading || mobileTimer > 0}
            >
              {mobileTimer > 0 ? `Resend in ${mobileTimer}s` : "Didn't receive OTP? Resend"}
            </button>
          </div> */}
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

  const renderStep3 = () => {
    // Helper function to update form data
    const updateFormData = (newData: any, resetFields: string[] = []) => {
      setFormData(prev => {
        // Create base update with all fields from newData
        const baseUpdate = {
          state: newData.state ?? prev.state,
          district: newData.district ?? prev.district,
          college: newData.college ?? prev.college,
          department: newData.department ?? prev.department,
          academicYear: newData.academicYear ?? prev.academicYear,
          stream: newData.stream ?? prev.stream,
          course: newData.course ?? prev.course,
          semester: newData.semester ?? prev.semester,
          dateOfBirth: newData.dateOfBirth ?? prev.dateOfBirth,
          courses: newData.courses ?? prev.courses,
          skills: newData.skills ?? prev.skills,
          careerInterest: newData.careerInterest ?? prev.careerInterest,
          gender: newData.gender ?? prev.gender,
          resume: newData.resume ?? prev.resume,
          linkedinUrl: newData.linkedinUrl ?? prev.linkedinUrl,
          githubUrl: newData.githubUrl ?? prev.githubUrl
        };

        // Reset specific fields to empty strings
        const resetValues = resetFields.reduce((acc, field) => {
          acc[field] = "";
          return acc;
        }, {} as Record<string, any>);

        return {
          ...prev,
          ...baseUpdate,
          ...resetValues
        };
      });
    };

    return (
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
            semester: formData.semester,
            dateOfBirth: formData.dateOfBirth,
            courses: formData.courses,
            skills: formData.skills,
            careerInterest: formData.careerInterest,
            gender: formData.gender,
            resume: formData.resume,
            linkedinUrl: formData.linkedinUrl,
            githubUrl: formData.githubUrl
          }}
          errors={fieldErrors}
          onChange={(data) => {
            console.log("Form data changed:", data);

            // Determine which field changed
            const changedField = Object.keys(data).find(
              key => data[key] !== formData[key as keyof typeof formData]
            );

            if (!changedField) return;

            // Define field dependencies and what should reset when they change
            const fieldDependencies: Record<string, string[]> = {
              state: ["district", "college", "department", "academicYear", "course", "semester"],
              district: ["college", "department", "academicYear", "course", "semester"],
              stream: ["college", "department", "academicYear", "course", "semester"],
              college: ["department", "academicYear", "course", "semester"],
              department: ["semester"],
              course: ["semester"]
            };

            // Fields that need their errors cleared when parent changes
            const errorDependencies: Record<string, string[]> = {
              state: ["district", "college", "department", "course", "semester"],
              district: ["college", "department", "course", "semester"],
              stream: ["college", "department", "course", "semester"],
              college: ["department", "course", "semester"],
              department: ["semester"],
              course: ["semester"]
            };

            // Get fields to reset
            const fieldsToReset = fieldDependencies[changedField] || [];

            // Update form data with resets
            updateFormData(data, fieldsToReset);

            // Clear errors for changed field and its dependencies
            setFieldErrors(prev => {
              const newErrors = { ...prev };

              // Clear error for the changed field
              delete newErrors[changedField];

              // Clear errors for dependent fields
              if (errorDependencies[changedField]) {
                errorDependencies[changedField].forEach(field => {
                  delete newErrors[field];
                });
              }

              return newErrors;
            });

            // Clear fetched fields ref for dependencies
            if (changedField === "state" || changedField === "district" ||
              changedField === "stream" || changedField === "college") {
              fetchedFieldsRef.current.delete('department');
              fetchedFieldsRef.current.delete('course');
              fetchedFieldsRef.current.delete('semester');
            } else if (changedField === "department") {
              fetchedFieldsRef.current.delete('semester');
            }

            // Handle special case for department change
            if (changedField === "department" && data.department) {
              const selectedDept = departmentOptions.find(
                dept => dept.value === data.department
              );

              if (selectedDept) {
                const academicYearValue = `${selectedDept.academicYears} Years`;

                // Update academic year separately
                setFormData(prev => ({
                  ...prev,
                  academicYear: academicYearValue
                }));
              }
            }

            // Update skills state if needed
            if (data.skills) {
              setSkills(data.skills);
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
  };

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
          <AlertDescription>{String(error)}</AlertDescription>
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