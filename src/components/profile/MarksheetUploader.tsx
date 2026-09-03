"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UploadCloud, FileText, CheckCircle2, Trash2, Eye, Paperclip, X, Download } from "lucide-react";
import { buildProfileImageUrl } from "@/services/api.services";

interface MarksheetUploaderProps {
  /** Current value: File object or string URL or null */
  value?: File | string | null;
  /** Callback when file changes */
  onChange: (fileOrUrl: File | string | null) => void;
  disabled?: boolean;
}

export default function MarksheetUploader({ value, onChange, disabled }: MarksheetUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFile = value instanceof File;
  const isUrl = typeof value === "string" && value.length > 0;
  const fullUrl = isUrl ? buildProfileImageUrl(value as string) : null;

  // Compute preview info
  let activeFileName = "Marksheet Document";
  let isImageType = false;

  if (isFile) {
    activeFileName = (value as File).name;
    isImageType = (value as File).type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(activeFileName);
  } else if (isUrl && fullUrl) {
    activeFileName = (value as string).split("/").pop() || "Marksheet Document";
    isImageType = /\.(jpg|jpeg|png|webp|gif)$/i.test(activeFileName);
  }

  const handleOpenPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFile) {
      const blobUrl = URL.createObjectURL(value as File);
      setPreviewBlobUrl(blobUrl);
    } else {
      setPreviewBlobUrl(null);
    }
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  const currentPreviewSrc = isFile ? previewBlobUrl : fullUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />

      {isFile ? (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{(value as File).name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Ready to upload ({((value as File).size / (1024 * 1024)).toFixed(2)} MB)
                </span>
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
              disabled={disabled}
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"
              title="Remove file"
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isUrl ? (
        <div className="flex items-center justify-between p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Paperclip className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Marksheet Attached</p>
              {fullUrl && (
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                >
                  View Current Document <Eye className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all shadow-sm"
              disabled={disabled}
            >
              Replace File
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-all"
              title="Remove file"
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl transition-all ${
            disabled
              ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60"
              : "border-slate-300 hover:border-orange-500 bg-slate-50/50 hover:bg-orange-50/30 cursor-pointer"
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:border-orange-200 transition-all mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
            Click to attach your Marksheet / Results
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            Supports PDF, PNG, JPG, JPEG, DOCX (Max 10MB)
          </p>
        </div>
      )}

      {error && <p className="text-[11px] font-bold text-red-500 ml-1">{error}</p>}

      {/* In-App Document Preview Modal */}
      {mounted && isPreviewOpen && currentPreviewSrc && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden relative">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    Marksheet Preview
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {activeFileName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={currentPreviewSrc}
                  download={activeFileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={handleClosePreview}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 bg-slate-900/90 relative overflow-hidden flex items-center justify-center">
              {isImageType ? (
                <div className="w-full h-full p-4 flex items-center justify-center overflow-auto">
                  <img
                    src={currentPreviewSrc}
                    alt="Marksheet Preview"
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              ) : (
                <iframe
                  src={currentPreviewSrc}
                  title="Marksheet Preview"
                  className="w-full h-full border-0 bg-white"
                />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
