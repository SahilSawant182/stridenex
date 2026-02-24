"use client";

import { FormField } from "@/types/doctypes.types";

interface Props {
  field: FormField;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
}

export default function DynamicField({ field, value, onChange, error }: Props) {
  // Reduced padding from px-4 py-3 to px-3 py-2
  const baseInputClasses = 
    "w-full px-3 py-2 bg-white border rounded-lg " + // Changed py-3 to py-2
    "focus:ring-2 focus:ring-accent focus:border-accent " +
    "transition-all text-sm text-slate-900 placeholder:text-slate-400 " + // Added text-sm
    (error ? "border-red-500" : "border-slate-200");

  if (field.hidden) return null;

  const renderField = () => {
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
            className={baseInputClasses + " min-h-[80px]"} // Reduced from min-h-[100px]
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

      case "Link":
        return (
          <div className="relative">
            <input
              type="text"
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.fieldname, e.target.value)}
              className={baseInputClasses}
              disabled={field.read_only}
              required={field.required}
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-accent hover:text-orange-600" // Adjusted top from top-3 to top-2
              onClick={() => {/* Handle link selection */}}
            >
              🔍
            </button>
          </div>
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
          />
        );
    }
  };

  return (
    <div className="space-y-1"> {/* Reduced from space-y-2 to space-y-1 */}
      <label className="text-sm font-medium text-slate-700"> {/* Changed from font-semibold to font-medium */}
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
        {field.description && (
          <span className="text-xs font-normal text-slate-500 ml-2">
            {field.description}
          </span>
        )}
      </label>

      {renderField()}
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p> // Changed from text-sm to text-xs
      )}
    </div>
  );
}