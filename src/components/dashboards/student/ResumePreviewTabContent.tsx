// components/dashboards/student/ResumePreviewTabContent.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Eye, 
  Download, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { BASE_DOMAIN } from "@/services/api.services";
import { useAuth } from "@/context/AuthContext";

export default function ResumePreviewTabContent({ onBack }: { onBack?: () => void }) {
  const { currentUser } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState("professional_resume");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const studentEmail = typeof window !== "undefined" 
    ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || currentUser || "") 
    : (currentUser || "");

  useEffect(() => {
    let active = true;
    setIframeLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const url = `${BASE_DOMAIN}/api/method/stridenex_app.api_stridenex_app.student.student.get_student_resume?student=${encodeURIComponent(studentEmail)}&template=${selectedTemplate}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to load resume");
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        if (active) {
          setPdfBlobUrl(blobUrl);
          setIframeLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        if (active) {
          setError(err.message || "Could not load resume preview");
          setIframeLoading(false);
        }
      }
    };

    if (studentEmail) {
      loadPdf();
    } else {
      setIframeLoading(false);
    }

    return () => {
      active = false;
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [selectedTemplate, studentEmail]);

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = `${selectedTemplate}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Control Panel */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-zinc-500 hover:text-orange-500 transition-colors text-xs font-bold mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </button>
          )}
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <Eye className="w-5.5 h-5.5 text-orange-500" />
            Resume Preview
          </h1>
          <p className="text-xs text-zinc-500">
            Select a resume template from the dropdown to preview or download it.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Template Dropdown */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer shadow-sm min-w-[180px]"
          >
            <option value="classic_resume">Classic Resume</option>
            <option value="compact_grid_resume">Compact Grid Resume</option>
            <option value="professional_resume">Professional Resume</option>
            <option value="modern_resume">Modern Resume</option>
            <option value="elegant_resume">Elegant Resume</option>
          </select>

          {/* Manual Download Button */}
          <button
            onClick={handleDownload}
            disabled={iframeLoading || !!error || !pdfBlobUrl}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-150 disabled:text-zinc-400 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Live Preview Iframe Container */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-2 shadow-sm relative overflow-hidden min-h-[920px] flex items-center justify-center">
        {iframeLoading && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 gap-3">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="text-xs font-semibold text-zinc-500">Loading resume preview...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10 gap-3 px-6 text-center">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            <button 
              onClick={() => setSelectedTemplate(selectedTemplate)}
              className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        {pdfBlobUrl ? (
          <iframe
            src={`${pdfBlobUrl}#toolbar=0&navpanes=0&view=FitH`}
            className="w-full h-[900px] border-0 bg-white"
          />
          ) : (
            !iframeLoading && (
              <div className="text-center py-12 space-y-2">
                <FileText className="w-12 h-12 text-zinc-350 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-700">No Student Profile Loaded</h3>
                <p className="text-xs text-zinc-400">Please make sure you are logged in to preview your resume.</p>
              </div>
            )
          )}
        </div>

      </div>
  );
}
