"use client";

import { FormField } from "@/types/doctypes.types";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import axios from "axios";

interface Props {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
}

export default function DynamicField({ field, value, onChange, error }: Props) {
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetched, setFetched] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Combine base classes with custom input classes
  const baseInputClasses =
    "w-full px-3 py-2 bg-white border rounded-lg " +
    "focus:ring-2 focus:ring-accent focus:border-accent " +
    "transition-all text-sm text-slate-900 placeholder:text-slate-400 " +
    (error ? "border-red-500" : "border-slate-200") + " " +
    (field.inputClassName || ""); // Add custom classes here

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchOptions = async () => {
    if (!field.apiEndpoint) return;

    setLoading(true);
    setFetchError("");
    try {
      const response = await axios.get(field.apiEndpoint, { params: field.apiParams });

      // Handle the consistent response structure: { message: string, data: array }
      const responseData = response.data;

      // Check if we have data array in the response
      if (responseData.data && Array.isArray(responseData.data)) {
        const mappedOptions = field.mapOptions ? field.mapOptions(responseData) :
          responseData.data.map((item: any) => ({
            value: item.name || item.value || item.department,
            label: item.label || item.name || item.college_name || item.department
          }));
        setOptions(mappedOptions);
        setFetched(true);

        // If there's a message but empty data, show appropriate message
        if (responseData.data.length === 0) {
          setFetchError(responseData.message || "No options available");
        }
      } else {
        setOptions([]);
        setFetchError(responseData.message || "No data available");
      }
    } catch (err: any) {
      console.error(`Error fetching ${field.label}:`, err);
      setFetchError(err?.response?.data?.message || `Failed to load ${field.label}`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownClick = () => {
    if (field.read_only || field.disabled) return;

    // Always fetch when clicked, regardless of fetched state
    // This ensures we get fresh data every time
    if (!loading && !fetchError) {
      fetchOptions();
    }

    setIsOpen(!isOpen);
  };

  const handleRetry = () => {
    setFetchError("");
    fetchOptions();
  };

  const handleSingleSelect = (selectedValue: string) => {
    onChange(field.fieldname, selectedValue);
    setIsOpen(false);
  };

  const handleMultiSelect = (selectedValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentValues = Array.isArray(value) ? value : [];
    let newValues: string[];

    if (currentValues.includes(selectedValue)) {
      newValues = currentValues.filter(v => v !== selectedValue);
    } else {
      newValues = [...currentValues, selectedValue];
    }

    onChange(field.fieldname, newValues);
  };

  const removeSelectedItem = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Array.isArray(value)) {
      const newValues = value.filter(v => v !== itemToRemove);
      onChange(field.fieldname, newValues);
    }
  };

  const isSelected = (optionValue: string) => {
    if (field.multiSelect) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getSelectedLabels = () => {
    if (!Array.isArray(value) || value.length === 0) return null;
    return options.filter(opt => value.includes(opt.value));
  };

  const getSelectedLabel = () => {
    if (!value) return field.placeholder || `Select ${field.label}`;
    const selected = options.find(opt => opt.value === value);
    return selected ? selected.label : field.placeholder || `Select ${field.label}`;
  };

  if (field.hidden) return null;

  const renderField = () => {
    // API Dropdown (Single or Multi select)
    if (field.apiEndpoint) {
      return (
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={!field.disabled ? handleDropdownClick : undefined}
            className={`w-full min-h-10 px-3 py-2 rounded-md border ${error ? "border-red-500" : fetchError ? "border-red-500" : "border-slate-200"
              } bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent cursor-pointer flex flex-wrap items-center gap-1 relative hover:border-slate-300 transition-colors ${field.read_only || field.disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : ""
              } ${field.inputClassName || ""}`}
          >
            {field.multiSelect && Array.isArray(value) && value.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1 flex-1">
                {getSelectedLabels()?.map((selected) => (
                  <span
                    key={selected.value}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-md text-xs font-medium"
                  >
                    {selected.label}
                    <button
                      onClick={(e) => removeSelectedItem(selected.value, e)}
                      className="hover:text-accent-foreground focus:outline-none"
                      disabled={field.read_only}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className={`flex-1 truncate ${!value && !field.multiSelect ? "text-slate-400" : ""}`}>
                {loading ? "Loading..." : fetchError ? "Failed to load" : field.multiSelect ? field.placeholder || "Select options" : getSelectedLabel()}
              </span>
            )}
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          </div>

          {/* Dropdown menu */}
          {isOpen && !loading && !fetchError && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg">
              {options.length === 0 ? (
                <div className="p-3 text-sm text-slate-400 text-center">No options available</div>
              ) : (
                <div className="py-1">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      onClick={(e) => field.multiSelect ? handleMultiSelect(option.value, e) : handleSingleSelect(option.value)}
                      className={`px-3 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-slate-50 transition-colors ${isSelected(option.value)
                        ? "bg-accent/5 text-accent font-medium"
                        : "text-slate-700"
                        }`}
                    >
                      {field.multiSelect ? (
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected(option.value)
                          ? "bg-accent border-accent"
                          : "border-slate-300"
                          }`}>
                          {isSelected(option.value) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected(option.value)
                          ? "border-accent"
                          : "border-slate-300"
                          }`}>
                          {isSelected(option.value) && (
                            <div className="w-2 h-2 rounded-full bg-accent" />
                          )}
                        </div>
                      )}
                      <span className="flex-1">{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading and error states */}
          {loading && (
            <p className="text-xs text-slate-400 mt-1">Fetching {field.label.toLowerCase()}...</p>
          )}

          {fetchError && !loading && (
            <div className="mt-1">
              <p className="text-xs text-red-500 inline">{fetchError}. </p>
              <button
                type="button"
                onClick={handleRetry}
                className="text-xs text-accent underline font-medium hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      );
    }

    // Regular field types
    switch (field.fieldtype) {
      case "Password":
        return (
          <input
            type="password"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
          />
        );

      case "Select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "Check":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(field.fieldname, e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-accent focus:ring-accent"
              disabled={field.read_only}
            />
            <span className="text-sm text-slate-600">{field.label}</span>
          </div>
        );

      case "Text":
      case "Long Text":
        return (
          <textarea
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses + " min-h-[80px]"}
            disabled={field.read_only}
            required={field.required}
          />
        );

      case "Int":
      case "Float":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
            step={field.fieldtype === "Float" ? "0.01" : "1"}
          />
        );

      case "Date":
        return (
          <input
            type="date"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
          />
        );

      case "Time":
        return (
          <input
            type="time"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
          />
        );

      case "Datetime":
        return (
          <input
            type="datetime-local"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
          />
        );

      case "Data":
      default:
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
            className={baseInputClasses}
            disabled={field.read_only}
            required={field.required}
            maxLength={field.maxLength}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.description && (
          <span className="text-xs font-normal text-slate-500 ml-2">
            {field.description}
          </span>
        )}
      </label>

      {renderField()}

      {error && !fetchError && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}