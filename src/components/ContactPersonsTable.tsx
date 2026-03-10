"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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

interface ContactPersonsTableProps {
    contactPersons: ContactPerson[];
    fieldErrors: Record<string, string>;
    designationOptions: Option[];
    salutationOptions: Option[];
    loadingDesignations: boolean;
    loadingSalutations: boolean;
    designationError: string;
    salutationError: string;
    openDesignationDropdown: number | null;
    onToggleDesignation: (index: number) => void;
    onSelectDesignation: (index: number, value: string) => void;
    onPersonChange: (index: number, field: keyof ContactPerson, value: string | boolean) => void;
    onRemovePerson: (index: number) => void;
    onAddPerson: () => void;
    onRetryDesignations: () => void;
    onRetrySalutations: () => void;
    setDesignationRef: (index: number) => (el: HTMLDivElement | null) => void;
    getSelectedDesignationLabel: (value: string) => string;
}

export const ContactPersonsTable: React.FC<ContactPersonsTableProps> = ({
    contactPersons,
    fieldErrors,
    designationOptions,
    salutationOptions,
    loadingDesignations,
    loadingSalutations,
    designationError,
    salutationError,
    openDesignationDropdown,
    onToggleDesignation,
    onSelectDesignation,
    onPersonChange,
    onRemovePerson,
    onAddPerson,
    onRetryDesignations,
    onRetrySalutations,
    setDesignationRef,
    getSelectedDesignationLabel,
}) => {
    const [openTitleDropdown, setOpenTitleDropdown] = useState<number | null>(null);
    const titleDropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            titleDropdownRefs.current.forEach((ref, index) => {
                if (ref && !ref.contains(event.target as Node) && openTitleDropdown === index) {
                    setOpenTitleDropdown(null);
                }
            });
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openTitleDropdown]);

    const getSelectedTitleLabel = (value: string) => {
        if (!value) return "Select";
        const option = salutationOptions.find(opt => opt.value === value);
        return option ? option.label : "Select";
    };

    return (
        <div className="mt-2 w-full">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Contact Persons
            </Label>

            {/* Table Header */}
            <div className="grid grid-cols-7 gap-3 mb-2 px-4 py-2 bg-slate-50 rounded-lg text-xs font-medium text-slate-600">
                <div className="col-span-1">Title *</div>
                <div className="col-span-1">First Name *</div>
                <div className="col-span-1">Last Name *</div>
                <div className="col-span-1">Designation *</div>
                <div className="col-span-1">Contact No. *</div>
                <div className="col-span-1">Email *</div>
                <div className="col-span-1 text-center">Is Admin</div>
            </div>

            {/* Table Rows */}
            {contactPersons.map((person, index) => (
                <div key={index} className="flex items-start gap-3 mb-2 group relative">
                    <div className="flex-1 grid grid-cols-7 gap-3">
                        {/* Title Dropdown - Custom styled like designation */}
                        <div className="col-span-1 relative">
                            <div 
                                className="relative" 
                                ref={el => { titleDropdownRefs.current[index] = el; }}
                            >
                                <div
                                    onClick={() => !loadingSalutations && setOpenTitleDropdown(openTitleDropdown === index ? null : index)}
                                    className={`w-full h-9 px-3 rounded-md border ${fieldErrors.contactPersons && !person.title ? "border-red-500" : salutationError ? "border-red-500" : "border-slate-200"} bg-white text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${loadingSalutations ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    tabIndex={0}
                                >
                                    <span className={`truncate ${!person.title ? "text-slate-400" : "text-slate-900"}`}>
                                        {loadingSalutations ? "Loading..." : getSelectedTitleLabel(person.title)}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openTitleDropdown === index ? "rotate-180" : ""}`} />
                                </div>

                                {openTitleDropdown === index && (
                                    <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                                        <div className="py-1">
                                            {salutationOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => {
                                                        onPersonChange(index, 'title', option.value);
                                                        setOpenTitleDropdown(null);
                                                    }}
                                                    className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors ${person.title === option.value ? "bg-[#1152d4]/5" : ""}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${person.title === option.value ? "border-[#1152d4]" : "border-slate-300"}`}>
                                                        {person.title === option.value && (
                                                            <div className="w-2 h-2 rounded-full bg-[#1152d4]" />
                                                        )}
                                                    </div>
                                                    <span className={`flex-1 ${person.title === option.value ? "text-[#1152d4] font-medium" : "text-slate-700"}`}>
                                                        {option.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {salutationError && (
                                    <div className="mt-1">
                                        <p className="text-xs text-red-500 inline">{salutationError}. </p>
                                        <button
                                            type="button"
                                            onClick={onRetrySalutations}
                                            className="text-xs text-[#1152d4] underline font-medium hover:no-underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* First Name */}
                        <div className="col-span-1">
                            <Input
                                value={person.first_name}
                                onChange={(e) => onPersonChange(index, 'first_name', e.target.value)}
                                placeholder="First name"
                                required
                                className={`h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${fieldErrors.contactPersons && !person.first_name ? "border-red-500" : ""}`}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="col-span-1">
                            <Input
                                value={person.last_name}
                                onChange={(e) => onPersonChange(index, 'last_name', e.target.value)}
                                placeholder="Last name"
                                required
                                className={`h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${fieldErrors.contactPersons && !person.last_name ? "border-red-500" : ""}`}
                            />
                        </div>

                        {/* Designation dropdown */}
                        <div className="col-span-1 relative">
                            <div className="relative" ref={setDesignationRef(index)}>
                                <div
                                    onClick={() => !loadingDesignations && onToggleDesignation(index)}
                                    className={`w-full h-9 px-3 rounded-md border ${fieldErrors.contactPersons && !person.designation ? "border-red-500" : designationError ? "border-red-500" : "border-slate-200"} bg-white text-sm text-slate-900 flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${loadingDesignations ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    tabIndex={0}
                                >
                                    <span className={`truncate ${!person.designation ? "text-slate-400" : "text-slate-900"}`}>
                                        {loadingDesignations ? "Loading..." : getSelectedDesignationLabel(person.designation)}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${openDesignationDropdown === index ? "rotate-180" : ""}`} />
                                </div>

                                {openDesignationDropdown === index && (
                                    <div className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
                                        <div className="py-1">
                                            {designationOptions.map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => onSelectDesignation(index, option.value)}
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

                                {designationError && (
                                    <div className="mt-1">
                                        <p className="text-xs text-red-500 inline">{designationError}. </p>
                                        <button
                                            type="button"
                                            onClick={onRetryDesignations}
                                            className="text-xs text-[#1152d4] underline font-medium hover:no-underline"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="col-span-1">
                            <Input
                                type="tel"
                                value={person.contact_no}
                                onChange={(e) => onPersonChange(index, 'contact_no', e.target.value)}
                                placeholder="Contact number"
                                required
                                maxLength={10}
                                className={`h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${fieldErrors.contactPersons && !person.contact_no ? "border-red-500" : ""}`}
                            />
                        </div>

                        {/* Email */}
                        <div className="col-span-1">
                            <Input
                                value={person.email || ""}
                                onChange={(e) => onPersonChange(index, 'email', e.target.value)}
                                placeholder="Email"
                                required
                                type="email"
                                className={`h-9 text-sm focus:ring-2 focus:ring-[#1152d4] focus:border-[#1152d4] ${fieldErrors.contactPersons && !person.email ? "border-red-500" : ""}`}
                            />
                        </div>

                        {/* Is Admin Checkbox */}
                        <div className="col-span-1 flex items-center justify-center">
                            <Checkbox
                                id={`is_admin_${index}`}
                                checked={person.is_admin || false}
                                onCheckedChange={(checked) => onPersonChange(index, 'is_admin', checked as boolean)}
                                className="h-5 w-5"
                            />
                        </div>
                    </div>

                    {/* Delete button */}
                    {contactPersons.length > 1 && (
                        <div className="w-8 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => onRemovePerson(index)}
                                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                                title="Remove row"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 4V3c0-1 1-2 2-2h4c1 0 2 1 2 2v1"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {/* Add row button */}
            <div className="flex justify-end mt-3">
                <Button
                    type="button"
                    onClick={onAddPerson}
                    variant="outline"
                    className="h-8 px-4 text-xs border-accent/20 text-accent hover:bg-accent hover:text-white transition-colors"
                >
                    + Add Contact Person
                </Button>
            </div>

            {fieldErrors.contactPersons && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.contactPersons}</p>
            )}
        </div>
    );
};