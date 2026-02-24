"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OnboardingLayout from "./OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CollegeOnboardingProps {
  onSubmit?: (data: any) => Promise<void>;
  onSkip?: () => void;
}

interface ContactPerson {
  id: string;
  designation: string;
  contactNumber: string;
  status: 'active' | 'disabled';
  approvedStatus: 'pending' | 'approved' | 'rejected';
}

export default function CollegeOnboarding({
  onSubmit,
  onSkip
}: CollegeOnboardingProps) {
  const router = useRouter();
  const { apiKey, apiSecret } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([
    {
      id: '1',
      designation: '',
      contactNumber: '',
      status: 'active',
      approvedStatus: 'pending'
    }
  ]);
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    taluka: "",
    city: "",
    collegeName: "",
    collegeRegistrationNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactChange = (id: string, field: keyof ContactPerson, value: string) => {
    setContactPersons(prev =>
      prev.map(person =>
        person.id === id ? { ...person, [field]: value } : person
      )
    );
  };

  const addContactPerson = () => {
    const newId = (contactPersons.length + 1).toString();
    setContactPersons([
      ...contactPersons,
      {
        id: newId,
        designation: '',
        contactNumber: '',
        status: 'active',
        approvedStatus: 'pending'
      }
    ]);
  };

  const removeContactPerson = (id: string) => {
    if (contactPersons.length > 1) {
      setContactPersons(prev => prev.filter(person => person.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.state || !formData.district || !formData.taluka || !formData.city || !formData.collegeName) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Validate contact persons
      const invalidContact = contactPersons.some(
        person => !person.designation || !person.contactNumber
      );
      if (invalidContact) {
        setError("Please fill in all contact person details");
        setLoading(false);
        return;
      }

      if (onSubmit) {
        await onSubmit({ ...formData, contactPersons });
      } else {
        console.log("Submitting college data:", { ...formData, contactPersons });
        setSuccess("College onboarding completed successfully!");
        setTimeout(() => {
          router.push("/portal/dashboard");
        }, 1000);
      }
    } catch (error) {
      setError("Error submitting college data");
      console.error(error);
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

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={2}
      title="College Onboarding"
      description="Help us tailor your experience by providing your college details."
      onSkip={handleSkip}
      showSkip={true}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Location Fields - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="state" className="text-sm font-medium text-slate-700">
              State <span className="text-red-500">*</span>
            </Label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1152d4] mt-1"
            >
              <option value="">Select state</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="delhi">Delhi</option>
              <option value="tamilnadu">Tamil Nadu</option>
              <option value="gujarat">Gujarat</option>
            </select>
          </div>

          <div>
            <Label htmlFor="district" className="text-sm font-medium text-slate-700">
              District <span className="text-red-500">*</span>
            </Label>
            <select
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1152d4] mt-1"
            >
              <option value="">Select district</option>
              <option value="pune">Pune</option>
              <option value="mumbai">Mumbai</option>
              <option value="nagpur">Nagpur</option>
              <option value="thane">Thane</option>
            </select>
          </div>

          <div>
            <Label htmlFor="taluka" className="text-sm font-medium text-slate-700">
              Taluka <span className="text-red-500">*</span>
            </Label>
            <select
              id="taluka"
              name="taluka"
              value={formData.taluka}
              onChange={handleChange}
              required
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1152d4] mt-1"
            >
              <option value="">Select taluka</option>
              <option value="haveli">Haveli</option>
              <option value="mulshi">Mulshi</option>
              <option value="maval">Maval</option>
            </select>
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium text-slate-700">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
              className="mt-1"
            />
          </div>
        </div>

        {/* College Name and Registration Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="collegeName" className="text-sm font-medium text-slate-700">
              College Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="Enter college name"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="collegeRegistrationNumber" className="text-sm font-medium text-slate-700">
              College Registration Number <span className="text-slate-400 text-xs">(Optional)</span>
            </Label>
            <Input
              id="collegeRegistrationNumber"
              name="collegeRegistrationNumber"
              value={formData.collegeRegistrationNumber}
              onChange={handleChange}
              placeholder="Enter registration number"
              className="mt-1"
            />
          </div>
        </div>

        {/* Contact Persons Table */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium text-slate-700">
              Contact Persons <span className="text-red-500">*</span>
            </Label>
            <Button
              type="button"
              onClick={addContactPerson}
              className="bg-[#1152d4] hover:bg-[#0d45b5] text-white text-xs px-3 py-1.5 h-auto"
            >
              + Add Contact
            </Button>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 px-3 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
            <div className="col-span-3">Designation</div>
            <div className="col-span-3">Contact Number</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Approved Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          {contactPersons.map((person) => (
            <div key={person.id} className="grid grid-cols-12 gap-2 mb-2 items-center">
              <div className="col-span-3">
                <Input
                  value={person.designation}
                  onChange={(e) => handleContactChange(person.id, 'designation', e.target.value)}
                  placeholder="Designation"
                  required
                  className="h-8 text-xs"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="tel"
                  value={person.contactNumber}
                  onChange={(e) => handleContactChange(person.id, 'contactNumber', e.target.value)}
                  placeholder="Contact number"
                  required
                  className="h-8 text-xs"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={person.status}
                  onChange={(e) => handleContactChange(person.id, 'status', e.target.value as 'active' | 'disabled')}
                  className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="col-span-3">
                <select
                  value={person.approvedStatus}
                  onChange={(e) => handleContactChange(person.id, 'approvedStatus', e.target.value as 'pending' | 'approved' | 'rejected')}
                  className="w-full h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-1">
                {contactPersons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContactPerson(person.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-[10px] text-slate-400 mt-1">
            Add at least one contact person for the college
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-[#1152d4] hover:bg-[#0d45b5]"
            loading={loading}
            disabled={loading}
          >
            Complete Registration
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
          >
            Skip
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}