"use client";

import React, { useState, useEffect } from "react";
import DynamicField from "./DynamicField";
import { FormField } from "@/types/doctypes.types";

interface Props {
  fields?: FormField[];
  onSubmit: (data: any) => void;
  buttonLabel?: string;
  loading?: boolean;
  onChange?: (data: any) => void; // Added onChange prop
}

export default function DynamicForm({
  fields,
  onSubmit,
  buttonLabel = "Submit",
  loading = false,
  onChange, // Added onChange parameter
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      };
      
      // Call onChange prop whenever form data changes
      if (onChange) {
        onChange(newData);
      }
      
      return newData;
    });
  };

  // Group fields into rows based on layout property
  const renderFields = () => {
    if (!fields) return null;

    const rows: React.ReactNode[] = [];
    let currentRow: FormField[] = [];
    let currentRowWidth = 0;

    fields.forEach((field) => {
      const fieldWidth = field.layout === 'half' ? 0.5 : 1;
      
      if (currentRowWidth + fieldWidth > 1) {
        // Render current row and start new one
        if (currentRow.length > 0) {
          rows.push(
            <div key={rows.length} className="grid grid-cols-2 gap-4">
              {currentRow.map((f) => (
                <div key={f.fieldname} className={f.layout === 'half' ? 'col-span-1' : 'col-span-2'}>
                  <DynamicField
                    field={f}
                    value={formData[f.fieldname]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          );
        }
        currentRow = [field];
        currentRowWidth = fieldWidth;
      } else {
        currentRow.push(field);
        currentRowWidth += fieldWidth;
      }
    });

    // Render last row
    if (currentRow.length > 0) {
      rows.push(
        <div key={rows.length} className="grid grid-cols-2 gap-4">
          {currentRow.map((f) => (
            <div key={f.fieldname} className={f.layout === 'half' ? 'col-span-1' : 'col-span-2'}>
              <DynamicField
                field={f}
                value={formData[f.fieldname]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      {renderFields()}
      
      {/* Only render button if buttonLabel is not empty */}
      {buttonLabel && buttonLabel !== "" && (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Loading..." : buttonLabel}
        </button>
      )}
    </form>
  );
}