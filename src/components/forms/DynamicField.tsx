"use client";

import { FormField } from "@/types/doctypes.types";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Check, Eye, EyeOff } from "lucide-react";
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

  // useEffect(() => {
  //   // Pre-fetch data for all dropdowns when component mounts
  //   if (field.apiEndpoint && !fetched && !loading && !fetchError) {
  //     fetchOptions();
  //   }
  // }, []);

  const fetchOptions = async () => {
    if (!field.apiEndpoint) return;

    setLoading(true);
    setFetchError("");
    try {
      let response;
      let responseData;

      // Check if this is frappe.client.get_list (GET request with params)
      if (field.apiEndpoint.includes('frappe.client.get_list')) {
        response = await axios.get(field.apiEndpoint, {
          params: field.apiParams || {},
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        responseData = response.data;
      }
      // Check if this is the master_data API (needs POST)
      else if (field.apiEndpoint.includes('master.get_master_data')) {
        response = await axios.post(field.apiEndpoint, field.apiParams || {}, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        responseData = response.data;
      }
      else {
        // Regular GET request for other APIs
        response = await axios.get(field.apiEndpoint, { params: field.apiParams });
        responseData = response.data;
      }

      console.log(`API Response for ${field.fieldname}:`, responseData);

      // Handle different response structures
      let data = [];

      if (Array.isArray(responseData)) {
        data = responseData;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        data = responseData.data;
      } else if (responseData.message && Array.isArray(responseData.message)) {
        data = responseData.message;
      } else {
        console.warn("Unexpected API response structure:", responseData);
        setOptions([]);
        setFetchError("No data available");
        setLoading(false);
        return;
      }

      if (data.length > 0) {
        let mappedOptions;

        if (field.mapOptions) {
          mappedOptions = field.mapOptions(data);
        } else {
          mappedOptions = data.map((item: any) => ({
            value: item.name || item.value,
            label: item.label || item.name || item.district_name
          }));
        }

        console.log(`Mapped options for ${field.fieldname}:`, mappedOptions);
        setOptions(mappedOptions);
        setFetched(true); // Still set fetched to true, but we'll ignore it in handleDropdownClick
      } else {
        console.log(`No data found for ${field.fieldname}`);
        setOptions([]);
        setFetchError("No options available");
      }
    } catch (err: any) {
      console.error(`Error fetching ${field.label}:`, err);
      setFetchError(err?.response?.data?.message || `Failed to load ${field.fieldname}`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDropdownClick = () => {
    if (field.read_only || field.disabled) return;

    // Always fetch when clicked to get fresh data
    // This is especially important for dependent dropdowns
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
                {fetchError ? "Failed to load" : field.multiSelect ? field.placeholder || "Select options" : getSelectedLabel()}
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
          {/* {loading && (
            <p className="text-xs text-slate-400 mt-1">Fetching {field.label.toLowerCase()}...</p>
          )} */}

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
        const [showPassword, setShowPassword] = useState(false);

        return (
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.fieldname, e.target.value)}
              className={baseInputClasses + " pr-10"}
              disabled={field.read_only}
              required={field.required}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
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

      case "File":
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [fileName, setFileName] = useState<string>("");

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            // Check if file is PDF
            if (file.type !== 'application/pdf') {
              alert('Please upload only PDF files');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              return;
            }

            // Check file size (optional - limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
              alert('File size should be less than 5MB');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              return;
            }

            setFileName(file.name);
            onChange(field.fieldname, file); // Store the File object
          } else {
            setFileName("");
            onChange(field.fieldname, null);
          }
        };

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={field.read_only}
                />
                <div className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 flex items-center justify-between ${error ? "border-red-500" : "border-slate-200"} ${field.read_only ? "bg-slate-50 cursor-not-allowed" : "cursor-pointer hover:border-accent transition-colors"}`}>
                  <span className={`truncate ${fileName ? "text-slate-900" : "text-slate-400"}`}>
                    {fileName || field.placeholder || "Choose file..."}
                  </span>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                    Browse
                  </span>
                </div>
              </div>
            </div>
            {fileName && (
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <span>✓</span>
                <span className="truncate">{fileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFileName("");
                    onChange(field.fieldname, null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className="text-red-500 hover:text-red-700 ml-auto"
                >
                  Remove
                </button>
              </div>
            )}
            {field.description && (
              <p className="text-xs text-slate-500 mt-1">{field.description}</p>
            )}
          </div>
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