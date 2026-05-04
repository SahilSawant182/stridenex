"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Clock } from "lucide-react";

export interface OperatingHour {
  day: string;
  is_closed: number; // 0 or 1
  opening_time?: string;
  closing_time?: string;
}

interface Props {
  value: OperatingHour[];
  onChange: (value: OperatingHour[]) => void;
}

export const OperatingHoursTable: React.FC<Props> = ({ value, onChange }) => {
  const handleRowChange = (index: number, field: keyof OperatingHour, val: any) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const addRow = () => {
    onChange([...value, { day: "", is_closed: 0, opening_time: "09:00:00", closing_time: "18:00:00" }]);
  };

  const removeRow = (index: number) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-full space-y-3">

      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-bold text-slate-600 w-1/3">Day(s)</th>
                <th className="px-4 py-3 font-bold text-slate-600 text-center">Closed</th>
                <th className="px-4 py-3 font-bold text-slate-600">Opening Time</th>
                <th className="px-4 py-3 font-bold text-slate-600">Closing Time</th>
                <th className="px-2 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {value.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="w-full h-9 px-4 bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-semibold text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                      placeholder="e.g. Mon-Fri"
                      value={row.day}
                      onChange={(e) => handleRowChange(index, "day", e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Checkbox
                      checked={row.is_closed === 1}
                      onCheckedChange={(checked) => {
                        const isClosed = checked ? 1 : 0;
                        const updated = [...value];
                        updated[index] = { 
                          ...updated[index], 
                          is_closed: isClosed,
                          opening_time: isClosed ? "" : (updated[index].opening_time || "09:00:00"),
                          closing_time: isClosed ? "" : (updated[index].closing_time || "18:00:00")
                        };
                        onChange(updated);
                      }}
                      className="rounded-md border-slate-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        disabled={row.is_closed === 1}
                        className="w-full h-9 pl-7 pr-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 disabled:opacity-50 disabled:bg-slate-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        value={row.opening_time || ""}
                        onChange={(e) => handleRowChange(index, "opening_time", e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <Clock className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="time"
                        disabled={row.is_closed === 1}
                        className="w-full h-9 pl-7 pr-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 disabled:opacity-50 disabled:bg-slate-100 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        value={row.closing_time || ""}
                        onChange={(e) => handleRowChange(index, "closing_time", e.target.value)}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    {value.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={addRow}
          variant="outline"
          className="h-9 px-4 rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-all text-xs font-bold"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          Add Working Days
        </Button>
      </div>
    </div>
  );
};
