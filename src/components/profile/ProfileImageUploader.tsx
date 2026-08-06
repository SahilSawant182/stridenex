"use client";

import { useRef, useState } from "react";
import { Camera, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { uploadProfilePicture, buildProfileImageUrl } from "@/services/api.services";
import { useAuth } from "@/context/AuthContext";

interface ProfileImageUploaderProps {
  /** Current image URL (from Frappe file_url) */
  currentImageUrl?: string | null;
  /** Initials to show when no image is set */
  initials?: string;
  /** Avatar background color class, e.g. "bg-orange-500" */
  bgClass?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Called after a successful upload with the new file_url */
  onSuccess?: (fileUrl: string) => void;
}

const sizeMap = {
  sm: { outer: "w-12 h-12", text: "text-base", icon: "w-3 h-3", badge: "w-5 h-5 bottom-0 right-0" },
  md: { outer: "w-20 h-20", text: "text-2xl", icon: "w-4 h-4", badge: "w-7 h-7 -bottom-1 -right-1" },
  lg: { outer: "w-28 h-28", text: "text-3xl", icon: "w-5 h-5", badge: "w-9 h-9 -bottom-1 -right-1" },
};

export default function ProfileImageUploader({
  currentImageUrl,
  initials = "U",
  bgClass = "bg-gradient-to-br from-violet-500 to-orange-500",
  size = "md",
  onSuccess,
}: ProfileImageUploaderProps) {
  const { updateUserImage } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sz = sizeMap[size];
  const displayUrl = previewUrl ?? buildProfileImageUrl(currentImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, GIF, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB");
      return;
    }

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setUploading(true);
    try {
      const result = await uploadProfilePicture(file);
      // Build the full display URL
      const fullUrl = buildProfileImageUrl(result.file_url);
      if (fullUrl) setPreviewUrl(fullUrl);

      // Persist in AuthContext & localStorage
      updateUserImage(result.file_url);
      onSuccess?.(result.file_url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Upload failed. Please try again.");
      setPreviewUrl(null); // revert preview
    } finally {
      setUploading(false);
      // Reset input so re-selecting same file triggers onChange
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar circle */}
      <div className="relative group">
        <div
          className={`${sz.outer} rounded-full ${bgClass} flex items-center justify-center text-white font-bold ${sz.text} shrink-0 overflow-hidden ring-4 ring-white shadow-lg`}
        >
          {displayUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <span>{initials}</span>
          )}

          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Camera badge button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={`absolute ${sz.badge} rounded-full bg-white border-2 border-slate-200 shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors`}
          title="Change profile picture"
        >
          {uploading ? (
            <Loader2 className={`${sz.icon} text-blue-600 animate-spin`} />
          ) : success ? (
            <CheckCircle className={`${sz.icon} text-emerald-500`} />
          ) : (
            <Camera className={`${sz.icon} text-slate-600`} />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button label */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 transition-colors"
      >
        {uploading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Upload className="w-3 h-3" /> Change photo
          </>
        )}
      </button>

      {/* Feedback messages */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 max-w-[200px] text-center">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && !error && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
          <CheckCircle className="w-3 h-3 shrink-0" />
          <span>Profile photo updated!</span>
        </div>
      )}
    </div>
  );
}
