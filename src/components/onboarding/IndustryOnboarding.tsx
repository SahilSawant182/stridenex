"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ChevronDown } from "lucide-react";
import axios from "axios";
import { ContactPersonsTable } from "@/components/ContactPersonsTable";

interface IndustryOnboardingProps {
    onSubmit?: (data: any) => Promise<void>;
    onSkip?: () => void;
}

interface ContactPerson {
    title: string;
    first_name: string;
    last_name: string;
    designation: string;
    contact_no: string;
    is_admin?: boolean;
    email?: string;
}

interface Option {
    value: string;
    label: string;
}

type Step = 1 | 2 | 3;

const API_BASE_URL = "https://devstridenex.quantcloud.in";

export default function IndustryOnboarding({
    onSubmit,
    onSkip
}: IndustryOnboardingProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isMobileSource = searchParams.get("source") === "mobile";
    const { apiKey, apiSecret, isOnboarded, isInitialized, currentUser } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [businessTypeOptions, setBusinessTypeOptions] = useState<Option[]>([]);
    const [industrySectorOptions, setIndustrySectorOptions] = useState<Option[]>([]);
    const [jobFunctionOptions, setJobFunctionOptions] = useState<Option[]>([]);
    const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
    const [salutationOptions, setSalutationOptions] = useState<Option[]>([]);

    const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
    const [loadingIndustrySectors, setLoadingIndustrySectors] = useState(false);
    const [loadingJobFunctions, setLoadingJobFunctions] = useState(false);
    const [loadingDesignations, setLoadingDesignations] = useState(false);
    const [loadingSalutations, setLoadingSalutations] = useState(false);

    const [businessTypeError, setBusinessTypeError] = useState("");
    const [industrySectorError, setIndustrySectorError] = useState("");
    const [jobFunctionError, setJobFunctionError] = useState("");
    const [designationError, setDesignationError] = useState("");
    const [salutationError, setSalutationError] = useState("");

    const [openDesignationDropdown, setOpenDesignationDropdown] = useState<number | null>(null);
    const designationDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
        { title: "", first_name: "", last_name: "", designation: "", contact_no: "", is_admin: false, email: "" }
    ]);

    const [formData, setFormData] = useState({
        company_name: "",
        business_type: "",
        gst_number: "",
        industry_sector: "",
        employee_head_count: "",
        internship_per_year: "",
        job_function: [],
        country: "India",
        state: "",
        district: "",
        tahsil: "",
        city: "",
        turn_over_in_cr: "",
        company_website: "",
        average_fresher_recruited_per_year: "",
        email: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            const userEmail = localStorage.getItem("userEmail") || currentUser || "";
            if (!userEmail) return;

            // Determine initial step based on isOnboarded flag
            // 0 -> Step 1, 1 -> Step 2, 2 -> Step 3
            const flag = parseInt(isOnboarded || "0");
            if (flag === 1) {
                setCurrentStep(2);
                setCompletedSteps(new Set([1]));
            } else if (flag === 2) {
                setCurrentStep(3);
                setCompletedSteps(new Set([1, 2]));
            } else if (flag === 3) {
                router.push("/industry/dashboard");
                return;
            }

            // Always set the email in formData
            setFormData(prev => ({
                ...prev,
                email: userEmail
            }));

            // If we are at step 2 or 3, fetch data to pre-fill
            if (flag > 0) {
                await fetchIndustryData(userEmail);
            }
        };

        if (isInitialized) {
            fetchInitialData();
        }
    }, [isOnboarded, isInitialized, currentUser]);

    const fetchIndustryData = async (email: string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.industry.industry.get_industry_by_name?email=${email}`);
            console.log("Industry API Response:", response.data);
            if (response.data?.message) {
                const messageObj = response.data.message;
                const data = messageObj.data || messageObj; // Handle both direct and nested data
                
                console.log("Extracted Industry Data:", data);
                if (data) {
                    // Map data to formData
                    setFormData(prev => ({
                        ...prev,
                        company_name: data.company_name || "",
                        business_type: data.business_type || data.other_business_type || "",
                        gst_number: data.gst_number || "",
                        industry_sector: data.industry_sector || data.other_industry_sector || "",
                        employee_head_count: data.employee_head_count?.toString() || "",
                        internship_per_year: data.internship_per_year?.toString() || "",
                        average_fresher_recruited_per_year: data.average_fresher_recruited_per_year?.toString() || "",
                        country: data.country || "India",
                        state: data.state || "",
                        district: data.district || "",
                        tahsil: data.tahsil || "", // Key matches the response (tahsil)
                        city: data.city || "",
                        turn_over_in_cr: data.turn_over_in_cr?.toString() || "",
                        company_website: data.company_website || "",
                        job_function: (data.job_function || []).map((jf: any) => jf.job_function) // Key is singular job_function
                    }));

                    // Map contact persons
                    if (data.contact_details && data.contact_details.length > 0) {
                        setContactPersons(data.contact_details.map((cp: any) => ({
                            title: cp.title || "",
                            first_name: cp.first_name || "",
                            last_name: cp.last_name || "",
                            designation: cp.designation || "",
                            contact_no: cp.contact_no?.replace(/^\+91-/, '') || "",
                            is_admin: cp.is_admin === 1,
                            email: cp.email || ""
                        })));
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching industry data:", err);
            setError("Failed to load existing profile data.");
        } finally {
            setLoading(false);
        }
    };

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            designationDropdownRefs.current.forEach((ref, index) => {
                if (ref && !ref.contains(event.target as Node) && openDesignationDropdown === index) {
                    setOpenDesignationDropdown(null);
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDesignationDropdown]);

    useEffect(() => {
        fetchBusinessTypes();
        fetchIndustrySectors();
        fetchJobFunctions();
        fetchDesignations();
        fetchSalutations();
    }, []);

    const fetchMasterData = async (doctype: string, setOptions: any, setLoading: any, setError: any) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ doctype })
                }
            );
            const data = await response.json();

            let options: Option[] = [];
            if (Array.isArray(data)) {
                options = data.map((item: any) => ({ value: item.name, label: item.name }));
            } else if (data.data && Array.isArray(data.data)) {
                options = data.data.map((item: any) => ({ value: item.name, label: item.name }));
            }

            setOptions(options);
        } catch (err: any) {
            console.error(`Error fetching ${doctype}:`, err);
            setError(`Failed to load ${doctype}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessTypes = () => fetchMasterData("Business Type", setBusinessTypeOptions, setLoadingBusinessTypes, setBusinessTypeError);
    const fetchIndustrySectors = () => fetchMasterData("Industry Sector", setIndustrySectorOptions, setLoadingIndustrySectors, setIndustrySectorError);
    const fetchJobFunctions = () => fetchMasterData("Job Function", setJobFunctionOptions, setLoadingJobFunctions, setJobFunctionError);
    const fetchDesignations = () => fetchMasterData("Designation", setDesignationOptions, setLoadingDesignations, setDesignationError);
    const fetchSalutations = () => fetchMasterData("Salutation", setSalutationOptions, setLoadingSalutations, setSalutationError);

    const removeContactPerson = (index: number) => {
        if (contactPersons.length > 1) {
            setContactPersons(contactPersons.filter((_, i) => i !== index));
        }
    };

    const handleContactPersonChange = (index: number, field: keyof ContactPerson, value: string | boolean) => {
        const updated = [...contactPersons];
        updated[index] = { ...updated[index], [field]: value };
        setContactPersons(updated);

        const allFilled = updated.every(person =>
            person.title && person.first_name && person.last_name && person.designation && person.contact_no
        );

        if (allFilled && fieldErrors.contactPersons) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.contactPersons;
                return newErrors;
            });
        }
    };

    const addContactPerson = () => {
        setContactPersons([...contactPersons, {
            title: "", first_name: "", last_name: "", designation: "", contact_no: "", is_admin: false, email: ""
        }]);
    };

    const toggleDesignationDropdown = (index: number) => {
        setOpenDesignationDropdown(openDesignationDropdown === index ? null : index);
    };

    const selectDesignation = (index: number, value: string) => {
        handleContactPersonChange(index, 'designation', value);
        setOpenDesignationDropdown(null);
    };

    const getSelectedDesignationLabel = (value: string) => {
        if (!value) return "Select Designation";
        const option = designationOptions.find(opt => opt.value === value);
        return option ? option.label : "Select Designation";
    };

    const setDesignationRef = (index: number) => (el: HTMLDivElement | null) => {
        designationDropdownRefs.current[index] = el;
    };

    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.company_name) errors.company_name = "Company name is required";
        if (!formData.business_type) errors.business_type = "Business type is required";
        if (!formData.industry_sector) errors.industry_sector = "Industry sector is required";
        if (!formData.employee_head_count) errors.employee_head_count = "Employee head count is required";
        if (!formData.internship_per_year) errors.internship_per_year = "Internship per year is required";
        if (!formData.average_fresher_recruited_per_year) errors.average_fresher_recruited_per_year = "Average fresher recruited per year is required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {};
        // job_function removed from mandatory check
        if (!formData.state) errors.state = "State is required";
        if (!formData.district) errors.district = "District is required";
        if (!formData.tahsil) errors.tahsil = "Taluka is required";
        if (!formData.city) errors.city = "City is required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const errors: Record<string, string> = {};
        const invalidContact = contactPersons.some(
            person => !person.title || !person.first_name || !person.last_name || !person.designation || !person.contact_no
        );
        if (invalidContact) errors.contactPersons = "All contact person fields are required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitStepData = async (step: Step) => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const userEmail = localStorage.getItem("userEmail") || "";

            const validContactPersons = contactPersons.filter(
                person => person.title && person.first_name && person.last_name && person.designation && person.contact_no
            );

            const formattedContactPersons = validContactPersons.map(person => ({
                title: person.title,
                first_name: person.first_name,
                last_name: person.last_name,
                designation: person.designation,
                contact_no: `+91-${person.contact_no.replace(/\D/g, '')}`,
                is_admin: person.is_admin ? 1 : 0,
                email: person.email
            }));

            const isCustomBusinessType = formData.business_type && !businessTypeOptions.some(opt => opt.value === formData.business_type);
            const isCustomIndustrySector = formData.industry_sector && !industrySectorOptions.some(opt => opt.value === formData.industry_sector);

            const jobFunctionArray = (formData.job_function || []).map((jobFunc: string) => ({
                job_function: jobFunc
            }));

            let payload: any = {
                email: userEmail,
                company_name: formData.company_name, // Mandatory for updates
                contact_details: [],
                business_type: isCustomBusinessType ? "" : (formData.business_type || ""),
                other_business_type: isCustomBusinessType ? formData.business_type : "",
                gst_number: "",
                industry_sector: isCustomIndustrySector ? "" : (formData.industry_sector || ""),
                other_industry_sector: isCustomIndustrySector ? formData.industry_sector : "",
                employee_head_count: 0,
                internship_per_year: 0,
                job_function: [], // Key is singular job_function
                country: "",
                state: "",
                district: "",
                tahsil: "", // Key is tahsil
                city: "",
                turn_over_in_cr: 0,
                company_website: "",
                average_fresher_recruited_per_year: 0
            };

            let endpoint = `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.industry.industry.create_industry`;
            let method: 'post' | 'put' = 'post';

            // If is_onboarded flag is already 1 or more, the record exists, so use PUT for updates
            const recordExists = parseInt(isOnboarded || "0") > 0;

            if (step === 1 && !recordExists) {
                // Step 1: Initial POST to create_industry
                payload.business_type = isCustomBusinessType ? "" : (formData.business_type || "");
                payload.other_business_type = isCustomBusinessType ? formData.business_type : "";
                payload.industry_sector = isCustomIndustrySector ? "" : (formData.industry_sector || "");
                payload.other_industry_sector = isCustomIndustrySector ? formData.industry_sector : "";
                payload.gst_number = formData.gst_number || "";
                payload.employee_head_count = formData.employee_head_count ? parseInt(formData.employee_head_count) : 0;
                payload.internship_per_year = formData.internship_per_year ? parseInt(formData.internship_per_year) : 0;
                payload.average_fresher_recruited_per_year = formData.average_fresher_recruited_per_year ? 
                    parseInt(formData.average_fresher_recruited_per_year) : 0;
            } else {
                // Step 2, Step 3, OR Step 1 update: Use PUT to update_industry
                endpoint = `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.industry.industry.update_industry?company_name=${encodeURIComponent(formData.company_name)}`;
                method = 'put';

                // Always include Step 1 data for cumulative/update payload
                payload.business_type = isCustomBusinessType ? "" : (formData.business_type || "");
                payload.other_business_type = isCustomBusinessType ? formData.business_type : "";
                payload.industry_sector = isCustomIndustrySector ? "" : (formData.industry_sector || "");
                payload.other_industry_sector = isCustomIndustrySector ? formData.industry_sector : "";
                payload.gst_number = formData.gst_number || "";
                payload.employee_head_count = formData.employee_head_count ? parseInt(formData.employee_head_count) : 0;
                payload.internship_per_year = formData.internship_per_year ? parseInt(formData.internship_per_year) : 0;
                payload.average_fresher_recruited_per_year = formData.average_fresher_recruited_per_year ? 
                    parseInt(formData.average_fresher_recruited_per_year) : 0;

                // Include Step 2 data
                if (step >= 2 || recordExists) {
                    payload.job_function = jobFunctionArray;
                    payload.country = formData.country;
                    payload.state = formData.state;
                    payload.district = formData.district;
                    payload.tahsil = formData.tahsil;
                    payload.city = formData.city;
                    payload.turn_over_in_cr = formData.turn_over_in_cr ? parseFloat(formData.turn_over_in_cr) : 0;
                    payload.company_website = formData.company_website || "";
                }

                // Include Step 3 data
                if (step === 3 || recordExists) {
                    payload.contact_details = formattedContactPersons;
                }
            }

            console.log(`Submitting Step ${step} payload to ${endpoint} via ${method.toUpperCase()}:`, payload);

            const response = await axios({
                method: method,
                url: endpoint,
                data: payload,
                headers: { 'Content-Type': 'application/json' }
            });

            const internalStatus = response.data?.message?.status;
            const isSuccess = response.status === 200 && (internalStatus === 200 || internalStatus === undefined || internalStatus === "success");

            if (isSuccess) {
                // Mark step as completed on success
                setCompletedSteps(prev => new Set([...prev, step]));

                if (step === 1) {
                    setCurrentStep(2);
                    setSuccess("Step 1 saved successfully!");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (step === 2) {
                    setCurrentStep(3);
                    setSuccess("Step 2 saved successfully!");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    setSuccess("Industry onboarding completed successfully!");
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1500);
                }
            } else {
                let errorMsg = "Action failed. Please try again.";
                if (response.data?._server_messages) {
                    try {
                        const messages = JSON.parse(response.data._server_messages);
                        const parsedMessage = JSON.parse(messages[0]);
                        errorMsg = parsedMessage.message || errorMsg;
                    } catch (e) {
                        errorMsg = response.data?.message?.message || response.data?.message || errorMsg;
                    }
                } else {
                    errorMsg = response.data?.message?.message || response.data?.message || errorMsg;
                }
                setError(errorMsg);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err: any) {
            console.error(`Error submitting Step ${step} data:`, err);
            let errorMessage = `Error submitting step ${step} data`;
            if (err?.response?.data?._server_messages) {
                try {
                    const messages = JSON.parse(err.response.data._server_messages);
                    const parsedMessage = JSON.parse(messages[0]);
                    errorMessage = parsedMessage.message || errorMessage;
                } catch (parseError) {
                    errorMessage = err?.response?.data?.message || err?.message || errorMessage;
                }
            } else {
                const nestedMessage = err?.response?.data?.message;
                if (typeof nestedMessage === 'object' && nestedMessage !== null) {
                    errorMessage = nestedMessage.message || errorMessage;
                } else if (typeof nestedMessage === 'string') {
                    errorMessage = nestedMessage;
                } else {
                    errorMessage = err?.message || errorMessage;
                }
            }
            setError(errorMessage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const handleContinueToStep2 = () => {
        if (validateStep1()) {
            submitStepData(1);
        }
    };

    const handleContinueToStep3 = () => {
        if (validateStep2()) {
            submitStepData(2);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep3()) {
            submitStepData(3);
        }
    };

    const goToStep1 = () => {
        setCurrentStep(1);
        setSuccess("");
        setError("");
        const userEmail = localStorage.getItem("userEmail") || currentUser || "";
        if (userEmail) fetchIndustryData(userEmail);
    };

    const goToStep2 = () => {
        setCurrentStep(2);
        setSuccess("");
        setError("");
        const userEmail = localStorage.getItem("userEmail") || currentUser || "";
        if (userEmail) fetchIndustryData(userEmail);
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1: return "Company Information";
            case 2: return "Location & Job Functions";
            case 3: return "Contact Details";
            default: return "Industry Onboarding";
        }
    };

    const getStepDescription = () => {
        switch (currentStep) {
            case 1: return "Please provide your company's basic information.";
            case 2: return "Tell us about your location and job functions.";
            case 3: return "Add contact persons.";
            default: return "";
        }
    };


    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        } else {
            router.push("/industry/dashboard");
        }
    };

    const renderStep1 = () => {
        const step1Fields: FormField[] = [
            { fieldname: "company_name", label: "Company Name", fieldtype: "Data", required: true, placeholder: "Enter company name", layout: "half" },
            {
                fieldname: "business_type", label: "Business Type", fieldtype: "Data", required: true, placeholder: "Select Business Type", layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`, apiParams: { doctype: "Business Type" },
                allowCustom: true,
                customPlaceholder: "Enter custom business type",
                mapOptions: (data) => data.map((item: any) => ({ value: item.name, label: item.name }))
            },
            { fieldname: "gst_number", label: "GST Number", fieldtype: "Data", required: false, placeholder: "Enter GST number", layout: "half" },
            {
                fieldname: "industry_sector", label: "Industry Sector", fieldtype: "Data", required: true, placeholder: "Select Industry Sector", layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`, apiParams: { doctype: "Industry Sector" },
                allowCustom: true,
                customPlaceholder: "Enter custom industry sector",
                mapOptions: (data) => data.map((item: any) => ({ value: item.name, label: item.name }))
            },
            { fieldname: "employee_head_count", label: "Employee Head Count", fieldtype: "Data", required: true, placeholder: "Enter employee count", layout: "half" },
            { fieldname: "internship_per_year", label: "Internship Per Year", fieldtype: "Data", required: true, placeholder: "Enter number of internships", layout: "half" },
            { fieldname: "average_fresher_recruited_per_year", label: "Average Fresher Recruited Per Year", fieldtype: "Data", required: true, placeholder: "Enter number of freshers recruited per year", layout: "half" }
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
                        setFormData(prev => ({ ...prev, ...data }));
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(data).forEach(key => delete updatedErrors[key]);
                        setFieldErrors(updatedErrors);
                        setError("");
                    }}
                />
                <Button type="button" onClick={handleContinueToStep2} variant="accent" className="w-full" disabled={loading}>
                    Continue to Location & Job Functions
                </Button>
            </div>
        );
    };

    const renderStep2 = () => {
        const step2Fields: FormField[] = [
            {
                fieldname: "job_function",
                label: "Job Function",
                fieldtype: "Data",
                required: false,
                placeholder: "Select Job Function",
                multiSelect: true,
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Job Function Table"
                },
                mapOptions: (data) => data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }))
            },
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
                mapOptions: (data) => data.map((country: any) => ({
                    value: country.name,
                    label: country.name
                }))
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
                mapOptions: (data) => data.map((state: any) => ({
                    value: state.name,
                    label: state.name
                }))
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
                mapOptions: (data) => data.map((district: any) => ({
                    value: district.name,
                    label: district.district_name || district.name
                })),
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
                apiParams: formData.state ? {
                    doctype: "Tahsil",
                    fields: ["name", "tahsil_name"],
                    filters: [["district", "=", formData.district]],
                    order_by: "tahsil_name asc",
                    limit_page_length: 1000
                } : undefined,
                mapOptions: (data) => data.map((tahsil: any) => ({
                    value: tahsil.name,
                    label: tahsil.name
                }))
            },
            {
                fieldname: "city",
                label: "City",
                fieldtype: "Data",
                required: true,
                placeholder: "Select City",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: formData.state ? {
                    doctype: "City",
                    fields: ["name", "city_name"],
                    filters: [["tahsil", "=", formData.tahsil]],
                    order_by: "city_name asc",
                    limit_page_length: 1000
                } : undefined,
                mapOptions: (data) => data.map((city: any) => ({
                    value: city.name,
                    label: city.name
                }))
            },
            {
                fieldname: "turn_over_in_cr",
                label: "Turn Over (in Cr)",
                fieldtype: "Data",
                required: false,
                placeholder: "Enter turnover in crores",
                layout: "half"
            },
            {
                fieldname: "company_website",
                label: "Company Website",
                fieldtype: "Data",
                required: false,
                placeholder: "https://www.company.com",
                layout: "half",
                inputClassName: "font-mono text-sm"
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
                        setFormData(prev => ({ ...prev, ...data }));
                        const updatedErrors = { ...fieldErrors };
                        Object.keys(data).forEach(key => delete updatedErrors[key]);
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
                        Continue to Contact Details
                    </Button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => {
        return (
            <div className="space-y-6">
                <div className="relative">
                    <ContactPersonsTable
                        contactPersons={contactPersons}
                        fieldErrors={fieldErrors}
                        designationOptions={designationOptions}
                        salutationOptions={salutationOptions}
                        loadingDesignations={loadingDesignations}
                        loadingSalutations={loadingSalutations}
                        onSelectDesignation={selectDesignation}
                        onPersonChange={handleContactPersonChange}
                        onRemovePerson={removeContactPerson}
                        onAddPerson={addContactPerson}
                        getSelectedDesignationLabel={getSelectedDesignationLabel}
                    />
                </div>

                <div className="flex gap-3 pt-6">
                    <Button type="button" variant="outline" onClick={goToStep2}>Back</Button>
                    <Button type="submit" variant="accent" className="flex-1" loading={loading} disabled={loading}>
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
            {success && <Alert variant="success" className="mb-4"><AlertDescription>{success}</AlertDescription></Alert>}
            {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
            <form onSubmit={handleSubmit}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </form>
        </OnboardingLayout>
    );
}