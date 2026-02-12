"use client";

import { DocField } from "@/types/doctypes.types";

interface Props {
  field: DocField;
  onChange: (name: string, value: any) => void;
}

export default function DynamicField({ field, onChange }: Props) {
  const commonClasses =
    "w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300";

  switch (field.fieldtype) {
    case "Data":
      return (
        <div>
          <label className="block mb-2 text-sm text-white/80 font-medium">
            {field.label}
          </label>
          <input
            type="text"
            placeholder={`Enter ${field.label}`}
            className={commonClasses}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
          />
        </div>
      );

    case "Password":
      return (
        <div>
          <label className="block mb-2 text-sm text-white/80 font-medium">
            {field.label}
          </label>
          <input
            type="password"
            placeholder={`Enter ${field.label}`}
            className={commonClasses}
            onChange={(e) => onChange(field.fieldname, e.target.value)}
          />
        </div>
      );

    default:
      return null;
  }
}