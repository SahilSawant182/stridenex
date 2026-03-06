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
        domain: [], // Multi-select domain from DynamicForm
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

        // Validate personal information
        if (!formData.first_name) {
            errors.first_name = "First name is required";
        }
        if (!formData.last_name) {
            errors.last_name = "Last name is required";
        }
        if (!formData.mobile_no) {
            errors.mobile_no = "Mobile number is required";
        } else if (formData.mobile_no.length !== 10) {
            errors.mobile_no = "Mobile number must be 10 digits";
        }
        if (!formData.email_id) {
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

        // Validate location
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
        if (!formData.travelling_possible) {
            errors.travelling_possible = "Travelling possible is required";
        }
        if (!formData.approved_status) {
            errors.approved_status = "Approved status is required";
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

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleContinueToStep2 = () => {
        if (validateStep1()) {
            setCurrentStep(2);
            setSuccess("");
            setFieldErrors({});
        }
    };

    const handleContinueToStep3 = () => {
        if (validateStep2()) {
            setCurrentStep(3);
            setSuccess("");
            setFieldErrors({});
        }
    };

    const goToStep1 = () => {
        setCurrentStep(1);
        setSuccess("");
        setError("");
        setFieldErrors({});
    };

    const goToStep2 = () => {
        setCurrentStep(2);
        setSuccess("");
        setError("");
        setFieldErrors({});
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
            case 3: return "Add your domain expertise, bank details, and profile description.";
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

            // Format mobile number with +91- prefix (remove any existing formatting)
            const cleanMobile = formData.mobile_no.replace(/\D/g, '');
            const formattedMobile = `+91-${cleanMobile}`;

            // Format the payload according to your API requirements
            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                mobile_no: formattedMobile,
                email_id: formData.email_id,
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
                bank_name: formData.bank_name,
                account_number: formData.account_number,
                ifsc_code: formData.ifsc_code,
                profile_description: formData.profile_description,
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
                placeholder: "Enter mobile number",
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
                    return data.map((type: any) => ({
                        value: type.name,
                        label: type.name
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
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        setFieldErrors({});
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
                    return data.map((country: any) => ({
                        value: country.name,
                        label: country.name
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
                    console.log("District data received:", data);
                    return data.map((district: any) => ({
                        value: district.name,
                        label: district.district_name || district.name
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
                apiParams: {
                    doctype: "Tahsil"
                },
                mapOptions: (data) => {
                    console.log("Taluka data received:", data);
                    return data.map((tahsil: any) => ({
                        value: tahsil.name,
                        label: tahsil.name
                    }));
                }
            },
            {
                fieldname: "city",
                label: "City",
                fieldtype: "Data",
                required: true,
                placeholder: "Select City",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "City"
                },
                mapOptions: (data) => {
                    console.log("City data received:", data);
                    return data.map((city: any) => ({
                        value: city.name,
                        label: city.name
                    }));
                }
            },
            {
                fieldname: "travelling_possible",
                label: "Travelling Possible",
                fieldtype: "Select",
                required: true,
                placeholder: "Select",
                layout: "half",
                options: ["Yes", "No", "Maybe"]
            },
            {
                fieldname: "approved_status",
                label: "Approved Status",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Approved Status",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Workflow State"
                },
                mapOptions: (data) => {
                    console.log("Approved Status data received:", data);
                    return data.map((status: any) => ({
                        value: status.name,
                        label: status.name
                    }));
                }
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
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        setFieldErrors({});
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
                fieldname: "profile_description",
                label: "Profile Description",
                fieldtype: "Text",
                required: false,
                placeholder: "Enter your profile description...",
                layout: "full",
                inputClassName: "min-h-[100px]"
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
                    onChange={(data) => {
                        setFormData(prev => ({
                            ...prev,
                            ...data
                        }));
                        setFieldErrors({});
                        setError("");
                    }}
                />

                {/* Bank Details Section */}
                <div className="mt-6">
                    <h3 className="text-md font-medium text-slate-800 mb-3">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="bank_name" className="text-sm font-medium text-slate-700">
                                Bank Name
                            </Label>
                            <Input
                                id="bank_name"
                                value={formData.bank_name}
                                onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                                placeholder="Enter bank name"
                                className="mt-1 h-10 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="account_number" className="text-sm font-medium text-slate-700">
                                Account Number
                            </Label>
                            <Input
                                id="account_number"
                                value={formData.account_number}
                                onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                                placeholder="Enter account number"
                                className="mt-1 h-10 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                            />
                        </div>
                        <div>
                            <Label htmlFor="ifsc_code" className="text-sm font-medium text-slate-700">
                                IFSC Code
                            </Label>
                            <Input
                                id="ifsc_code"
                                value={formData.ifsc_code}
                                onChange={(e) => setFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                                placeholder="Enter IFSC code"
                                className="mt-1 h-10 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                            />
                        </div>
                    </div>
                </div>

                {/* Is Active Checkbox */}
                <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) =>
                                setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                            }
                        />
                        <Label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                            Is Active
                        </Label>
                    </div>
                </div>

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