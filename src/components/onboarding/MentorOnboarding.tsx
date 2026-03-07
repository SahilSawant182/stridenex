"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { BASE_URL } from "@/services/api.services";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

interface MentorOnboardingProps {
    onSubmit?: (data: any) => Promise<void>;
    onSkip?: () => void;
}

type Step = 1 | 2 | 3;

const API_BASE_URL = "https://devstridenex.quantcloud.in";

export default function MentorOnboarding({
    onSubmit,
    onSkip
}: MentorOnboardingProps) {
    const router = useRouter();
    const { apiKey, apiSecret } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form data state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        mobile_no: "",
        email_id: "",
        type: "",
        country: "India",
        state: "",
        district: "",
        tahsil: "",
        city: "",
        travelling_possible: "Yes",
        approved_status: "Pending",
        isActive: true,
        domain: [], // Multi-select domain
        skills: [], // Multi-select skills
        profileUrl: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        profile_description: "",
        terms_and_conditions: false
    });

    // Validation errors
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // ============ STEP FUNCTIONS ============
    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.first_name?.trim()) {
            errors.first_name = "First name is required";
        }
        if (!formData.last_name?.trim()) {
            errors.last_name = "Last name is required";
        }
        if (!formData.mobile_no?.trim()) {
            errors.mobile_no = "Mobile number is required";
        } else if (formData.mobile_no.length !== 10) {
            errors.mobile_no = "Mobile number must be 10 digits";
        } else if (!/^\d+$/.test(formData.mobile_no)) {
            errors.mobile_no = "Mobile number must contain only digits";
        }
        if (!formData.email_id?.trim()) {
            errors.email_id = "Email ID is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
            errors.email_id = "Please enter a valid email address";
        }
        if (!formData.type) {
            errors.type = "Type is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.state) {
            errors.state = "State is required";
        }
        if (!formData.district) {
            errors.district = "District is required";
        }
        if (!formData.tahsil) {
            errors.tahsil = "Taluka is required";
        }
        if (!formData.city) {
            errors.city = "City is required";
        }
        if (!formData.travelling_possible || formData.travelling_possible === "") {
            errors.travelling_possible = "Travelling possible is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const errors: Record<string, string> = {};

        // Validate domain (multi-select)
        if (!formData.domain || formData.domain.length === 0) {
            errors.domain = "Please select at least one domain";
        }

        // Skills validation - optional but if provided should be valid
        if (formData.skills && formData.skills.length > 0) {
            // Skills are optional, no validation needed
        }

        // Profile URL validation - optional but if provided should be valid URL
        if (formData.profileUrl && formData.profileUrl.trim() !== "") {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(formData.profileUrl)) {
                errors.profileUrl = "Please enter a valid URL (e.g., https://linkedin.com/in/username)";
            }
        }

        // Validate profile description - minimum 50 characters
        if (!formData.profile_description?.trim()) {
            errors.profile_description = "Profile description is required";
        } else {
            const charCount = formData.profile_description.trim().length;
            if (charCount < 50) {
                errors.profile_description = `Please enter at least 50 characters (current: ${charCount} characters)`;
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinueToStep2 = () => {
        if (validateStep1()) {
            setCurrentStep(2);
            setSuccess("");
        }
    };

    const handleContinueToStep3 = () => {
        if (validateStep2()) {
            setCurrentStep(3);
            setSuccess("");
        }
    };

    const goToStep1 = () => {
        setCurrentStep(1);
        setSuccess("");
        setError("");
    };

    const goToStep2 = () => {
        setCurrentStep(2);
        setSuccess("");
        setError("");
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Personal Information";
            case 2: return "Location & Status";
            case 3: return "Professional Details";
            default: return "Mentor Onboarding";
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 1: return "Please provide your basic personal information.";
            case 2: return "Tell us about your location and availability.";
            case 3: return "Add your domain expertise, skills, profile URL, and description.";
            default: return "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep3()) {
            const firstError = Object.values(fieldErrors)[0];
            setError(firstError);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Format domain as array of objects
            const domainArray = (formData.domain || []).map((domain: string) => ({
                domain: domain
            }));

            // Format skills as array of objects (if any)
            const skillsArray = (formData.skills || []).map((skill: string) => ({
                skill: skill
            }));

            // Format mobile number with +91- prefix (remove any existing formatting)
            const cleanMobile = formData.mobile_no.replace(/\D/g, '');
            const formattedMobile = `+91-${cleanMobile}`;

            // Format the payload according to your API requirements
            const payload = {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                mobile_no: formattedMobile,
                email_id: formData.email_id.trim().toLowerCase(),
                type: formData.type,
                country: formData.country,
                state: formData.state,
                district: formData.district,
                tahsil: formData.tahsil,
                city: formData.city,
                travelling_possible: formData.travelling_possible,
                approved_status: formData.approved_status,
                is_active: formData.isActive ? 1 : 0,
                domains: domainArray,
                skills: skillsArray, // Add skills to payload
                profile_url: formData.profileUrl?.trim() || "", // Add profile URL
                bank_name: formData.bank_name?.trim() || "",
                account_number: formData.account_number?.trim() || "",
                ifsc_code: formData.ifsc_code?.trim() || "",
                profile_description: formData.profile_description?.trim() || "",
                terms_accepted: formData.terms_and_conditions ? 1 : 0
            };

            console.log("Submitting mentor data:", payload);

            // Make API call to create mentor
            const response = await axios.post(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.mentor.mentor.create_mentor`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("API Response:", response.data);

            if (response.status === 200) {
                setSuccess("Mentor onboarding completed successfully!");
                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            } else {
                setError(response.data?.message || "Failed to create mentor. Please try again.");
            }
        } catch (err: any) {
            console.error("Error submitting mentor data:", err);

            if (err?.response?.status === 401) {
                setError("Authentication required. Please contact support.");
            } else if (err?.response?.data?._server_messages) {
                try {
                    const messages = JSON.parse(err.response.data._server_messages);
                    const parsedMessage = JSON.parse(messages[0]);
                    setError(parsedMessage.message || "Validation error. Please check your input.");
                } catch {
                    setError(err?.response?.data?.message || "Error submitting data");
                }
            } else if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err?.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                const errorMessage = err?.message || "Error submitting mentor data. Please check your connection and try again.";
                setError(errorMessage);
            }
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

    // ============ RENDER FUNCTIONS ============
    const renderStep1 = () => {
        const step1Fields: FormField[] = [
            {
                fieldname: "first_name",
                label: "First Name",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter first name",
                layout: "half"
            },
            {
                fieldname: "last_name",
                label: "Last Name",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter last name",
                layout: "half"
            },
            {
                fieldname: "mobile_no",
                label: "Mobile No.",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter 10-digit mobile number",
                layout: "half",
                maxLength: 10
            },
            {
                fieldname: "email_id",
                label: "Email ID",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter email address",
                layout: "half"
            },
            {
                fieldname: "type",
                label: "Type",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Type",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Type"
                },
                mapOptions: (data) => {
                    console.log("Type data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.name
                    }));
                }
            }
        ];

        return (
            <div className="space-y-4">
                <DynamicForm
                    fields={step1Fields}
                    onSubmit={() => { }}
                    buttonLabel=""
                    loading={loading}
                    initialValues={formData}
                    errors={fieldErrors}
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        // Only clear errors for fields that were changed
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(data).forEach(key => {
                            delete updatedErrors[key];
                        });
                        setFieldErrors(updatedErrors);
                        setError("");
                    }}
                />

                <Button
                    type="button"
                    onClick={handleContinueToStep2}
                    variant="accent"
                    className="w-full"
                    disabled={loading}
                >
                    Continue to Location & Status
                </Button>
            </div>
        );
    };

    const renderStep2 = () => {
        const step2Fields: FormField[] = [
            {
                fieldname: "country",
                label: "Country",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Country",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Country"
                },
                mapOptions: (data) => {
                    console.log("Country data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.name
                    }));
                }
            },
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
                    console.log("State data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.name
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
                    console.log("District data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.district_name || item.name
                    }));
                },
                disabled: !formData.state
            },
            {
                fieldname: "tahsil",
                label: "Taluka",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Taluka",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: formData.district ? {
                    doctype: "Tahsil",
                    fields: ["name", "tahsil_name"],
                    filters: [["district", "=", formData.district]],
                    order_by: "tahsil_name asc",
                    limit_page_length: 1000
                } : undefined,
                mapOptions: (data) => {
                    console.log("Taluka data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.tahsil_name || item.name
                    }));
                },
                disabled: !formData.district
            },
            {
                fieldname: "city",
                label: "City",
                fieldtype: "Data",
                required: true,
                placeholder: "Select City",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: formData.tahsil ? {
                    doctype: "City",
                    fields: ["name", "city_name"],
                    filters: [["tahsil", "=", formData.tahsil]],
                    order_by: "city_name asc",
                    limit_page_length: 1000
                } : undefined,
                mapOptions: (data) => {
                    console.log("City data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.city_name || item.name
                    }));
                },
                disabled: !formData.tahsil
            },
            {
                fieldname: "travelling_possible",
                label: "Travelling Possible",
                fieldtype: "Select",
                required: true,
                placeholder: "Select travelling possibility",
                layout: "half",
                options: ["Yes", "No", "Maybe"]
            }
        ];

        return (
            <div className="space-y-4">
                <DynamicForm
                    fields={step2Fields}
                    onSubmit={() => { }}
                    buttonLabel=""
                    loading={loading}
                    initialValues={formData}
                    errors={fieldErrors}
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        // Only clear errors for fields that were changed
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(data).forEach(key => {
                            delete updatedErrors[key];
                        });
                        setFieldErrors(updatedErrors);
                        setError("");
                    }}
                />

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
                        disabled={loading}
                    >
                        Continue to Professional Details
                    </Button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        const step3Fields: FormField[] = [
            {
                fieldname: "domain",
                label: "Domain",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Domain",
                layout: "full",
                multiSelect: true,
                allowCustom: true, // This enables the "Others" feature
                customPlaceholder: "Enter custom domain name", // Optional
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Domain"
                },
                mapOptions: (data) => {
                    console.log("Domain data received:", data);
                    const items = data.data || data || [];
                    return items.map((item: any) => ({
                        value: item.name,
                        label: item.name || item.domain_name
                    }));
                }
            },
            {
                fieldname: "skills",
                label: "Skills",
                fieldtype: "Data",
                required: false,
                placeholder: "Select skills (optional)",
                layout: "full",
                multiSelect: true,
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Student Skill"
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
                fieldname: "profileUrl",
                label: "Profile URL",
                fieldtype: "Data",
                required: false,
                placeholder: "https://linkedin.com/in/username or https://portfolio.com",
                layout: "full",
                inputClassName: "font-mono text-sm"
            },
            {
                fieldname: "profile_description",
                label: "Profile Description",
                fieldtype: "Text",
                required: true,
                placeholder: "Tell us about your expertise, experience, and what you can offer as a mentor... (minimum 50 characters)",
                layout: "full",
                inputClassName: "min-h-[150px]",
                minLetters: 50
            }
        ];

        return (
            <div className="space-y-4">
                <DynamicForm
                    fields={step3Fields}
                    onSubmit={() => { }}
                    buttonLabel=""
                    loading={loading}
                    initialValues={formData}
                    errors={fieldErrors}
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        // Only clear errors for fields that were changed
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(data).forEach(key => {
                            delete updatedErrors[key];
                        });
                        setFieldErrors(updatedErrors);
                        setError("");
                    }}
                />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={goToStep2}
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
            showSkip={true}
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