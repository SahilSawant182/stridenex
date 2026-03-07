"use client";

import React, { useEffect, useMemo, useState } from "react";
import DynamicField from "./DynamicField";
import { FormField } from "@/types/doctypes.types";

interface Props {
  fields?: FormField[];
  onSubmit: (data: any) => void;
  buttonLabel?: string;
  loading?: boolean;
  onChange?: (data: any) => void;
  onFieldData?: (fieldname: string, options: any[]) => void;
  initialValues?: Record<string, any>;
  errors?: Record<string, string>; 
}

export default function DynamicForm({
  fields,
  onSubmit,
  buttonLabel = "Submit",
  loading = false,
  onChange,
  initialValues = {},
  errors
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  useEffect(() => {
    setFormData(prev => {
      const hasChanges = Object.keys(initialValues).some(
        key => initialValues[key] !== prev[key]
      );
      if (hasChanges) {
        return { ...prev, ...initialValues };
      }
      return prev;
    });
  }, [initialValues]);


 const handleChange = (name: string, value: any) => {
  setFormData((prev) => {
    const newData = {
      ...prev,
      [name]: value,
    };

    // Call onChange asynchronously to avoid render-time updates
    if (onChange) {
      // Use queueMicrotask or Promise.resolve().then instead of setTimeout
      queueMicrotask(() => {
        onChange(newData);
      });
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
            <div key={rows.length} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentRow.map((f) => (
                <div key={f.fieldname} className={f.layout === 'half' ? 'md:col-span-1 col-span-1' : 'md:col-span-2 col-span-1'}>
                  <DynamicField
                    field={f}
                    value={formData[f.fieldname]}
                    onChange={handleChange}
                    error={errors?.[f.fieldname]} // ✅ Fixed: Added error prop
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
        <div key={rows.length} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentRow.map((f) => (
            <div key={f.fieldname} className={f.layout === 'half' ? 'md:col-span-1 col-span-1' : 'md:col-span-2 col-span-1'}>
              <DynamicField
                field={f}
                value={formData[f.fieldname]}
                onChange={handleChange}
                error={errors?.[f.fieldname]} // ✅ Fixed: Added error prop
              />
            </div>
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <div
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
    </div>
  );
}