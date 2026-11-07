"use client";

import {
  CheckCircle2,
  Copy,
  Facebook,
  Linkedin,
  Mail,
  Send,
  X as CloseIcon,
} from "lucide-react";

interface EventShareModalProps {
  eventTitle: string;
  shareCopied: boolean;
  onCopy: () => void;
  onClose: () => void;
}

export default function EventShareModal({
  eventTitle,
  shareCopied,
  onCopy,
  onClose,
}: EventShareModalProps) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900">Share this event</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            aria-label="Close share dialog"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5 p-5">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-[#0a66c2] hover:bg-[#0a66c2]/5"
            >
              <Linkedin className="h-6 w-6 text-[#0a66c2]" />
              <span className="text-[11px] font-medium text-slate-600">LinkedIn</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(eventTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-black hover:bg-black/5"
            >
              <span className="text-xl font-bold">𝕏</span>
              <span className="text-[11px] font-medium text-slate-600">X</span>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/5"
            >
              <Facebook className="h-6 w-6 text-[#1877F2]" />
              <span className="text-[11px] font-medium text-slate-600">Facebook</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(eventTitle + " " + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-[#25D366] hover:bg-[#25D366]/5"
            >
              <span className="text-xl font-bold text-[#25D366]">◉</span>
              <span className="text-[11px] font-medium text-slate-600">WhatsApp</span>
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(eventTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-[#229ED9] hover:bg-[#229ED9]/5"
            >
              <Send className="h-6 w-6 text-[#229ED9]" />
              <span className="text-[11px] font-medium text-slate-600">Telegram</span>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent("Check out this event: " + currentUrl)}`}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 p-3 transition-colors hover:border-slate-800 hover:bg-slate-50"
            >
              <Mail className="h-6 w-6 text-slate-700" />
              <span className="text-[11px] font-medium text-slate-600">Email</span>
            </a>
          </div>
          <div className="border-t border-slate-100 pt-2">
            <p className="mb-2 text-xs font-medium text-slate-500">Or copy link</p>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="min-w-0 flex-1 truncate bg-transparent px-2 text-[13px] text-slate-600 outline-none"
              />
              <button
                onClick={onCopy}
                className={`flex shrink-0 items-center gap-1.5 rounded border px-3 py-2 text-xs font-medium shadow-sm transition-colors ${
                  shareCopied
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {shareCopied ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {shareCopied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
