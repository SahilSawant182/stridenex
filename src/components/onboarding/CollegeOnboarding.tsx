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

interface CollegeOnboardingProps {
  onSubmit?: (data: any) => Promise<void>;
  onSkip?: () => void;
}

interface ContactPerson {
  name: string;
  designation: string;
  contact_no: string;
}

interface Course {
  stream: string;
}

interface Option {
  value: string;
  label: string;
}

type Step = 1 | 2 | 3;

const API_BASE_URL = "https://devstridenex.quantcloud.in";

export default function CollegeOnboarding({
  onSubmit,
  onSkip
}: CollegeOnboardingProps) {
  const router = useRouter();
  const { apiKey, apiSecret } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Options state for dropdowns
  const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
  const [streamOptions, setStreamOptions] = useState<Option[]>([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [designationError, setDesignationError] = useState("");
  const [streamError, setStreamError] = useState("");

  // Dropdown open states
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState<number | null>(null);
  const [openStreamDropdown, setOpenStreamDropdown] = useState<number | null>(null);

  // Refs for dropdowns
  const designationDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const streamDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Contact persons state
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
    { name: "", designation: "", contact_no: "" }
  ]);

  // Courses state
  const [courses, setCourses] = useState<Course[]>([
    { stream: "" }
  ]);

  // Validation errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form data state
  const [formData, setFormData] = useState({
    college_name: "",
    country: "India",
    college_code: "",
    state: "",
    university: "",
    district: "",
    college_type: "",
    tahsil: "",
    website: "",
    city: "",
    email: "",
    isActive: true,
    approvedStatus: "Pending"
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close designation dropdowns
      designationDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node) && openDesignationDropdown === index) {
          setOpenDesignationDropdown(null);
        }
      });

      // Close stream dropdowns
      streamDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node) && openStreamDropdown === index) {
          setOpenStreamDropdown(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDesignationDropdown, openStreamDropdown]);

  // Fetch designations on component mount
  useEffect(() => {
    fetchDesignations();
  }, []);

  // Fetch streams on component mount
  useEffect(() => {
    fetchStreams();
  }, []);

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
      console.log("Designation data received:", data);

      // Handle the response structure
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
      } else if (data.message && Array.isArray(data.message)) {
        options = data.message.map((item: any) => ({
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

  const fetchStreams = async () => {
    setLoadingStreams(true);
    setStreamError("");
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctype: "Stream"
          })
        }
      );
      const data = await response.json();
      console.log("Stream data received:", data);

      // Handle the response structure
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
      } else if (data.message && Array.isArray(data.message)) {
        options = data.message.map((item: any) => ({
          value: item.name,
          label: item.name
        }));
      }

      setStreamOptions(options);
    } catch (err: any) {
      console.error("Error fetching streams:", err);
      setStreamError("Failed to load streams");
    } finally {
      setLoadingStreams(false);
    }
  };

  const handleContactPersonChange = (index: number, field: keyof ContactPerson, value: string) => {
    const updated = [...contactPersons];
    updated[index] = { ...updated[index], [field]: value };
    setContactPersons(updated);

    // Clear contact person errors when user starts typing
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

  const handleCourseChange = (index: number, value: string) => {
    const updated = [...courses];
    updated[index] = { stream: value };
    setCourses(updated);

    // Clear course errors when user starts typing
    if (fieldErrors.courses) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.courses;
        return newErrors;
      });
    }
  };

  const addCourse = () => {
    setCourses([...courses, { stream: "" }]);
  };

  const retryFetchDesignations = () => {
    fetchDesignations();
  };

  const retryFetchStreams = () => {
    fetchStreams();
  };

  const toggleDesignationDropdown = (index: number) => {
    setOpenDesignationDropdown(openDesignationDropdown === index ? null : index);
  };

  const toggleStreamDropdown = (index: number) => {
    setOpenStreamDropdown(openStreamDropdown === index ? null : index);
  };

  const selectDesignation = (index: number, value: string) => {
    handleContactPersonChange(index, 'designation', value);
    setOpenDesignationDropdown(null);
  };

  const selectStream = (index: number, value: string) => {
    handleCourseChange(index, value);
    setOpenStreamDropdown(null);
  };

  const getSelectedDesignationLabel = (value: string) => {
    if (!value) return "Select Designation";
    const option = designationOptions.find(opt => opt.value === value);
    return option ? option.label : "Select Designation";
  };

  const getSelectedStreamLabel = (value: string) => {
    if (!value) return "Select Stream";
    const option = streamOptions.find(opt => opt.value === value);
    return option ? option.label : "Select Stream";
  };

  // Function to set refs correctly
  const setDesignationRef = (index: number) => (el: HTMLDivElement | null) => {
    designationDropdownRefs.current[index] = el;
  };

  const setStreamRef = (index: number) => (el: HTMLDivElement | null) => {
    streamDropdownRefs.current[index] = el;
  };

  // ============ STEP FUNCTIONS ============
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate college name
    if (!formData.college_name) {
      errors.college_name = "College name is required";
    }

    // Validate email
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate location fields
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
    if (!formData.university) {
      errors.university = "University is required";
    }
    if (!formData.college_type) {
      errors.college_type = "College type is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate contact persons
    const invalidContact = contactPersons.some(
      person => !person.name || !person.designation || !person.contact_no
    );
    if (invalidContact) {
      errors.contactPersons = "All contact person fields are required";
    }

    // Validate courses
    const invalidCourse = courses.some(course => !course.stream);
    if (invalidCourse) {
      errors.courses = "All course fields are required";
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
      const validContactPersons = contactPersons.filter(
        person => person.name && person.designation && person.contact_no
      );

      const validCourses = courses.filter(course => course.stream);
      const payload = {
        college_name: formData.college_name,
        email: formData.email,
        college_code: formData.college_code || undefined,
        country: "India",
        state: formData.state,
        district: formData.district,
        taluka: formData.tahsil,
        city: formData.city,
        university: formData.university,
        college_type: formData.college_type,
        website: formData.website || undefined,
        is_active: formData.isActive ? 1 : 0,
        approved_status: formData.approvedStatus,
        contact_details: validContactPersons.map(person => ({
          name: person.name,
          designation: person.designation,
          contact_no: person.contact_no
        })),
        courses: validCourses.map(course => ({
          stream: course.stream
        }))
      };

      console.log("Submitting college data:", payload);

      const response = await axios.post(
        `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.college.create_college`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("API Response:", response.data);

      if (response.data && (response.data.message === "College created successfully" || response.status === 200)) {
        setSuccess("College onboarding completed successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(response.data?.message || "Failed to create college. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting college data:", err);

      // Better error parsing
      if (err?.response?.data?._server_messages) {
        try {
          const messages = JSON.parse(err.response.data._server_messages);
          const parsedMessage = JSON.parse(messages[0]);
          setError(parsedMessage.message || "Validation error");
        } catch {
          setError(err?.response?.data?.message || "Error submitting data");
        }
      } else if (err?.response?.status === 401) {
        setError("Authentication required. Please contact support.");
      } else {
        const errorMessage = err?.response?.data?.message ||
          err?.message ||
          "Error submitting college data. Please check your connection and try again.";
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic College Information";
      case 2: return "Location & Affiliation";
      case 3: return "Contact & Courses";
      default: return "College Onboarding";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Please provide basic information about your college.";
      case 2: return "Tell us about your college's location and affiliation.";
      case 3: return "Add contact persons and courses offered.";
      default: return "";
    }
  };

  // ============ RENDER FUNCTIONS ============
  const renderStep1 = () => {
    const step1Fields: FormField[] = [
      {
        fieldname: "college_name",
        label: "College Name",
        fieldtype: "Data",
        required: true,
        placeholder: "Enter college name",
        layout: "half"
      },
      {
        fieldname: "email",
        label: "Email Address",
        fieldtype: "Data",
        required: true,
        placeholder: "Enter college email address",
        layout: "half"
      },
      {
        fieldname: "college_code",
        label: "College Code (Registration Number)",
        fieldtype: "Data",
        required: false,
        placeholder: "Enter registration number",
        layout: "half"
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
          console.log("Country data received in mapOptions:", data);
          return data.map((country: any) => ({
            value: country.name,
            label: country.name
          }));
        }
      },
      {
        fieldname: "approvedStatus",
        label: "Approved Status (Workflow)",
        fieldtype: "Select",
        required: true,
        placeholder: "Select Approved Status",
        layout: "half",
        options: ["Pending", "Approved", "Rejected"]
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

        {/* Only Continue button here - no Back button on step 1 */}
        <Button
          type="button"
          onClick={handleContinueToStep2}
          variant="accent"
          className="w-full"
          disabled={loading}
        >
          Continue to Location Details
        </Button>
      </div>
    );
  };

  const renderStep2 = () => {
    const step2Fields: FormField[] = [
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
          console.log("State data received in mapOptions:", data);
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
          console.log("Taluka data received in mapOptions:", data);
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
          console.log("City data received in mapOptions:", data);
          return data.map((city: any) => ({
            value: city.name,
            label: city.name
          }));
        }
      },
      {
        fieldname: "university",
        label: "University",
        fieldtype: "Data",
        required: true,
        placeholder: "Select University",
        layout: "half",
        apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        apiParams: {
          doctype: "University"
        },
        mapOptions: (data) => {
          console.log("University data received in mapOptions:", data);
          return data.map((university: any) => ({
            value: university.name,
            label: university.name
          }));
        }
      },
      {
        fieldname: "college_type",
        label: "College Type",
        fieldtype: "Data",
        required: true,
        placeholder: "Select College Type",
        layout: "half",
        apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        apiParams: {
          doctype: "College Type"
        },
        mapOptions: (data) => {
          console.log("College Type data received in mapOptions:", data);
          return data.map((collegeType: any) => ({
            value: collegeType.name,
            label: collegeType.name
          }));
        }
      },
      {
        fieldname: "website",
        label: "Website",
        fieldtype: "Data",
        required: false,
        placeholder: "https://www.college.edu",
        layout: "full",
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
          onChange={(data) => {
            setFormData(prev => ({
              ...prev,
              ...data
            }));
            setFieldErrors({});
            setError("");
          }}
        />

        {/* Buttons - Back is small, Continue is large (flex-1) like student onboarding */}
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
            Continue to Contact & Courses
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4">
      {/* Is Active Checkbox */}
      <div className="p-4 bg-slate-50 rounded-lg">
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

      {/* Contact Persons Table */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-slate-700">
            Contact Persons
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
              {/* Designation dropdown */}
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

                {/* Dropdown menu */}
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

                {/* Error and retry for designations */}
                {designationError && (
                  <div className="mt-1">
                    <p className="text-xs text-red-500 inline">{designationError}. </p>
                    <button
                      type="button"
                      onClick={retryFetchDesignations}
                      className="text-xs text-[#1152d4] underline font-medium hover:no-underline"
                    >
                      Retry
                    </button>
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

      {/* Courses Table */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-slate-700">
            Courses
          </Label>
          <Button
            type="button"
            onClick={addCourse}
            variant="accent"
            className="h-8 px-3 text-xs"
          >
            + Add row
          </Button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 mb-2 px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
          <div className="col-span-1">No.</div>
          <div className="col-span-11">Stream</div>
        </div>

        {/* Table Rows */}
        {courses.map((course, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
            <div className="col-span-1 text-sm text-slate-600">{index + 1}</div>
            <div className="col-span-11">
              {/* Stream dropdown */}
              <div className="relative" ref={setStreamRef(index)}>
                <div
                  onClick={() => !loadingStreams && toggleStreamDropdown(index)}
                  className={`w-full h-9 px-3 rounded-md border ${streamError ? "border-red-500" : "border-slate-200"} bg-white text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${loadingStreams ? 'opacity-60 cursor-not-allowed' : ''}`}
                  tabIndex={0}
                >
                  <span className={`truncate ${!course.stream ? "text-slate-400" : "text-slate-900"}`}>
                    {loadingStreams ? "Loading streams..." : getSelectedStreamLabel(course.stream)}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openStreamDropdown === index ? "rotate-180" : ""}`} />
                </div>

                {/* Dropdown menu */}
                {openStreamDropdown === index && (
                  <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                    <div className="py-1">
                      {streamOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => selectStream(index, option.value)}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors ${course.stream === option.value ? "bg-[#1152d4]/5" : ""}`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${course.stream === option.value ? "border-[#1152d4]" : "border-slate-300"}`}>
                            {course.stream === option.value && (
                              <div className="w-2 h-2 rounded-full bg-[#1152d4]" />
                            )}
                          </div>
                          <span className={`flex-1 ${course.stream === option.value ? "text-[#1152d4] font-medium" : "text-slate-700"}`}>
                            {option.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error and retry for streams */}
                {streamError && (
                  <div className="mt-1">
                    <p className="text-xs text-red-500 inline">{streamError}. </p>
                    <button
                      type="button"
                      onClick={retryFetchStreams}
                      className="text-xs text-[#1152d4] underline font-medium hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {fieldErrors.courses && (
          <p className="text-xs text-red-500 mt-1">{fieldErrors.courses}</p>
        )}
      </div>

      {/* Action Buttons - Back is small, Complete Registration is large */}
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