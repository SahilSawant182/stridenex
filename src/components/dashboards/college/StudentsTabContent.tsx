"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Download, Search, Settings2, MoreHorizontal } from "lucide-react";

// Mock student data from screenshot
const students = [
  { id: "PS", name: "Priya Sharma", branch: "CSE", year: "3rd", employability: 87, internship: "—", status: "Interning", risk: "low", riskColor: "bg-green-500" },
  { id: "RM", name: "Rahul Mehta", branch: "ECE", year: "4th", employability: 54, internship: "—", status: "Searching", risk: "high", riskColor: "bg-red-500" },
  { id: "AK", name: "Aisha Khan", branch: "MBA", year: "2nd", employability: 73, internship: "—", status: "Interning", risk: "medium", riskColor: "bg-amber-400" },
  { id: "VS", name: "Vikram Singh", branch: "ME", year: "4th", employability: 42, internship: "—", status: "Searching", risk: "high", riskColor: "bg-red-500" },
  { id: "SP", name: "Sneha Patel", branch: "CSE", year: "3rd", employability: 91, internship: "—", status: "Interning", risk: "low", riskColor: "bg-green-500" },
  { id: "AN", name: "Arjun Nair", branch: "CS", year: "2nd", employability: 66, internship: "—", status: "Learning", risk: "medium", riskColor: "bg-amber-400" },
  { id: "PS2", name: "Priya Sharma", branch: "CSE", year: "3rd", employability: 87, internship: "—", status: "Interning", risk: "low", riskColor: "bg-green-500" },
  { id: "RM2", name: "Rahul Mehta", branch: "ECE", year: "4th", employability: 54, internship: "—", status: "Searching", risk: "high", riskColor: "bg-red-500" },
  { id: "AK2", name: "Aisha Khan", branch: "MBA", year: "2nd", employability: 73, internship: "—", status: "Interning", risk: "medium", riskColor: "bg-amber-400" },
  { id: "VS2", name: "Vikram Singh", branch: "ME", year: "4th", employability: 42, internship: "—", status: "Searching", risk: "high", riskColor: "bg-red-500" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-purple-600', 'bg-amber-600', 'bg-emerald-500', 
    'bg-blue-600', 'bg-emerald-400', 'bg-indigo-500', 'bg-pink-600'
  ];
  // Simple deterministic hash
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function StudentsTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
      
      {/* Search and Filters Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students by name, branch, year..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none">
            <option>All Branches</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>ME</option>
            <option>MBA</option>
          </select>
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none">
            <option>All Years</option>
            <option>1st</option>
            <option>2nd</option>
            <option>3rd</option>
            <option>4th</option>
          </select>
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 font-medium focus:outline-none">
            <option>All Risk Levels</option>
            <option>Low Risk</option>
            <option>Medium Risk</option>
            <option>High Risk</option>
          </select>
          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors shrink-0">
            Export CSV
          </button>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={itemVariants}>
        <BaseCard className="overflow-hidden border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 font-semibold tracking-wider uppercase">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Branch</th>
                  <th className="px-6 py-4 font-medium">Year</th>
                  <th className="px-6 py-4 font-medium">Employability</th>
                  <th className="px-6 py-4 font-medium">Internship</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-center">Risk</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {students.map((student, idx) => (
                  <tr key={`${student.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(student.name)}`}>
                          {student.id}
                        </div>
                        <span className="font-semibold text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-semibold">{student.branch}</td>
                    <td className="px-6 py-3 text-slate-500 font-semibold">{student.year}</td>
                    <td className="px-6 py-3 text-slate-500 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                           <div 
                             className={`h-full rounded-full ${student.employability > 80 ? 'bg-emerald-500' : student.employability > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                             style={{ width: `${student.employability}%` }}
                           />
                        </div>
                        <span className={student.employability > 80 ? 'text-emerald-600' : student.employability > 60 ? 'text-amber-600' : 'text-red-600'}>
                          {student.employability}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-semibold">{student.internship}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-md border
                        ${student.status === 'Interning' ? 'bg-emerald-50/50 text-emerald-600 border-emerald-100' : 
                          student.status === 'Searching' ? 'bg-amber-50/50 text-amber-600 border-amber-100' : 
                          'bg-purple-50/50 text-purple-600 border-purple-100'}
                      `}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center">
                        <div className="relative flex items-center justify-center w-5 h-5">
                            {student.risk === 'high' ? (
                                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L2 22h20L12 2zm0 18a2 2 0 110-4 2 2 0 010 4zm1-6h-2v-6h2v6z"/>
                                </svg>
                            ) : (
                                <div className={`w-3 h-3 rounded-full ${student.riskColor} shadow-sm border border-black/5`}></div>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 text-xs font-bold rounded-full transition-colors shadow-sm inline-flex items-center justify-center">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BaseCard>
      </motion.div>
    </motion.div>
  );
}