"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";

interface ContactPerson {
    title: string;
    first_name: string;
    last_name: string;
    designation: string;
    contact_no: string;
    email?: string;
    is_admin?: boolean;
}

interface Option {
    value?: string;
    label?: string;
    name?: string;
}

interface Props {
    contactPersons: ContactPerson[];
    designationOptions: Option[];
    salutationOptions: Option[];
    fieldErrors?: Record<string, string>;
    loadingDesignations: boolean;
    loadingSalutations: boolean;
    onSelectDesignation: (index: number, value: string) => void;
    onPersonChange: (
        index: number,
        field: keyof ContactPerson,
        value: string | boolean
    ) => void;
    onRemovePerson: (index: number) => void;
    onAddPerson: () => void;
    getSelectedDesignationLabel: (value: string) => string;
}

export const ContactPersonsTable: React.FC<Props> = ({
    contactPersons,
    designationOptions,
    salutationOptions,
    loadingDesignations,
    loadingSalutations,
    onSelectDesignation,
    onPersonChange,
    onRemovePerson,
    onAddPerson,
    getSelectedDesignationLabel
}) => {

    const [openTitle, setOpenTitle] = useState<number | null>(null);
    const [openDesignation, setOpenDesignation] = useState<number | null>(null);

    const titleButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const designationButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const [titleDropdownPos, setTitleDropdownPos] = useState<{
        top: number;
        left: number;
        width: number;
        index: number;
    } | null>(null);

    const [designationDropdownPos, setDesignationDropdownPos] = useState<{
        top: number;
        left: number;
        width: number;
        index: number;
    } | null>(null);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const titleOptions = salutationOptions.map((o: any) => ({
        value: o.value || o.name,
        label: o.label || o.name
    }));

    const getTitle = (value: string) => {
        if (!value) return "Select";
        const found = titleOptions.find(o => o.value === value);
        return found ? found.label : value;
    };

    // Update dropdown position when scrolling
    useEffect(() => {
        const handleScroll = () => {
  requestAnimationFrame(() => {

    const table = tableContainerRef.current;
    if (!table) return;

    const tableRect = table.getBoundingClientRect();

    if (openTitle !== null) {
      const button = titleButtonRefs.current[openTitle];

      if (button) {
        const rect = button.getBoundingClientRect();

        // check if button is outside table viewport
        if (
          rect.bottom < tableRect.top ||
          rect.top > tableRect.bottom
        ) {
          setOpenTitle(null);
          setTitleDropdownPos(null);
          return;
        }

        setTitleDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: 200,
          index: openTitle
        });
      }
    }

    if (openDesignation !== null) {
      const button = designationButtonRefs.current[openDesignation];

      if (button) {
        const rect = button.getBoundingClientRect();

        if (
          rect.bottom < tableRect.top ||
          rect.top > tableRect.bottom
        ) {
          setOpenDesignation(null);
          setDesignationDropdownPos(null);
          return;
        }

        setDesignationDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: 220,
          index: openDesignation
        });
      }
    }

  });
};

        const tableContainer = tableContainerRef.current;
        if (tableContainer) {
            tableContainer.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (tableContainer) {
                tableContainer.removeEventListener('scroll', handleScroll);
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, [openTitle, openDesignation]);

    const handleTitleClick = (index: number) => {
        if (openTitle === index) {
            setOpenTitle(null);
            setTitleDropdownPos(null);
        } else {
            const button = titleButtonRefs.current[index];
            if (button) {
                const rect = button.getBoundingClientRect();
                setTitleDropdownPos({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: 200, // Increased width for title dropdown
                    index: index
                });
                setOpenTitle(index);
                setOpenDesignation(null);
                setDesignationDropdownPos(null);
            }
        }
    };

    const handleDesignationClick = (index: number) => {
        if (openDesignation === index) {
            setOpenDesignation(null);
            setDesignationDropdownPos(null);
        } else {
            const button = designationButtonRefs.current[index];
            if (button) {
                const rect = button.getBoundingClientRect();
                setDesignationDropdownPos({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: 220,
                    index: index
                });
                setOpenDesignation(index);
                setOpenTitle(null);
                setTitleDropdownPos(null);
            }
        }
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClick = (e: any) => {
            const isClickInsidePortal = (e.target as Element)?.closest('.portal-dropdown');

            const isClickOnTitleButton = titleButtonRefs.current.some(
                btn => btn && btn.contains(e.target)
            );
            const isClickOnDesignationButton = designationButtonRefs.current.some(
                btn => btn && btn.contains(e.target)
            );

            if (!isClickInsidePortal &&
                !isClickOnTitleButton &&
                !isClickOnDesignationButton) {
                setOpenTitle(null);
                setOpenDesignation(null);
                setTitleDropdownPos(null);
                setDesignationDropdownPos(null);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={wrapperRef} className="w-full">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
                Contact Persons
            </Label>

            <div className="border rounded-lg">
                <div
                    ref={tableContainerRef}
                    className="max-h-[380px] overflow-auto"
                >
                    <table className="w-full table-fixed text-sm">
                        {/* HEADER - Updated column widths */}
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr className="text-left">
                                <th className="px-3 py-3 w-[120px]">Title *</th> {/* Increased from 90px to 120px */}
                                <th className="px-3 py-3 w-[160px]">First Name *</th>
                                <th className="px-3 py-3 w-[160px]">Last Name *</th>
                                <th className="px-3 py-3 w-[220px]">Designation *</th>
                                <th className="px-3 py-3 w-[140px]">Contact No. *</th>
                                <th className="px-3 py-3 w-[180px]">Email *</th>
                                <th className="px-3 py-3 text-center w-[90px]">Admin</th>
                                <th className="px-3 py-3 w-[40px]"></th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {contactPersons.map((person, index) => {
                                return (
                                    <tr key={index} className="border-t hover:bg-slate-50">
                                        {/* TITLE - Increased width */}
                                        <td className="px-3 py-3 w-[120px]">
                                            <button
                                                ref={el => { titleButtonRefs.current[index] = el; }}
                                                type="button"
                                                onClick={() => handleTitleClick(index)}
                                                className="w-full h-9 border rounded px-2 flex items-center justify-between hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <span className="truncate">
                                                    {loadingSalutations
                                                        ? "Loading..."
                                                        : getTitle(person.title)}
                                                </span>
                                                <ChevronDown size={14} className={openTitle === index ? "rotate-180" : ""} />
                                            </button>
                                        </td>

                                        {/* FIRST NAME */}
                                        <td className="px-3 py-3">
                                            <input
                                                className="w-full h-9 border rounded px-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                                value={person.first_name || ""}
                                                placeholder="First name"
                                                onChange={(e) =>
                                                    onPersonChange(index, "first_name", e.target.value)
                                                }
                                            />
                                        </td>

                                        {/* LAST NAME */}
                                        <td className="px-3 py-3">
                                            <input
                                                className="w-full h-9 border rounded px-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                                value={person.last_name || ""}
                                                placeholder="Last name"
                                                onChange={(e) =>
                                                    onPersonChange(index, "last_name", e.target.value)
                                                }
                                            />
                                        </td>

                                        {/* DESIGNATION */}
                                        <td className="px-3 py-3">
                                            <button
                                                ref={el => { designationButtonRefs.current[index] = el; }}
                                                type="button"
                                                onClick={() => handleDesignationClick(index)}
                                                className="w-full h-9 border rounded px-2 flex justify-between items-center hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                                            >
                                                <span className="truncate">
                                                    {loadingDesignations
                                                        ? "Loading..."
                                                        : getSelectedDesignationLabel(person.designation)}
                                                </span>
                                                <ChevronDown size={14} className={openDesignation === index ? "rotate-180" : ""} />
                                            </button>
                                        </td>

                                        {/* CONTACT */}
                                        <td className="px-3 py-3">
                                            <input
                                                className="w-full h-9 border rounded px-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                                value={person.contact_no || ""}
                                                placeholder="Contact number"
                                                onChange={(e) =>
                                                    onPersonChange(index, "contact_no", e.target.value)
                                                }
                                            />
                                        </td>

                                        {/* EMAIL */}
                                        <td className="px-3 py-3">
                                            <input
                                                className="w-full h-9 border rounded px-2 focus:outline-none focus:ring-2 focus:ring-accent"
                                                value={person.email || ""}
                                                placeholder="Email"
                                                onChange={(e) =>
                                                    onPersonChange(index, "email", e.target.value)
                                                }
                                            />
                                        </td>

                                        {/* ADMIN */}
                                        <td className="px-3 py-3 text-center">
                                            <Checkbox
                                                checked={person.is_admin || false}
                                                onCheckedChange={(checked) =>
                                                    onPersonChange(index, "is_admin", checked as boolean)
                                                }
                                                className="focus:ring-2 focus:ring-accent"
                                            />
                                        </td>

                                        {/* REMOVE */}
                                        <td className="px-2">
                                            {contactPersons.length > 1 && (
                                                <button
                                                    onClick={() => onRemovePerson(index)}
                                                    className="p-1 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TITLE DROPDOWN PORTAL - Increased to 200px */}
            {titleDropdownPos && typeof window !== 'undefined' && createPortal(
                <div
                    className="portal-dropdown fixed z-[9999] bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-auto"
                    style={{
                        top: titleDropdownPos.top,
                        left: titleDropdownPos.left,
                        width: 100,
                        minWidth: 100,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        {titleOptions.map((opt: any) => {
                            const val = opt.value;
                            return (
                                <button
                                    key={val}
                                    type="button"
                                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onPersonChange(titleDropdownPos.index, "title", val);
                                        setOpenTitle(null);
                                        setTitleDropdownPos(null);
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${contactPersons[titleDropdownPos.index]?.title === val ? "border-accent" : "border-slate-300"
                                        }`}>
                                        {contactPersons[titleDropdownPos.index]?.title === val && (
                                            <div className="w-2 h-2 rounded-full bg-accent" />
                                        )}
                                    </div>
                                    <span className="truncate">{opt.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            )}

            {/* DESIGNATION DROPDOWN PORTAL */}
            {designationDropdownPos && typeof window !== 'undefined' && createPortal(
                <div
                    className="portal-dropdown fixed z-[9999] bg-white border border-slate-200 rounded-md shadow-xl max-h-60 overflow-auto"
                    style={{
                        top: designationDropdownPos.top,
                        left: designationDropdownPos.left,
                        width: 200,
                        minWidth: 200,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        {designationOptions.map((opt: any) => {
                            const val = opt.value || opt.name;
                            return (
                                <button
                                    key={val}
                                    type="button"
                                    className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onSelectDesignation(designationDropdownPos.index, val);
                                        setOpenDesignation(null);
                                        setDesignationDropdownPos(null);
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${contactPersons[designationDropdownPos.index]?.designation === val ? "border-accent" : "border-slate-300"
                                        }`}>
                                        {contactPersons[designationDropdownPos.index]?.designation === val && (
                                            <div className="w-2 h-2 rounded-full bg-accent" />
                                        )}
                                    </div>
                                    <span className="truncate">{opt.label || opt.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>,
                document.body
            )}

            <div className="flex justify-end mt-3">
                <Button
                    type="button"
                    onClick={onAddPerson}
                    variant="outline"
                    className="h-9 px-5 text-sm border-accent text-accent hover:bg-accent hover:text-white"
                >
                    + Add Contact Person
                </Button>
            </div>
        </div>
    );
};