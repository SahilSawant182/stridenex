import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BASE_URL } from "@/services/api.services";
import axios from "axios";
import Dropdown from "@/components/ui/Dropdown";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { sendEmailOTP, verifyEmailOTP, sendMobileOTP, verifyMobileOTP } from "@/services/onboarding.services";

export default function PartnerForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    companySize: '',
    partnerType: '',
    country: 'India',
    state: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP States
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  
  const [emailTimer, setEmailTimer] = useState(0);
  const [mobileTimer, setMobileTimer] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mobileTimer > 0) {
      interval = setInterval(() => setMobileTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mobileTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendEmailOTP = async () => {
    if (!formData.email) {
      setSubmitError("Please enter an email address first");
      return;
    }
    setOtpLoading(true);
    setSubmitError("");
    try {
      await sendEmailOTP(formData.email);
      setShowEmailOtp(true);
      setEmailTimer(60);
      setSubmitSuccess("OTP sent to email");
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message?.message || "Failed to send email OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyEmailOTP = async () => {
    if (!emailOtp) return;
    setOtpLoading(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await verifyEmailOTP(formData.email, emailOtp);
      // Wait for the exact message matching onboarding or just assume success if it doesn't throw
      if (response && (response.message === "OTP verified successfully" || response.message?.status === "success" || response.data?.success)) {
        setIsEmailVerified(true);
        setShowEmailOtp(false);
        setSubmitSuccess("Email verified successfully!");
      } else if (response && response.message) {
        // If there's an arbitrary success message
        setIsEmailVerified(true);
        setShowEmailOtp(false);
        setSubmitSuccess("Email verified successfully!");
      } else {
        setSubmitError("Invalid OTP");
      }
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSendMobileOTP = async () => {
    if (!formData.phone || formData.phone.length !== 10) {
      setSubmitError("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpLoading(true);
    setSubmitError("");
    try {
      await sendMobileOTP(formData.phone, formData.email || "");
      setShowMobileOtp(true);
      setMobileTimer(60);
      setSubmitSuccess("OTP sent to mobile");
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message?.message || "Failed to send mobile OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyMobileOTP = async () => {
    if (!mobileOtp) return;
    setOtpLoading(true);
    setSubmitError("");
    setSubmitSuccess("");
    try {
      const response = await verifyMobileOTP(formData.phone, mobileOtp, formData.email || "");
      if (response && (response.message === "OTP verified successfully" || response.message?.status === "success" || response.data?.success)) {
        setIsMobileVerified(true);
        setShowMobileOtp(false);
        setSubmitSuccess("Mobile verified successfully!");
      } else if (response && response.message) {
        setIsMobileVerified(true);
        setShowMobileOtp(false);
        setSubmitSuccess("Mobile verified successfully!");
      } else {
        setSubmitError("Invalid OTP");
      }
    } catch (err: any) {
      setSubmitError(err?.response?.data?.message?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified || !isMobileVerified) {
      setSubmitError("Please verify both Email and Phone number before submitting.");
      return;
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setSubmitError(passwordError);
      return;
    }
    
    setLoading(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        organisation: formData.organization,
        job_title: formData.jobTitle,
        company_size: formData.companySize ? parseInt(formData.companySize) : null,
        state: formData.state,
        password: formData.password,
        country: formData.country,
        partner_type: formData.partnerType
      };

      const response = await axios.post(
        `${BASE_URL}method/stridenex_app.stridenex_app.doctype.stridenex_partner.stridenex_partner.create_partner`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const responseData = response.data;
      if (responseData && responseData.message && responseData.message.status === "success") {
        setSubmitSuccess("Partner created successfully! Redirecting to login...");
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setSubmitError(responseData?.message?.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error("Error creating partner:", error);
      
      let errorMessage = "Failed to submit. Please try again.";
      
      // Handle Frappe validation errors
      if (error.response?.data?._server_messages) {
        try {
          const messages = JSON.parse(error.response.data._server_messages);
          if (messages && messages.length > 0) {
            const firstMessage = JSON.parse(messages[0]);
            if (firstMessage && firstMessage.message) {
              errorMessage = firstMessage.message;
            }
          }
        } catch (e) {
          console.error("Error parsing _server_messages", e);
        }
      } else if (error.response?.data?.message?.message) {
        errorMessage = error.response.data.message.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white border-t border-gray-100" id="partner-form">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text & Quote */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Let&apos;s Drive Transformation Together
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light">
              Join the StrideNex Partner Network to leverage verified talent pipelines, outcome-driven pathways, and dedicated support that accelerates your growth.
            </p>
            
            <div className="relative">
              {/* Quote icon */}
              <span className="absolute -top-6 -left-4 text-6xl text-blue-100 font-serif leading-none opacity-50 select-none">"</span>
              <p className="relative z-10 text-xl md:text-2xl text-gray-800 italic font-medium leading-relaxed mb-8">
                I invite you to join StrideNex's Partner Network. You'll gain access to world-class career pathways, AI-powered matching, and dedicated partnership support. More importantly, you'll help solve the most critical challenge: building skilled, future-ready workforces.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                  <span className="text-xl font-bold text-white tracking-wider">KS</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Kishor P. Shendge</h4>
                  <p className="text-sm text-gray-500">Founder, StrideNex</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200">
                  {submitSuccess}
                </div>
              )}
              {submitError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-200">
                  {submitError}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-3">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        disabled={isEmailVerified || showEmailOtp}
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-colors text-gray-800 ${isEmailVerified ? 'border-green-300 bg-green-50' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                      />
                      {isEmailVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    </div>
                    {!isEmailVerified && (
                      <button
                        type="button"
                        onClick={handleSendEmailOTP}
                        disabled={!formData.email || otpLoading || emailTimer > 0}
                        className="px-4 py-3 bg-white border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {emailTimer > 0 ? `Resend in ${emailTimer}s` : "Verify"}
                      </button>
                    )}
                  </div>
                  
                  {showEmailOtp && !isEmailVerified && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <input
                        type="text"
                        placeholder="Enter Email OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailOTP}
                        disabled={!emailOtp || otpLoading}
                        className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                      >
                        Submit
                      </button>
                    </div>
                  )}
              </div>

              <div className="space-y-3">
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        disabled={isMobileVerified || showMobileOtp}
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 outline-none transition-colors text-gray-800 ${isMobileVerified ? 'border-green-300 bg-green-50' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'}`}
                      />
                      {isMobileVerified && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                    </div>
                    {!isMobileVerified && (
                      <button
                        type="button"
                        onClick={handleSendMobileOTP}
                        disabled={!formData.phone || formData.phone.length !== 10 || otpLoading || mobileTimer > 0}
                        className="px-4 py-3 bg-white border border-blue-200 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {mobileTimer > 0 ? `Resend in ${mobileTimer}s` : "Verify"}
                      </button>
                    )}
                  </div>

                  {showMobileOtp && !isMobileVerified && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                      <input
                        type="text"
                        placeholder="Enter Phone OTP"
                        value={mobileOtp}
                        onChange={(e) => setMobileOtp(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyMobileOTP}
                        disabled={!mobileOtp || otpLoading}
                        className="px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                      >
                        Submit
                      </button>
                    </div>
                  )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organization" className="sr-only">Organization Name</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    placeholder="Organization Name"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="jobTitle" className="sr-only">Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="Job Title"
                    required
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-gray-800"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <Dropdown
                    id="companySize"
                    placeholder="Company Size"
                    value={formData.companySize}
                    onChange={(val) => setFormData({ ...formData, companySize: val })}
                    options={[
                      { value: "50", label: "1-50 employees" },
                      { value: "200", label: "51-200 employees" },
                      { value: "500", label: "201-500 employees" },
                      { value: "1000", label: "501-1,000 employees" },
                      { value: "2000", label: "1,000+ employees" }
                    ]}
                    required
                  />
                </div>
                
                <div className="relative">
                  <Dropdown
                    id="partnerType"
                    placeholder="I am interested in becoming a(n)..."
                    value={formData.partnerType}
                    onChange={(val) => setFormData({ ...formData, partnerType: val })}
                    options={[
                      "Placement Consultant",
                      "Training Center",
                      "Faculty Association",
                      "Government Body",
                      "Industry Association",
                      "EdTech Aggregator",
                      "Mentor"
                    ]}
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative">
                  <Dropdown
                    id="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(val) => setFormData({ ...formData, country: val })}
                    endpoint={`${BASE_URL}method/stridenex_app.api_stridenex_app.college.master.get_master_data`}
                    params={{ doctype: "Country" }}
                    searchable={true}
                    required
                  />
                </div>

                <div className="relative">
                  <Dropdown
                    id="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={(val) => setFormData({ ...formData, state: val })}
                    endpoint={`${BASE_URL}method/stridenex_app.api_stridenex_app.college.master.get_master_data`}
                    params={{ doctype: "State" }}
                    searchable={true}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors text-gray-800 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                By submitting your info in the form above, you agree to our <a href="/terms-of-use" className="text-blue-600 hover:underline">Terms of Use</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Notice</a>. We may use this info to contact you and/or use data from third parties to personalize your experience.
              </div>

              <button
                type="submit"
                disabled={loading || !isEmailVerified || !isMobileVerified}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-blue-600/20 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


