"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  CheckCircle, 
  Award, 
  Calendar, 
  User, 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  AlertCircle
} from 'lucide-react';

interface Skill {
  name: string;
  student: string;
  skill: string;
  skill_level: string;
  event_type: string;
}

interface CertificateData {
  certificate: {
    name: string;
    sr_no: string;
    student_name: string;
    assessment_name: string;
    issued_date: string;
  };
  student: {
    name: string;
    full_name: string;
    email: string | null;
    mobile_no: string | null;
    enabled: string | null;
  };
  skills: Skill[];
  skill_count: number;
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ? (process.env.NEXT_PUBLIC_API_BASE_URL.endsWith('/') ? process.env.NEXT_PUBLIC_API_BASE_URL : process.env.NEXT_PUBLIC_API_BASE_URL + '/') : '/';
        const url = new URL(`${apiBase}method/stridenex_app.api_stridenex_app.student.masters.get_student_certificate_info`);
        url.searchParams.append('sr_no', id);

        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!res.ok) {
          throw new Error('Failed to verify certificate.');
        }

        const json = await res.json();
        if (json.message?.success && json.message?.data) {
          setData(json.message.data);
        } else if (json.data?.success && json.data?.data) {
           setData(json.data.data);
        } else {
          throw new Error('Certificate not found or invalid.');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An error occurred while verifying the certificate.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6 animate-pulse">
           <ShieldCheck className="w-10 h-10 text-orange-500 animate-bounce" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Verifying Certificate...</h2>
        <p className="text-slate-500">Securely checking records on StrideNEX</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center border border-slate-100">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Verification Failed</h1>
          <p className="text-slate-600 mb-8">{error || 'This certificate could not be found in our system.'}</p>
          <div className="text-sm text-slate-400">
            Certificate ID: <span className="font-mono text-slate-600 font-medium">{id}</span>
          </div>
        </div>
      </div>
    );
  }

  const { certificate, student, skills } = data;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Certificate Header & User Info */}
          <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-orange-500 p-8 md:w-2/5 flex flex-col justify-center items-center text-center relative overflow-hidden flex-shrink-0">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
             
             <div className="relative z-10 w-full flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide mb-1">Verified Credential</h1>
                <p className="text-purple-100 font-medium text-[10px] uppercase tracking-widest mb-8">StrideNEX Official</p>

                <h2 className="text-2xl font-bold text-white mb-1 capitalize">
                  {student.full_name || certificate.student_name}
                </h2>
                <p className="text-purple-100 mb-6 flex items-center justify-center gap-1.5 text-xs">
                   <User className="w-3.5 h-3.5" /> {student.name}
                </p>
                
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex justify-center items-center gap-1.5 mb-1 text-purple-100 font-bold text-[10px] uppercase tracking-widest">
                    <Award className="w-3.5 h-3.5" />
                    Achievement
                  </div>
                  <div className="text-lg font-bold text-white mb-2 leading-tight">
                    {certificate.assessment_name}
                  </div>
                  <div className="inline-flex justify-center items-center gap-1.5 text-purple-100 text-[10px] font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Issued {new Date(certificate.issued_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
             </div>
          </div>

          {/* Right Column: Skills */}
          <div className="p-6 sm:p-8 md:w-3/5 flex flex-col bg-white">
            
            {skills && skills.length > 0 ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-500" />
                    Skills Validated
                  </h3>
                  <span className="bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-xs font-bold border border-purple-100">
                    {skills.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
                  {skills.map((s, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-sm hover:bg-white transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate leading-tight">{s.skill}</p>
                          <p className="text-[9px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                            <BookOpen className="w-2.5 h-2.5" /> {s.skill_level}
                          </p>
                        </div>
                      </div>
                      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400 bg-white border border-slate-100 px-1.5 py-0.5 rounded whitespace-nowrap ml-2">
                        {s.event_type.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                No skills recorded.
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium tracking-wide">
               <span>CERTIFICATE ID: <span className="font-mono text-slate-500">{certificate.sr_no}</span></span>
               <span className="text-slate-300">|</span>
               <span>Powered by StrideNEX</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
