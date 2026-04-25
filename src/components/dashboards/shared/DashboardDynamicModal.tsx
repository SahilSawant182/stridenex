"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, LucideIcon, ChevronDown, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/api.services";

export interface DynamicField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "email" | "url" | "date";
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
  onValuesChange
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
      
      // Only update if the stringified values have actually changed or it's the first load
      if (lastInitialValuesRef.current !== currentInitialStr) {
        const initial: Record<string, any> = {};
        fields.forEach(field => {
          initial[field.name] = initialValues?.[field.name] ?? (field.multiple ? [] : (field.type === "number" ? "" : ""));
        });
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
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100"
            >
              {/* Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
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
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <form id="dynamic-industry-form" onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6 pb-40">
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
                    />
                  ))}
                </form>
                {error && <p className="mt-4 text-sm font-semibold text-red-500 text-center">{error}</p>}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-8 h-14 rounded-2xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFormSubmit}
                  disabled={loading}
                  className="px-10 h-14 rounded-2xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Changes
                </Button>
              </div>
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
  errors 
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
}) {
  const [apiOptions, setApiOptions] = useState<{ value: string; label: string }[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

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
          <div className="relative">
            <div 
              onClick={() => {
                if (!field.disabled) {
                  setActiveSelect(activeSelect === field.name ? null : field.name);
                  setSearchTerm("");
                  if (field.apiEndpoint) fetchApiOptions();
                  if (field.onFocus) field.onFocus(field.name);
                  if (onFieldFocus) onFieldFocus(field.name);
                }
              }}
              className={`w-full min-h-[3rem] ${field.icon ? 'pl-12' : 'px-4'} pr-10 py-2.5 rounded-2xl border ${errors[field.name] ? 'border-red-500 bg-red-50/10' : 'border-slate-200'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm bg-white cursor-pointer flex flex-wrap gap-2 ${field.disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed grayscale' : ''}`}
            >
              {field.multiple ? (
                <>
                  {(formData[field.name] || []).length === 0 && (
                    <span className="text-slate-400">{
                      apiLoading ? "Loading..." : (field.placeholder || `Select ${field.label}`)
                    }</span>
                  )}
                  {(formData[field.name] || []).map((val: string) => (
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
                  <div 
                    className="fixed inset-0 z-[110]" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setActiveSelect(null); 
                      setSearchTerm(""); 
                    }} 
                  />
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
                          className="w-full h-10 pl-9 pr-4 bg-slate-50 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar flex-1">
                      {apiError ? (
                        <div className="py-8 text-center px-4">
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{apiError}</p>
                          <button 
                            onClick={(e) => { e.stopPropagation(); fetchApiOptions(); }}
                            className="mt-2 text-[10px] font-bold text-blue-600 hover:underline"
                          >
                            Retry
                          </button>
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
                              ? (formData[field.name] || []).includes(value)
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
                          {currentOptions?.filter((opt: any) => {
                            if (!opt) return false;
                            const label = typeof opt === 'string' ? opt : opt?.label;
                            if (!label) return false;
                            return label.toLowerCase().includes(searchTerm.toLowerCase());
                          }).length === 0 && (
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
        ) : (
          <Input
            name={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={handleChange}
            onFocus={() => {
              if (field.onFocus) field.onFocus(field.name);
              if (onFieldFocus) onFieldFocus(field.name);
            }}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled}
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
