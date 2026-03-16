"use client";

import React from 'react';
import { motion, Variants } from "framer-motion";
import { BaseCard } from "@/components/dashboards/shared/BaseCard";
import { Check, Building2, Download, FileText } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const billingHistory = [
  { date: "Feb 1, 2025", desc: "Pro Plan — Monthly", amount: "₹299", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { date: "Jan 1, 2025", desc: "Pro Plan — Monthly", amount: "₹299", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { date: "Dec 1, 2024", desc: "Pro Plan — Monthly", amount: "₹299", status: "Paid", statusColor: "bg-emerald-50 text-emerald-600 border-emerald-100" }
];

export default function PlansTabContent() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         
         {/* Starter Plan */}
         <motion.div variants={itemVariants}>
           <BaseCard className="p-8 border-slate-200 shadow-sm h-full flex flex-col bg-white">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Starter</h3>
                <div className="flex items-baseline gap-1 mt-2 mb-8">
                  <span className="text-4xl font-black text-slate-400">₹4,999</span>
                  <span className="text-sm font-bold text-slate-400">/mo</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                   <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                     <Check className="w-4 h-4 text-emerald-500" />
                     50 students
                   </li>
                   <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                     <Check className="w-4 h-4 text-emerald-500" />
                     Basic analytics
                   </li>
                   <li className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                     <Check className="w-4 h-4 text-emerald-500" />
                     5 internship posts
                   </li>
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-sm transition-colors text-sm">
                  Upgrade
                </button>
              </div>
           </BaseCard>
         </motion.div>

         {/* Institution Plan (Current) */}
         <motion.div variants={itemVariants}>
           <div className="relative h-full">
               <BaseCard className="p-8 border-orange-500 shadow-md h-full flex flex-col bg-white ring-1 ring-orange-500/50">
                  <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                    Current Plan
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-orange-500 tracking-tight">Institution</h3>
                    <div className="flex items-baseline gap-1 mt-2 mb-8">
                      <span className="text-4xl font-black text-orange-500">₹14,999</span>
                      <span className="text-sm font-bold text-orange-400">/mo</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         Unlimited students
                       </li>
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         Full analytics + NEP reports
                       </li>
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         Unlimited postings
                       </li>
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         AI Employability scoring
                       </li>
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         NEP/UGC compliance dashboard
                       </li>
                       <li className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                         <Check className="w-4 h-4 text-emerald-500" />
                         Grievance Engine
                       </li>
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                      Current Plan
                    </button>
                  </div>
               </BaseCard>
           </div>
         </motion.div>
       </div>

       {/* Billing History */}
       <motion.div variants={itemVariants}>
         <BaseCard className="border-slate-200 overflow-hidden shadow-sm p-0">
            <h3 className="text-sm font-bold text-slate-800 p-5 border-b border-slate-100 flex items-center gap-2 tracking-wide">
              Billing History
            </h3>
            
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {billingHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">{item.date}</td>
                    <td className="px-5 py-4">{item.desc}</td>
                    <td className="px-5 py-4">{item.amount}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button className="text-[10px] font-bold uppercase tracking-wider border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 py-1.5 px-3 rounded bg-white transition-colors">
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </BaseCard>
       </motion.div>

    </motion.div>
  );
}
