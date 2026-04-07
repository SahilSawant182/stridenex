"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface IndustryField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "email" | "url";
  placeholder?: string;
  icon?: LucideIcon;
  colSpan?: 1 | 2;
  options?: { value: string; label: string }[] | string[];
  required?: boolean;
  onFocus?: (fieldName: string) => void;
}

interface IndustryDynamicModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerIcon: LucideIcon;
  iconBgColor?: string;
  fields: IndustryField[];
  initialValues?: Record<string, any>;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onFieldFocus?: (fieldName: string) => void;
}

export default function IndustryDynamicModal({
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
  onFieldFocus
}: IndustryDynamicModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Track which initial values we've already loaded to avoid infinite loops
  const [lastInitialValues, setLastInitialValues] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const currentInitialStr = JSON.stringify(initialValues);
      
      // Only initialize if we just opened the modal OR if the initialValues have changed
      // (e.g. switching between different items to edit while the modal is somehow open)
      if (lastInitialValues !== currentInitialStr) {
        const initial: Record<string, any> = {};
        fields.forEach(field => {
          initial[field.name] = initialValues?.[field.name] ?? (field.type === "number" ? "" : "");
        });
        setFormData(initial);
        setLastInitialValues(currentInitialStr);
      }
    } else {
      // Reset tracking when modal closes
      setLastInitialValues("");
    }
  }, [isOpen, fields, initialValues, lastInitialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value 
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
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
                <form id="dynamic-industry-form" onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6">
                  {fields.map((field) => (
                    <div 
                      key={field.name} 
                      className={`space-y-2 ${field.colSpan === 2 ? 'col-span-2' : 'col-span-2 md:col-span-1'}`}
                    >
                      <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <div className="relative">
                        {field.icon && (
                          <field.icon className={`absolute left-4 ${field.type === 'textarea' ? 'top-4' : 'top-1/2 -translate-y-1/2'} w-4 h-4 text-slate-400`} />
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
                            className={`w-full ${field.icon ? 'pl-12' : 'px-4'} pr-4 pt-3.5 rounded-[1.5rem] border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm resize-none outline-none min-h-[100px]`}
                            required={field.required}
                          />
                        ) : field.type === "select" ? (
                          <select
                            name={field.name}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            onFocus={() => {
                              if (field.onFocus) field.onFocus(field.name);
                              if (onFieldFocus) onFieldFocus(field.name);
                            }}
                            className={`w-full h-12 ${field.icon ? 'pl-12' : 'px-4'} pr-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold text-sm appearance-none outline-none bg-white`}
                            required={field.required}
                          >
                            <option value="" disabled>{field.placeholder || `Select ${field.label}`}</option>
                            {field.options?.map((opt: any) => {
                              const value = typeof opt === 'string' ? opt : opt.value;
                              const label = typeof opt === 'string' ? opt : opt.label;
                              return <option key={value} value={value}>{label}</option>;
                            })}
                          </select>
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
                            className={`${field.icon ? 'pl-12' : 'px-4'} h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold`}
                            required={field.required}
                          />
                        )}
                      </div>
                    </div>
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
