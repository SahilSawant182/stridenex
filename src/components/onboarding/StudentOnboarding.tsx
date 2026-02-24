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
  const [skillInput, setSkillInput] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [mobileVerificationCode, setMobileVerificationCode] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Validation errors
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  
  const [formData, setFormData] = useState({
    email: "",
    emailVerified: false,
    termsAccepted: false,
    privacyAccepted: false,
    mobileNo: "",
    mobileVerified: false,
    firstName: "",
    lastName: "",
    college: "",
    department: "",
    academicYear: "",
    dateOfBirth: "",
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Mobile validation - exactly 10 digits
  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Clear validation errors on change
    if (name === 'email') setEmailError("");
    if (name === 'mobileNo') {
      // Allow only digits and limit to 10
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
      if (digitsOnly.length > 0 && digitsOnly.length < 10) {
        setMobileError("Mobile number must be 10 digits");
      } else {
        setMobileError("");
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSendEmailOTP = async () => {
    // Validate email first
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Verification code sent to your email");
      setEmailOtpSent(true);
    } catch (err) {
      setError("Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = () => {
    setLoading(true);
    setError("");
    try {
      if (emailVerificationCode === "123456") {
        setFormData(prev => ({ ...prev, emailVerified: true }));
        setSuccess("Email verified successfully");
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMobileOTP = async () => {
    // Validate mobile first
    if (!validateMobile(formData.mobileNo)) {
      setMobileError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Verification code sent to your mobile");
      setMobileOtpSent(true);
    } catch (err) {
      setError("Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobile = () => {
    setLoading(true);
    setError("");
    try {
      if (mobileVerificationCode === "123456") {
        setFormData(prev => ({ ...prev, mobileVerified: true }));
        setSuccess("Mobile number verified successfully");
      } else {
        setError("Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToStep2 = () => {
    if (formData.termsAccepted && formData.privacyAccepted) {
      setCurrentStep(2);
      setSuccess("");
      setEmailVerificationCode("");
      setEmailOtpSent(false);
    }
  };

  const handleContinueToStep3 = () => {
    setCurrentStep(3);
    setSuccess("");
    setMobileVerificationCode("");
    setMobileOtpSent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.college || 
          !formData.department || !formData.academicYear || !formData.dateOfBirth) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (skills.length === 0) {
        setError("Please add at least one course");
        setLoading(false);
        return;
      }

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
  };

  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Verify your email";
      case 2: return "Verify your mobile number";
      case 3: return "Complete your profile";
      default: return "Build your student profile";
    }
  };

  const getStepDescription = () => {
    switch(currentStep) {
      case 1: return "Please verify your email address to get started.";
      case 2: return "We need to verify your mobile number for security.";
      case 3: return "Tell us about your academic background.";
      default: return "";
    }
  };

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
              onChange={handleChange}
              placeholder="Enter your email address"
              disabled={formData.emailVerified || loading}
              className={emailError ? "border-red-500" : ""}
              required
            />
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>
          {!formData.emailVerified && !emailOtpSent && (
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

      {emailOtpSent && !formData.emailVerified && (
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
          <p className="text-xs text-slate-400 mt-1">
            Use code: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">123456</span>
          </p>
        </div>
      )}

      {formData.emailVerified && (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-emerald-600 text-sm flex items-center gap-2">
              <span className="text-emerald-600">✓</span> Email verified successfully
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, termsAccepted: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm text-slate-700">
                I accept the Terms and Conditions *
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, privacyAccepted: checked as boolean }))
                }
              />
              <Label htmlFor="privacy" className="text-sm text-slate-700">
                I agree to the Privacy Policy *
              </Label>
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
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              disabled={formData.mobileVerified || loading}
              className={mobileError ? "border-red-500" : ""}
              required
              maxLength={10}
            />
            {mobileError && <p className="text-xs text-red-500 mt-1">{mobileError}</p>}
          </div>
          {!formData.mobileVerified && !mobileOtpSent && (
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

      {mobileOtpSent && !formData.mobileVerified && (
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
          <p className="text-xs text-slate-400 mt-1">
            Use code: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">123456</span>
          </p>
        </div>
      )}

      {formData.mobileVerified && (
        <>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-emerald-600 text-sm flex items-center gap-2">
              <span className="text-emerald-600">✓</span> Mobile number verified successfully
            </p>
          </div>

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
        <div>
          <Label htmlFor="college" className="text-sm font-medium text-slate-700">College *</Label>
          <select
            id="college"
            name="college"
            value={formData.college}
            onChange={handleChange}
            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent mt-1"
            required
          >
            <option value="">Select college</option>
            <option value="MIT">MIT</option>
            <option value="Stanford">Stanford</option>
            <option value="Harvard">Harvard</option>
            <option value="Berkeley">UC Berkeley</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <Label htmlFor="department" className="text-sm font-medium text-slate-700">Department *</Label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent mt-1"
            required
          >
            <option value="">Select department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="academicYear" className="text-sm font-medium text-slate-700">Academic Year *</Label>
          <select
            id="academicYear"
            name="academicYear"
            value={formData.academicYear}
            onChange={handleChange}
            className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent mt-1"
            required
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="5th Year">5th Year</option>
          </select>
        </div>
        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            placeholder="DD-MM-YYYY"
            style={{ textTransform: "uppercase" }}
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 focus:ring-accent focus:border-accent"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="skills" className="text-sm font-medium text-slate-700">Courses Type *</Label>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 mb-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="primary" className="text-xs bg-accent/10 text-accent border-accent/20">
                {skill}
                <button 
                  type="button"
                  onClick={() => handleRemoveSkill(skill)} 
                  className="ml-1 hover:text-accent"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
        <div className="relative mt-1">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press enter"
            className="pr-8 focus:ring-accent focus:border-accent"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-accent text-lg"
          >
            +
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1">e.g., React, Python, JavaScript, SQL</p>
      </div>

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
          disabled={loading || skills.length === 0}
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
      {/* Messages */}
      {success && (
        <Alert variant="success" className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
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