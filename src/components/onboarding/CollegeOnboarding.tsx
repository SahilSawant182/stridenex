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
import { ContactPersonsTable } from "@/components/ContactPersonsTable";

interface CollegeOnboardingProps {
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

  const [designationOptions, setDesignationOptions] = useState<Option[]>([]);
  const [salutationOptions, setSalutationOptions] = useState<Option[]>([]);
  const [streamOptions, setStreamOptions] = useState<Option[]>([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [loadingSalutations, setLoadingSalutations] = useState(false);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [designationError, setDesignationError] = useState("");
  const [salutationError, setSalutationError] = useState("");
  const [streamError, setStreamError] = useState("");

  const [openDesignationDropdown, setOpenDesignationDropdown] = useState<number | null>(null);
  const [openStreamDropdown, setOpenStreamDropdown] = useState<number | null>(null);

  const designationDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const streamDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
    { title: "", first_name: "", last_name: "", designation: "", contact_no: "", is_admin: false, email: "" }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    { stream: "" }
  ]);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    college_name: "",
    trust__governing_body: "",
    year_of_establishment: "",
    intake_capacity: "",
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
    approvedStatus: "Pending",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      designationDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node) && openDesignationDropdown === index) {
          setOpenDesignationDropdown(null);
        }
      });
      streamDropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node) && openStreamDropdown === index) {
          setOpenStreamDropdown(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDesignationDropdown, openStreamDropdown]);

  useEffect(() => {
    fetchDesignations();
    fetchSalutations();
    fetchStreams();
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

  const fetchDesignations = () => fetchMasterData("Designation", setDesignationOptions, setLoadingDesignations, setDesignationError);
  const fetchSalutations = () => fetchMasterData("Salutation", setSalutationOptions, setLoadingSalutations, setSalutationError);
  const fetchStreams = () => fetchMasterData("Stream", setStreamOptions, setLoadingStreams, setStreamError);

  const removeContactPerson = (index: number) => {
    if (contactPersons.length > 1) {
      setContactPersons(contactPersons.filter((_, i) => i !== index));
    }
  };

  const removeCourse = (index: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
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

  const handleCourseChange = (index: number, value: string) => {
    const updated = [...courses];
    updated[index] = { stream: value };
    setCourses(updated);
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

  const setDesignationRef = (index: number) => (el: HTMLDivElement | null) => {
    designationDropdownRefs.current[index] = el;
  };

  const setStreamRef = (index: number) => (el: HTMLDivElement | null) => {
    streamDropdownRefs.current[index] = el;
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.college_name) errors.college_name = "College name is required";
    if (!formData.trust__governing_body) errors.trust__governing_body = "Trust / Governing body is required";

    if (!formData.year_of_establishment) {
      errors.year_of_establishment = "Year of establishment is required";
    } else if (!/^\d{4}$/.test(formData.year_of_establishment)) {
      errors.year_of_establishment = "Please enter a valid 4-digit year";
    }

    if (!formData.intake_capacity) {
      errors.intake_capacity = "Intake capacity is required";
    } else if (!/^\d+$/.test(formData.intake_capacity)) {
      errors.intake_capacity = "Please enter a valid number";
    }

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
    if (!formData.state) errors.state = "State is required";
    if (!formData.district) errors.district = "District is required";
    if (!formData.tahsil) errors.tahsil = "Taluka is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.university) errors.university = "University is required";
    if (!formData.college_type) errors.college_type = "College type is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    const validCourses = courses.filter(course => course.stream);
    if (validCourses.length === 0) errors.courses = "Please select at least one stream";
    const invalidContact = contactPersons.some(
      person => !person.title || !person.first_name || !person.last_name || !person.designation || !person.contact_no
    );
    if (invalidContact) errors.contactPersons = "All contact person fields are required";
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

      const validCourses = courses.filter(course => course.stream);
      const payload = {
        college_name: formData.college_name,
        trust__governing_body: formData.trust__governing_body,
        year_of_establishment: formData.year_of_establishment ? parseInt(formData.year_of_establishment) : undefined,
        intake_capacity: formData.intake_capacity ? parseInt(formData.intake_capacity) : undefined,
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
        contact_details: formattedContactPersons,
        courses: validCourses.map(course => ({ stream: course.stream })),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.college.create_college`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && (response.data.message === "College created successfully" || response.status === 200)) {
        setSuccess("College onboarding completed successfully!");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(response.data?.message || "Failed to create college. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting college data:", err);
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
        setError(err?.response?.data?.message || err?.message || "Error submitting college data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push("/college/dashboard");
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

  const renderStep1 = () => {
    const step1Fields: FormField[] = [
      {
        fieldname: "college_name",
        label: "College Name",
        fieldtype: "Data",
        required: true,
        placeholder: "Enter college name",
        layout: "full"
      },
      {
        fieldname: "trust__governing_body",
        label: "Trust / Governing Body",
        fieldtype: "Data",
        required: true,
        placeholder: "Enter trust or governing body name",
        layout: "half"
      },
      {
        fieldname: "year_of_establishment",
        label: "Year of Establishment",
        fieldtype: "Int",
        required: true,
        placeholder: "YYYY",
        layout: "half",
        maxLength: 4
      },
      {
        fieldname: "intake_capacity",
        label: "Intake Capacity",
        fieldtype: "Int",
        required: true,
        placeholder: "Enter total intake capacity",
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
        layout: "full"
      },
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
          Continue to Location Details
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
        apiParams: { doctype: "Country" },
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
        apiParams: { doctype: "State" },
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
        fieldname: "university",
        label: "University",
        fieldtype: "Data",
        required: true,
        placeholder: "Select University",
        layout: "half",
        apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        apiParams: { doctype: "University" },
        mapOptions: (data) => data.map((university: any) => ({
          value: university.name,
          label: university.name
        }))
      },
      {
        fieldname: "college_type",
        label: "College Type",
        fieldtype: "Data",
        required: true,
        placeholder: "Select College Type",
        layout: "half",
        apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        apiParams: { doctype: "College Type" },
        mapOptions: (data) => data.map((collegeType: any) => ({
          value: collegeType.name,
          label: collegeType.name
        }))
      },
      {
        fieldname: "website",
        label: "Website",
        fieldtype: "Data",
        required: false,
        placeholder: "https://www.college.edu",
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
            Continue to Contact & Courses
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const step3Fields: FormField[] = [
      {
        fieldname: "streams",
        label: "Streams",
        fieldtype: "Data",
        required: true,
        placeholder: "Select streams",
        layout: "full",
        multiSelect: true,
        apiEndpoint: `${API_BASE_URL}/api/method/stridenex_app.api_stridenex_app.college.master.get_master_data`,
        apiParams: { doctype: "Stream" },
        mapOptions: (data) => {
          const items = data.data || data || [];
          return items.map((item: any) => ({ value: item.name, label: item.name }));
        }
      },
    ];

    return (
      <div className="space-y-6">
        <div className="relative">
          <DynamicForm
            fields={step3Fields}
            onSubmit={() => { }}
            buttonLabel=""
            loading={loading}
            errors={fieldErrors}
            initialValues={{ streams: courses.filter(c => c.stream).map(c => c.stream) }}
            onChange={(data) => {
              const selectedStreams = data.streams || [];
              if (selectedStreams.length > 0) {
                setCourses(selectedStreams.map((stream: string) => ({ stream })));
              } else {
                setCourses([{ stream: "" }]);
              }
              if (fieldErrors.courses) {
                const updatedErrors = { ...fieldErrors };
                delete updatedErrors.courses;
                setFieldErrors(updatedErrors);
              }
              setError("");
            }}
          />
          {fieldErrors.courses && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.courses}</p>
          )}
        </div>

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
          <Button type="submit" variant="accent" className="flex-1" loading={loading} disabled={loading} onClick={handleSubmit}>
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