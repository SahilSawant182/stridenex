"use client";

import { useState } from "react";
import DynamicForm from "@/components/forms/DynamicForm";
import { FormField } from "@/types/doctypes.types";
import { useRouter } from "next/navigation";

export default function InstitutionOnboardingPage() {
    const [step] = useState(1);
    const router = useRouter();

    const institutionFields: FormField[] = [
        {
            fieldname: "institution_name",
            label: "Institution Name",
            fieldtype: "Data",
            required: true,
            placeholder: "e.g. Stanford University",
        },
        {
            fieldname: "institution_type",
            label: "Institution Type",
            fieldtype: "Select",
            required: true,
            options: [
                "University",
                "Vocational College",
                "Technical Institute",
                "High School",
            ],
        },
        {
            fieldname: "location",
            label: "Location",
            fieldtype: "Data",
            required: true,
            placeholder: "City, Country",
        },
        {
            fieldname: "industry_collaboration",
            label: "Areas for Industry Collaboration",
            fieldtype: "Long Text",
            required: false,
            placeholder:
                "e.g. Computer Science, Bio-Engineering, Business Management...",
            description: "Separate multiple areas with commas",
        },
    ];

    const handleSubmit = (data: any) => {
        console.log("Institution Data:", data);

        // Route to next step
        router.push("/institution/contact-details");
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row bg-[#f6f6f8] font-sans">

            {/* LEFT PANEL */}
            <div className="relative flex flex-col justify-between bg-[#1152d4] p-8 lg:w-[40%] lg:p-16 overflow-hidden text-white">

                <div>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="size-8 bg-white text-[#1152d4] rounded-lg flex items-center justify-center font-bold">
                            🎓
                        </div>
                        <h2 className="text-xl font-bold tracking-tight">
                            EduConnect ERP
                        </h2>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-8">
                        Bridging the gap between academia and industry.
                    </h1>

                    <div className="space-y-6">
                        <div className="flex items-start gap-3">
                            <span className="text-lg">✔</span>
                            <p className="text-sm text-white/80">
                                Streamlined industry partnerships.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">✔</span>
                            <p className="text-sm text-white/80">
                                Centralized academic management.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-lg">✔</span>
                            <p className="text-sm text-white/80">
                                Real-time skill gap analysis.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20 text-sm text-white/80">
                    Trusted by 500+ institutions
                </div>
            </div>

            {/* RIGHT PANEL */}
            <main className="flex-1 flex flex-col bg-white px-6 py-10 lg:px-24 lg:py-16">
                <div className="max-w-2xl mx-auto w-full">

                    {/* Step Indicator */}
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-[#1152d4] font-bold text-sm uppercase tracking-wider">
                                    Step {step} of 4
                                </span>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Institutional Identity
                                </h2>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                25% Complete
                            </span>
                        </div>

                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#1152d4] rounded-full transition-all duration-500"
                                style={{ width: "25%" }}
                            />
                        </div>
                    </div>

                    {/* Dynamic Form */}
                    <DynamicForm
                        fields={institutionFields}
                        onSubmit={handleSubmit}
                        buttonLabel="Continue to Contact Details"
                    />
                </div>

                <div className="mt-auto pt-10 text-center text-gray-400 text-xs">
                    © 2024 EduConnect ERP Platform. All rights reserved.
                </div>
            </main>
        </div>
    );
}