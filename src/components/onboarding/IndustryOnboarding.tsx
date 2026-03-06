"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { ChevronDown } from "lucide-react";
import axios from "axios";

interface IndustryOnboardingProps {
    onSubmit?: (data: any) => Promise<void>;
    onSkip?: () => void;
}

interface ContactPerson {
    name: string;
    designation: string;
    contact_no: string;
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
    const { apiKey, apiSecret } = useAuth();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Options state for dropdowns
    const [businessTypeOptions, setBusinessTypeOptions] = useState<Option[]>([]);
    const [industrySectorOptions, setIndustrySectorOptions] = useState<Option[]>([]);
    const [jobFunctionOptions, setJobFunctionOptions] = useState<Option[]>([]);
    const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
    const [loadingBusinessTypes, setLoadingBusinessTypes] = useState(false);
    const [loadingIndustrySectors, setLoadingIndustrySectors] = useState(false);
    const [loadingJobFunctions, setLoadingJobFunctions] = useState(false);
    const [loadingDesignations, setLoadingDesignations] = useState(false);
    const [businessTypeError, setBusinessTypeError] = useState("");
    const [industrySectorError, setIndustrySectorError] = useState("");
    const [jobFunctionError, setJobFunctionError] = useState("");
    const [designationError, setDesignationError] = useState("");

    // Dropdown open states for contact persons
    const [openDesignationDropdown, setOpenDesignationDropdown] = useState<number | null>(null);
    const designationDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Contact persons state
    const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
        { name: "", designation: "", contact_no: "" }
    ]);

    // Form data state
    const [formData, setFormData] = useState({
        company_name: "",
        business_type: "",
        gst_number: "",
        industry_sector: "",
        employee_head_count: "",
        internship_per_year: "",
        approved_status: "Pending",
        terms_and_conditions: false,
        job_function: [],
        country: "India",
        state: "",
        district: "",
        tahsil: "",
        city: "",
        turn_over_in_cr: "",
        company_website: "",
        status: "",
        average_fresher_recruited_per_year: "",
        isActive: true
    });

    // Validation errors
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Close dropdown when clicking outside
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

    // Fetch dropdown options on component mount
    useEffect(() => {
        fetchBusinessTypes();
        fetchIndustrySectors();
        fetchJobFunctions();
        fetchDesignations();
    }, []);

    const fetchBusinessTypes = async () => {
        setLoadingBusinessTypes(true);
        setBusinessTypeError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        doctype: "Business Type"
                    })
                }
            );
            const data = await response.json();

            let options: Option[] = [];
            if (Array.isArray(data)) {
                options = data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            } else if (data.data && Array.isArray(data.data)) {
                options = data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            }

            setBusinessTypeOptions(options);
        } catch (err: any) {
            console.error("Error fetching business types:", err);
            setBusinessTypeError("Failed to load business types");
        } finally {
            setLoadingBusinessTypes(false);
        }
    };

    const fetchIndustrySectors = async () => {
        setLoadingIndustrySectors(true);
        setIndustrySectorError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        doctype: "Industry Sector"
                    })
                }
            );
            const data = await response.json();

            let options: Option[] = [];
            if (Array.isArray(data)) {
                options = data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            } else if (data.data && Array.isArray(data.data)) {
                options = data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            }

            setIndustrySectorOptions(options);
        } catch (err: any) {
            console.error("Error fetching industry sectors:", err);
            setIndustrySectorError("Failed to load industry sectors");
        } finally {
            setLoadingIndustrySectors(false);
        }
    };

    const fetchJobFunctions = async () => {
        setLoadingJobFunctions(true);
        setJobFunctionError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        doctype: "Job Function"
                    })
                }
            );
            const data = await response.json();

            let options: Option[] = [];
            if (Array.isArray(data)) {
                options = data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            } else if (data.data && Array.isArray(data.data)) {
                options = data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            }

            setJobFunctionOptions(options);
        } catch (err: any) {
            console.error("Error fetching job functions:", err);
            setJobFunctionError("Failed to load job functions");
        } finally {
            setLoadingJobFunctions(false);
        }
    };

    const fetchDesignations = async () => {
        setLoadingDesignations(true);
        setDesignationError("");
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        doctype: "Designation"
                    })
                }
            );
            const data = await response.json();

            let options: Option[] = [];
            if (Array.isArray(data)) {
                options = data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            } else if (data.data && Array.isArray(data.data)) {
                options = data.data.map((item: any) => ({
                    value: item.name,
                    label: item.name
                }));
            }

            setDesignationOptions(options);
        } catch (err: any) {
            console.error("Error fetching designations:", err);
            setDesignationError("Failed to load designations");
        } finally {
            setLoadingDesignations(false);
        }
    };

    const handleContactPersonChange = (index: number, field: keyof ContactPerson, value: string) => {
        const updated = [...contactPersons];
        updated[index] = { ...updated[index], [field]: value };
        setContactPersons(updated);

        if (fieldErrors.contactPersons) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.contactPersons;
                return newErrors;
            });
        }
    };

    const addContactPerson = () => {
        setContactPersons([...contactPersons, { name: "", designation: "", contact_no: "" }]);
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

    // ============ STEP FUNCTIONS ============
    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.company_name) {
            errors.company_name = "Company name is required";
        }
        if (!formData.business_type) {
            errors.business_type = "Business type is required";
        }
        if (!formData.industry_sector) {
            errors.industry_sector = "Industry sector is required";
        }
        if (!formData.employee_head_count) {
            errors.employee_head_count = "Employee head count is required";
        }
        if (!formData.internship_per_year) {
            errors.internship_per_year = "Internship per year is required";
        }
        if (!formData.approved_status) {
            errors.approved_status = "Approved status is required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.job_function || formData.job_function.length === 0) {
            errors.job_function = "Job function is required";
        }
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

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep3 = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.average_fresher_recruited_per_year) {
            errors.average_fresher_recruited_per_year = "Average fresher recruited per year is required";
        }

        const invalidContact = contactPersons.some(
            person => !person.name || !person.designation || !person.contact_no
        );
        if (invalidContact) {
            errors.contactPersons = "All contact person fields are required";
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
            case 3: return "Add contact persons and additional details.";
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
            // Filter out empty rows from contact persons
            const validContactPersons = contactPersons.filter(
                person => person.name && person.designation && person.contact_no
            );

            // Format mobile numbers with +91- prefix
            const formattedContactPersons = validContactPersons.map(person => ({
                name1: person.name,
                designation: person.designation,
                contact_no: `+91-${person.contact_no.replace(/\D/g, '')}`
            }));

            // Format job function as array of objects
            const jobFunctionArray = (formData.job_function || []).map((jobFunc: string) => ({
                job_function: jobFunc
            }));

            const payload = {
                company_name: formData.company_name,
                contact_details: formattedContactPersons,
                business_type: formData.business_type,
                gst_number: formData.gst_number || undefined,
                industry_sector: formData.industry_sector,
                employee_head_count: formData.employee_head_count ? parseInt(formData.employee_head_count) : undefined,
                internship_per_year: formData.internship_per_year ? parseInt(formData.internship_per_year) : undefined,
                approved_status: formData.approved_status,
                terms_and_conditions: formData.terms_and_conditions ? "Accepted" : "Not Accepted",
                job_functions: jobFunctionArray,
                country: formData.country,
                state: formData.state,
                district: formData.district,
                taluka: formData.tahsil,
                city: formData.city,
                turn_over_in_cr: formData.turn_over_in_cr ? parseFloat(formData.turn_over_in_cr) : undefined,
                company_website: formData.company_website || undefined,
                average_fresher_recruited_per_year: formData.average_fresher_recruited_per_year ?
                    parseInt(formData.average_fresher_recruited_per_year) : undefined,
                status: formData.status,
                is_active: formData.isActive ? 1 : 0
            };

            const cleanPayload = Object.fromEntries(
                Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null)
            );

            console.log("Submitting industry data:", cleanPayload);

            const response = await axios.post(
                `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.industry.industry.create_industry`,
                cleanPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("API Response:", response.data);

            if (response.status === 200) {
                setSuccess("Industry onboarding completed successfully!");
                setTimeout(() => {
                    router.push("/portal/dashboard");
                }, 1500);
            } else {
                setError(response.data?.message || "Failed to create industry. Please try again.");
            }
        } catch (err: any) {
            console.error("Error submitting industry data:", err);
            setError(err?.response?.data?.message || err?.message || "Error submitting industry data");
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
                fieldname: "company_name",
                label: "Company Name",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter company name",
                layout: "half"
            },
            {
                fieldname: "business_type",
                label: "Business Type",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Business Type",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Business Type"
                },
                mapOptions: (data) => {
                    return data.map((item: any) => ({
                        value: item.name,
                        label: item.name
                    }));
                }
            },
            {
                fieldname: "gst_number",
                label: "GST Number",
                fieldtype: "Data",
                required: false,
                placeholder: "Enter GST number",
                layout: "half"
            },
            {
                fieldname: "industry_sector",
                label: "Industry Sector",
                fieldtype: "Data",
                required: true,
                placeholder: "Select Industry Sector",
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Industry Sector"
                },
                mapOptions: (data) => {
                    return data.map((item: any) => ({
                        value: item.name,
                        label: item.name
                    }));
                }
            },
            {
                fieldname: "employee_head_count",
                label: "Employee Head Count",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter employee count",
                layout: "half"
            },
            {
                fieldname: "internship_per_year",
                label: "Internship Per Year",
                fieldtype: "Data",
                required: true,
                placeholder: "Enter number of internships",
                layout: "half"
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
                    return data.map((item: any) => ({
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
                required: true,
                placeholder: "Select Job Function",
                multiSelect: true,
                layout: "half",
                apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
                apiParams: {
                    doctype: "Job Function Table"
                },
                mapOptions: (data) => {
                    return data.map((item: any) => ({
                        value: item.name,
                        label: item.name
                    }));
                }
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
                mapOptions: (data) => {
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
                    return data.map((city: any) => ({
                        value: city.name,
                        label: city.name
                    }));
                }
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
            },
            {
                fieldname: "status",
                label: "Status",
                fieldtype: "Select",
                required: true,
                placeholder: "Select Status",
                layout: "half",
                options: ["Active", "Disable"]
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
                        Continue to Contact Details
                    </Button>
                </div>
            </div>
        );
    };

    const renderStep3 = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <Label htmlFor="average_fresher_recruited_per_year" className="text-sm font-medium text-slate-700">
                        Average Fresher Recruited Per Year *
                    </Label>
                    <Input
                        id="average_fresher_recruited_per_year"
                        value={formData.average_fresher_recruited_per_year}
                        onChange={(e) => setFormData(prev => ({ ...prev, average_fresher_recruited_per_year: e.target.value }))}
                        placeholder="Enter number of freshers"
                        className="mt-1 h-10 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                    />
                </div>
            </div>

            {/* Contact Persons Table */}
            <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium text-slate-700">
                        Contact Details *
                    </Label>
                    <Button
                        type="button"
                        onClick={addContactPerson}
                        variant="accent"
                        className="h-8 px-3 text-xs"
                    >
                        + Add row
                    </Button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 mb-2 px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
                    <div className="col-span-1">No.</div>
                    <div className="col-span-3">Name *</div>
                    <div className="col-span-4">Designation *</div>
                    <div className="col-span-4">Contact No. *</div>
                </div>

                {/* Table Rows */}
                {contactPersons.map((person, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <div className="col-span-1 text-sm text-slate-600">{index + 1}</div>
                        <div className="col-span-3">
                            <Input
                                value={person.name}
                                onChange={(e) => handleContactPersonChange(index, 'name', e.target.value)}
                                placeholder="Name"
                                required
                                className="h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                            />
                        </div>
                        <div className="col-span-4">
                            <div className="relative" ref={setDesignationRef(index)}>
                                <div
                                    onClick={() => !loadingDesignations && toggleDesignationDropdown(index)}
                                    className={`w-full h-9 px-3 rounded-md border ${designationError ? "border-red-500" : "border-slate-200"} bg-white text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${loadingDesignations ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    tabIndex={0}
                                >
                                    <span className={`truncate ${!person.designation ? "text-slate-400" : "text-slate-900"}`}>
                                        {loadingDesignations ? "Loading designations..." : getSelectedDesignationLabel(person.designation)}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openDesignationDropdown === index ? "rotate-180" : ""}`} />
                                </div>

                                {openDesignationDropdown === index && (
                                    <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                                        <div className="py-1">
                                            {designationOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => selectDesignation(index, option.value)}
                                                    className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors ${person.designation === option.value ? "bg-[#1152d4]/5" : ""}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${person.designation === option.value ? "border-[#1152d4]" : "border-slate-300"}`}>
                                                        {person.designation === option.value && (
                                                            <div className="w-2 h-2 rounded-full bg-[#1152d4]" />
                                                        )}
                                                    </div>
                                                    <span className={`flex-1 ${person.designation === option.value ? "text-[#1152d4] font-medium" : "text-slate-700"}`}>
                                                        {option.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-4">
                            <Input
                                type="tel"
                                value={person.contact_no}
                                onChange={(e) => handleContactPersonChange(index, 'contact_no', e.target.value)}
                                placeholder="Contact number"
                                required
                                className="h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4]"
                            />
                        </div>
                    </div>
                ))}
                {fieldErrors.contactPersons && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.contactPersons}</p>
                )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="terms_and_conditions"
                        checked={formData.terms_and_conditions}
                        onCheckedChange={(checked) =>
                            setFormData(prev => ({ ...prev, terms_and_conditions: checked as boolean }))
                        }
                    />
                    <Label htmlFor="terms_and_conditions" className="text-sm font-medium text-slate-700 cursor-pointer">
                        Terms and Conditions
                    </Label>
                </div>
            </div>

            {/* Status Checkbox */}
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
                        Active
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