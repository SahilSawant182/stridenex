"use client";

import { motion, Variants } from "framer-motion";
import { Plus, MapPin } from "lucide-react";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

const internships = [
  { id: 1, role: "Backend Engineer Intern", type: "Technical", location: "Bengaluru/Hybrid", stipend: "₹40k/mo", openings: 5, applications: 78, deadline: "Mar 5", status: "Active" },
  { id: 2, role: "Product Analytics Intern", type: "Business", location: "Bengaluru", stipend: "₹35k/mo", openings: 3, applications: 54, deadline: "Mar 10", status: "Active" },
  { id: 3, role: "ML Research Intern", type: "Research", location: "Remote", stipend: "₹30k/mo", openings: 2, applications: 41, deadline: "Feb 28", status: "Closing" },
  { id: 4, role: "Design Intern (UX)", type: "Design", location: "Bengaluru", stipend: "₹25k/mo", openings: 2, applications: 19, deadline: "Mar 20", status: "Active" },
  { id: 5, role: "Fintech Analyst Intern", type: "Finance", location: "Remote", stipend: "₹20k/mo", openings: 4, applications: 55, deadline: "Mar 15", status: "Active" }
];

export default function InternshipsTabContent() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Internship Postings</h2>
          <p className="text-sm text-slate-500">Manage active and draft internship opportunities</p>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
          <Plus className="w-4 h-4" /> Post Internship
        </button>
      </div>

      <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50">
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stipend</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Openings</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applications</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deadline</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {internships.map((internship) => (
                <tr key={internship.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                    {internship.role}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                      {internship.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      {internship.location}
                    </div>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap font-medium text-slate-700 text-sm">
                    {internship.stipend}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap font-bold text-slate-800 text-sm">
                    {internship.openings}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap font-bold text-blue-600 text-sm cursor-pointer hover:underline">
                    {internship.applications}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`text-sm font-medium ${internship.deadline === "Feb 28" ? 'text-red-500' : 'text-slate-600'}`}>
                      {internship.deadline}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      internship.status === 'Active' 
                        ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' 
                        : 'text-red-500 bg-red-50 border border-red-100'
                    }`}>
                      {internship.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <button className="text-slate-500 hover:text-blue-600 font-medium text-xs px-3 py-1.5 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 bg-white rounded-lg transition-colors mr-2">
                      View
                    </button>
                    <button className="text-slate-500 hover:text-slate-700 font-medium text-xs px-3 py-1.5 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
