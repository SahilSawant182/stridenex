"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, LucideIcon, ChevronDown, Check, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/api.services";
import { parseBackendError } from "@/utils/error.utils";
import { disableToDateBeforeFromDate } from "@/utils/date.utils";

export interface DynamicField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "email" | "url" | "date" | "time" | "custom";
  placeholder?: string;
  icon?: LucideIcon;
  colSpan?: 1 | 2;
  options?: { value: string; label: string }[] | string[];
  required?: boolean;
  onFocus?: (fieldName: string) => void;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  disabled?: boolean;
  multiple?: boolean;
  apiEndpoint?: string;
  apiParams?: Record<string, any>;
  mapOptions?: (data: any) => Array<{ value: string; label: string }>;
  allowCustom?: boolean;
  customPlaceholder?: string;
  onCreateCustomValue?: (value: string) => Promise<any>;
  min?: string | number;
  max?: string | number;
  customRender?: (formData: any, handleChange: (value: any) => void) => React.ReactNode;
}

interface DashboardDynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerIcon: LucideIcon;
  iconBgColor?: string;
  fields: DynamicField[];
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onFieldFocus?: (fieldName: string) => void;
  onValuesChange?: (values: Record<string, any>, changedFieldName: string) => Record<string, any> | void;
  children?: React.ReactNode;
  maxWidth?: string;
  hideFooter?: boolean;
  submitText?: string;
}

export default function DashboardDynamicModal({
  isOpen,
  onClose,
  title,
  subtitle,
  headerIcon: HeaderIcon,
  iconBgColor = "bg-blue-600",
  fields,
  initialValues = {},
  onSubmit,
  loading = false,
  error = null,
  onFieldFocus,
  onValuesChange,
  children,
  maxWidth = "max-w-2xl",
  hideFooter = false,
  submitText
}: DashboardDynamicModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSelect, setActiveSelect] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Track which initial values we've already loaded to avoid infinite loops
  const lastInitialValuesRef = useRef<string>("");

  useEffect(() => {
    if (isOpen && initialValues) {
      const currentInitialStr = JSON.stringify(initialValues);
      console.log("DashboardDynamicModal: initialValues changed:", initialValues);

      // Only update if the stringified values have actually changed or it's the first load
      if (lastInitialValuesRef.current !== currentInitialStr) {
        const initial: Record<string, any> = {};
        fields.forEach(field => {
          let val = initialValues?.[field.name];
          if (field.multiple && val !== undefined && val !== null && !Array.isArray(val)) {
            val = typeof val === 'string' && val.includes(',') ? val.split(',').map(s => s.trim()) : [val];
          }
          initial[field.name] = val ?? (field.multiple ? [] : (field.type === "number" ? "" : ""));
        });
        console.log("DashboardDynamicModal: setting formData from initialValues:", initial);
        setFormData(initial);
        lastInitialValuesRef.current = currentInitialStr;
      }
    } else if (!isOpen) {
      if (lastInitialValuesRef.current !== "") {
        lastInitialValuesRef.current = "";
        setActiveSelect(null);
        setSearchTerm("");
        setErrors({});
      }
    }
  }, [isOpen, fields, initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? (value === "" ? "" : Number(value)) : value;

    // Calculate new state first to handle side effects cleanly
    const updated = { ...formData, [name]: newValue };

    // Automatically adjust end_date if start_date becomes later
    if (name === "start_date" && updated.end_date) {
      if (new Date(updated.end_date) < new Date(String(newValue))) {
        updated.end_date = newValue;
      }
    }
    if (name === "from_date" && updated.to_date) {
      if (new Date(updated.to_date) < new Date(String(newValue))) {
        updated.to_date = newValue;
      }
    }

    let finalData = updated;

    if (onValuesChange) {
      const sideEffects = onValuesChange(updated, name);
      if (sideEffects) {
        finalData = { ...updated, ...sideEffects };
      }
    }

    setFormData(finalData);

    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleSelectValue = (fieldName: string, value: string, multiple: boolean) => {
    let updated;
    if (multiple) {
      const currentValues = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      updated = { ...formData, [fieldName]: newValues };
    } else {
      setActiveSelect(null);
      setSearchTerm("");
      updated = { ...formData, [fieldName]: value };
    }

    let finalData = updated;
    if (onValuesChange) {
      const sideEffects = onValuesChange(updated, fieldName);
      if (sideEffects) {
        finalData = { ...updated, ...sideEffects };
      }
    }

    setFormData(finalData);

    // Clear error when value is toggled
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const removeMultiSelectValue = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((v: string) => v !== value)
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform validation
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          newErrors[field.name] = "required";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      // Toast is handled by the parent components which call onSubmit
      console.error("Form submission error:", err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-white rounded-[2rem] shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col border border-slate-100`}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${iconBgColor} rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/50`}>
                    <HeaderIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-sm text-slate-500 font-semibold">{subtitle}</p>}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {fields.length > 0 && (
                  <form id="dynamic-industry-form" onSubmit={handleFormSubmit} className={`grid grid-cols-2 gap-6 ${activeSelect ? 'pb-[240px]' : 'pb-6'}`}>
                    {fields.map((field) => (
                      <DynamicFieldItem
                        key={field.name}
                        field={field}
                        formData={formData}
                        handleChange={handleChange}
                        onFieldFocus={onFieldFocus}
                        activeSelect={activeSelect}
                        setActiveSelect={setActiveSelect}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        toggleSelectValue={toggleSelectValue}
                        removeMultiSelectValue={removeMultiSelectValue}
                        errors={errors}
                        setFormData={setFormData}
                        onValuesChange={onValuesChange}
                      />
                    ))}
                  </form>
                )}
                
                {children && (
                  <div className={fields.length > 0 ? "pt-4 pb-10" : "pb-4"}>
                    {children}
                  </div>
                )}

                {error && <p className="mt-4 text-sm font-semibold text-red-500 text-center">{error}</p>}
              </div>

              {/* Footer */}
              {!hideFooter && (
                <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="px-6 h-12 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleFormSubmit}
                    disabled={loading}
                    className="px-8 h-12 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {submitText || "Save Changes"}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DynamicFieldItem({
  field,
  formData,
  handleChange,
  onFieldFocus,
  activeSelect,
  setActiveSelect,
  searchTerm,
  setSearchTerm,
  toggleSelectValue,
  removeMultiSelectValue,
  errors,
  setFormData,
  onValuesChange
}: {
  field: DynamicField;
  formData: any;
  handleChange: any;
  onFieldFocus: any;
  activeSelect: string | null;
  setActiveSelect: any;
  searchTerm: string;
  setSearchTerm: any;
  toggleSelectValue: any;
  removeMultiSelectValue: any;
  errors: any;
  setFormData: any;
  onValuesChange?: (data: any, fieldName: string) => any;
}) {
  const [apiOptions, setApiOptions] = useState<{ value: string; label: string }[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeSelect === field.name && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveSelect(null);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeSelect, field.name, setActiveSelect, setSearchTerm]);

  useEffect(() => {
    if (field.apiEndpoint && !field.disabled) {
      fetchApiOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.apiEndpoint, field.disabled, JSON.stringify(field.apiParams)]);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 100);
    }
  }, [showCustomInput]);

  const fetchApiOptions = async () => {
    if (!field.apiEndpoint || apiLoading) return;
    setApiLoading(true);
    setApiError(null);
    try {
      const response = await apiService.post(field.apiEndpoint, field.apiParams || {});
      const data = response?.data || response?.message?.data || response?.message || [];
      let mapped;
      if (field.mapOptions) {
        mapped = field.mapOptions(data);
      } else {
        mapped = Array.isArray(data) ? data.map((item: any) => ({
          value: item.name || item.value || item,
          label: item.label || item.name || item.value || item
        })) : [];
      }
      setApiOptions(mapped);
    } catch (err: any) {
      console.error(`Error fetching options for ${field.name}:`, err);
      setApiError(err?.message || "Failed to load options");
    } finally {
      setApiLoading(false);
    }
  };

  const currentOptions = field.apiEndpoint ? apiOptions : (field.options || []);

  const currentValueArray = Array.isArray(formData[field.name]) 
    ? formData[field.name] 
    : (formData[field.name] 
        ? (typeof formData[field.name] === 'string' && formData[field.name].includes(',') 
            ? formData[field.name].split(',').map((s: string) => s.trim()) 
            : [formData[field.name]]) 
        : []);

  return (
    <div className={`space-y-2 ${field.colSpan === 2 ? 'col-span-2' : 'col-span-2 md:col-span-1'}`}>
      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {field.icon && (
          <field.icon className={`absolute left-4 ${field.type === 'textarea' ? 'top-4' : 'top-1/2 -translate-y-1/2'} w-4 h-4 text-slate-400 z-10`} />
        )}

        {field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onFocus={() => {
              if (field.onFocus) field.onFocus(field.name);
              if (onFieldFocus) onFieldFocus(field.name);
            }}
            placeholder={field.placeholder}
            rows={3}
            className={`w-full ${field.icon ? 'pl-12' : 'px-4'} pr-4 pt-3.5 rounded-[1.5rem] border ${errors[field.name] ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm text-slate-900 resize-none outline-none min-h-[100px] disabled:bg-slate-50 disabled:text-slate-500`}
            required={field.required}
            disabled={field.disabled}
          />
        ) : field.type === "select" ? (
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={() => {
                if (!field.disabled) {
                  setActiveSelect(activeSelect === field.name ? null : field.name);
                  setSearchTerm("");
                  if (field.apiEndpoint && apiOptions.length === 0) fetchApiOptions();
                  if (field.onFocus) field.onFocus(field.name);
                  if (onFieldFocus) onFieldFocus(field.name);
                }
              }}
              className={`w-full min-h-[3rem] ${field.icon ? 'pl-12' : 'px-4'} pr-10 py-2.5 rounded-2xl border ${errors[field.name] ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm text-slate-900 bg-white cursor-pointer flex flex-wrap gap-2 ${field.disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed grayscale' : ''}`}
            >
              {field.multiple ? (
                <>
                  {currentValueArray.length === 0 && (
                    <span className="text-slate-400">{
                      apiLoading ? "Loading..." : (field.placeholder || `Select ${field.label}`)
                    }</span>
                  )}
                  {currentValueArray.map((val: string) => (
                    <span
                      key={val}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMultiSelectValue(field.name, val);
                      }}
                    >
                      {val}
                      {!field.disabled && <X className="w-3 h-3 hover:text-red-400 transition-colors" />}
                    </span>
                  ))}
                </>
              ) : (
                <span className={!formData[field.name] ? "text-slate-400" : "text-slate-900"}>
                  {apiLoading ? "Loading..." : (formData[field.name] || (field.placeholder || `Select ${field.label}`))}
                </span>
              )}
              {!field.disabled && (
                <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${activeSelect === field.name ? 'rotate-180' : ''}`} />
              )}
            </div>

            <AnimatePresence>
              {activeSelect === field.name && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-100 shadow-2xl z-[120] max-h-[320px] overflow-hidden flex flex-col p-2"
                  >
                    {/* Search Input */}
                    <div className="px-2 pt-1 pb-2 border-b border-slate-50 mb-1">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full h-10 pl-9 pr-4 bg-slate-50 rounded-xl text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar flex-1">
                      {showCustomInput ? (
                        <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Add Custom Value</span>
                            <button
                              onClick={() => setShowCustomInput(false)}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              ref={customInputRef}
                              type="text"
                              value={customValue}
                              onChange={(e) => {
                                setCustomValue(e.target.value);
                                if (customError) setCustomError(null);
                              }}
                              placeholder={field.customPlaceholder || "Enter custom value..."}
                              className={`w-full h-11 px-4 bg-slate-50 border ${customError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-200'} rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all`}
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (customValue.trim() && !customLoading) {
                                    setCustomError(null);
                                    if (field.onCreateCustomValue) {
                                      try {
                                        setCustomLoading(true);
                                        await field.onCreateCustomValue(customValue.trim());
                                      } catch (err: any) {
                                        console.error("Error creating custom value:", err);
                                        setCustomError(parseBackendError(err));
                                        return; // Don't add to list if creation failed
                                      } finally {
                                        setCustomLoading(false);
                                      }
                                    }
                                    toggleSelectValue(field.name, customValue.trim(), !!field.multiple);
                                    setShowCustomInput(false);
                                    setCustomValue("");
                                    if (field.apiEndpoint) fetchApiOptions();
                                  }
                                }
                              }}
                            />
                          </div>
                          {customError && (
                            <p className="text-[10px] font-bold text-red-500 ml-1 px-1 py-1 rounded-lg bg-red-50 inline-block">
                              {customError}
                            </p>
                          )}
                          <Button
                            onClick={async () => {
                              if (customValue.trim() && !customLoading) {
                                setCustomError(null);
                                if (field.onCreateCustomValue) {
                                  try {
                                    setCustomLoading(true);
                                    await field.onCreateCustomValue(customValue.trim());
                                  } catch (err: any) {
                                    console.error("Error creating custom value:", err);
                                    setCustomError(parseBackendError(err));
                                    return;
                                  } finally {
                                    setCustomLoading(false);
                                  }
                                }
                                toggleSelectValue(field.name, customValue.trim(), !!field.multiple);
                                setShowCustomInput(false);
                                setCustomValue("");
                                if (field.apiEndpoint) fetchApiOptions();
                              }
                            }}
                            disabled={!customValue.trim() || customLoading}
                            className="w-full h-11 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                          >
                            {customLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Value"}
                          </Button>
                        </div>
                      ) : apiError ? (
                        <div className="py-8 text-center px-4">
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{apiError}</p>
                          <div className="flex flex-col gap-2 mt-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); fetchApiOptions(); }}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                            >
                              Retry Loading Options
                            </button>
                            
                            {field.allowCustom && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowCustomInput(true);
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all"
                              >
                                <Plus className="w-3 h-3" />
                                Add Custom Value Instead
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          {currentOptions?.filter((opt: any) => {
                            if (!opt) return false;
                            const label = typeof opt === 'string' ? opt : opt?.label;
                            if (!label) return false;
                            return label.toLowerCase().includes(searchTerm.toLowerCase());
                          }).map((opt: any) => {
                            const value = typeof opt === 'string' ? opt : opt?.value;
                            const label = typeof opt === 'string' ? opt : opt?.label;
                            const isSelected = field.multiple
                              ? currentValueArray.includes(value)
                              : formData[field.name] === value;

                            return (
                              <div
                                key={value}
                                onClick={() => toggleSelectValue(field.name, value, !!field.multiple)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all mb-0.5 ${isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'}`}
                              >
                                <span className="text-sm font-bold leading-tight">{label}</span>
                                {isSelected && <Check className="w-4 h-4 shrink-0 shadow-sm" />}
                              </div>
                            );
                          })}

                          {field.allowCustom && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowCustomInput(true);
                              }}
                              className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-all mb-0.5 text-blue-600 hover:bg-blue-50"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="text-sm font-bold leading-tight">Others (Add Custom)</span>
                            </div>
                          )}

                          {currentOptions?.filter((opt: any) => {
                            if (!opt) return false;
                            const label = typeof opt === 'string' ? opt : opt?.label;
                            if (!label) return false;
                            return label.toLowerCase().includes(searchTerm.toLowerCase());
                          }).length === 0 && !field.allowCustom && (
                              <div className="py-8 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No results found</p>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : field.type === "custom" && field.customRender ? (
          field.customRender(formData, (value) => {
            const updated = { ...formData, [field.name]: value };
            let finalData = updated;
            if (onValuesChange) {
              const sideEffects = onValuesChange(updated, field.name);
              if (sideEffects) {
                finalData = { ...updated, ...sideEffects };
              }
            }
            setFormData(finalData);
          })
        ) : (
          <Input
            name={field.name}
            type={field.type}
            value={formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : ""}
            onChange={handleChange}
            onFocus={() => {
              if (field.onFocus) field.onFocus(field.name);
              if (onFieldFocus) onFieldFocus(field.name);
            }}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
            min={
              field.type === "date" && (field.name === "end_date" || field.name === "to_date")
                ? disableToDateBeforeFromDate(formData.start_date || formData.from_date)
                : field.min
            }
            max={field.max}
            style={field.textTransform ? { textTransform: field.textTransform } : {}}
            className={`${field.icon ? 'pl-12' : 'px-4'} h-12 rounded-2xl border ${errors[field.name] ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-slate-900 ${field.textTransform === 'uppercase' ? 'placeholder:uppercase' : ''} disabled:bg-slate-50 disabled:text-slate-500`}
          />
        )}
      </div>
      {errors[field.name] && (
        <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-pulse">
          * This field is mandatory
        </p>
      )}
    </div>
  );
}
