"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/services/api.services";
import { TrendingUp, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

export interface ReferralData {
  success: boolean;
  referral_code: string;
  referrer: string;
  referrer_name: string;
  counts: {
    Student: number;
    College: number;
    Mentor: number;
    Industry: number;
    Partner?: number;
  };
  total: number;
}

interface ReferralPerformanceWidgetProps {
  referralCode: string;
  role: string;
}

export default function ReferralPerformanceWidget({ referralCode, role }: ReferralPerformanceWidgetProps) {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);

  useEffect(() => {
    const fetchReferralStats = async () => {
      if (!referralCode) return;
      try {
        const res = await axios.post(`${BASE_URL}method/stridenex_app.stridenex_app.doctype.referal_details.referal_details.get_referral_module_count`, {
          referral_code: referralCode
        });
        if (res.data && res.data.data) {
          setReferralData(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch referral stats", e);
      }
    };

    fetchReferralStats();
  }, [referralCode]);

  if (!referralData) return null;

  let chartData = [
    { name: 'Students', value: referralData.counts.Student || 0, color: '#3b82f6' }, // Blue
    { name: 'Colleges', value: referralData.counts.College || 0, color: '#8b5cf6' }, // Purple
    { name: 'Mentors', value: referralData.counts.Mentor || 0, color: '#f59e0b' }, // Amber
    { name: 'Industries', value: referralData.counts.Industry || 0, color: '#10b981' }, // Emerald
    { name: 'Partners', value: referralData.counts.Partner || 0, color: '#ef4444' }, // Red
  ];

  if (role === 'student') {
    chartData = chartData.filter(d => d.name === 'Students');
  }

  return (
    <div className="flex flex-col gap-8 w-full mt-8">
      {/* Referral Stats Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 w-full">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Referral Performance</h2>
        </div>
        
        <div className="p-6 sm:p-10">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Summary Total */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex flex-col justify-center shadow-lg">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">Total Signups</p>
              
              <div className="flex items-center gap-6 mb-6">
                <h3 className="text-6xl font-black text-slate-400">{referralData.total}</h3>
                
                <div className="flex-1 flex flex-col gap-2.5">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2.5 h-2.5 rounded-sm" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <span className="text-[11px] uppercase tracking-wider text-slate-300">{item.name}</span>
                      </div>
                      <div 
                        className="px-2 py-0.5 rounded text-xs font-bold" 
                        style={{ backgroundColor: `${item.color}20`, color: item.color }}
                      >
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mt-auto border-t border-slate-700/50 pt-4">
                Total users who have successfully registered using your referral code 
                <span className="font-bold text-white ml-1">&quot;{referralData.referral_code}&quot;</span>.
              </p>
            </div>

            {/* Chart Area */}
            <div className="md:col-span-3 h-[300px]">
              {referralData.total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-600 font-medium mb-1">No referrals yet</p>
                  <p className="text-slate-400 text-sm">Share your code to start seeing statistics here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referral T&C Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 w-full">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Referral Terms & Conditions</h2>
        </div>
        
        <div className="p-6 sm:p-8">
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-slate-500">1</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Share Responsibly:</strong> You may share your referral code via email, social media, or personal networks. Do not use spam, paid advertising (unless authorized), or deceptive practices.
              </p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-slate-500">2</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Eligibility:</strong> Referrals must be new users who have not previously registered on the platform. Self-referrals or creating multiple accounts to earn rewards are strictly prohibited.
              </p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-slate-500">3</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Tracking and Verification:</strong> Referrals are tracked automatically through your unique code. Only successful, verified registrations will be counted towards your performance metrics.
              </p>
            </li>
            <li className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-slate-500">4</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Policy Updates:</strong> We reserve the right to review accounts for fraudulent activity and may suspend referral privileges or modify these terms at any time without prior notice.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
