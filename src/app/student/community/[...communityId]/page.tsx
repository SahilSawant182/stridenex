"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api.services";
import { useToast } from "@/context/ToastContext";
import CommunityDiscussionView from "@/components/dashboards/student/CommunityDiscussionView";
import { Loader2 } from "lucide-react";

interface CommunityDetails {
  id: string;
  name: string;
  category: string;
  description: string;
  categories?: any[];
  tags?: any[];
}

// Email and Name Formatting Helper
const formatChannelName = (name: string): string[] => {
  if (!name) return [];
  if (name.includes(" _ ")) {
    return name
      .split(" _ ")
      .map((part) => {
        const username = part.split("@")[0];
        return username
          .split(/[._-]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      });
  }
  return [
    name
      .split(/[._-]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  ];
};

const getFallbackDescription = (type: string, name: string) => {
  if (type === "Open" || type === "Public") {
    return `Welcome to the ${name} community. A public space to collaborate, ask questions, share resources, and grow with peers.`;
  }
  return `A private channel for direct communications and close collaboration between members.`;
};

export default function CommunityDiscussionPage({
  params,
}: {
  params: Promise<{ communityId: string[] }>;
}) {
  const unwrappedParams = use(params);
  const communityIdRaw = unwrappedParams.communityId;
  const communityId = Array.isArray(communityIdRaw)
    ? communityIdRaw.join("/")
    : communityIdRaw;
  
  const router = useRouter();
  const { showToast } = useToast();
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [community, setCommunity] = useState<CommunityDetails | null>(null);

  const validateAndLoad = async () => {
    setIsLoading(true);
    try {
      const apiKey = typeof window !== "undefined" ? localStorage.getItem("apiKey") : null;
      const apiSecret = typeof window !== "undefined" ? localStorage.getItem("apiSecret") : null;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey && apiSecret) {
        headers["Authorization"] = `token ${apiKey}:${apiSecret}`;
      }

      const response = await apiService.post(
        "method/stridenex_app.stridenex_app.doctype.community.community.get_community",
        { community: communityId }
      );

      let data = null;
      if (response?.data) {
        data = response.data;
      } else if (response?.message?.data) {
        data = response.message.data;
      } else if (response?.message) {
        data = response.message;
      }

      let foundComm: CommunityDetails = {
        id: communityId,
        name: data?.community_name || formatChannelName(communityId).join(" & "),
        category: data?.community_type || "Public",
        description: data?.description || getFallbackDescription(data?.community_type || "Public", data?.community_name || communityId),
        categories: data?.categories || [],
        tags: data?.tags || [],
      };

      setCommunity(foundComm);
      setIsValidated(true);
    } catch (err: any) {
      console.error("Access validation failed:", err);
      showToast(
        err?.message || "You must join this community to access the discussions.",
        "error"
      );
      router.push("/student/dashboard/community");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateAndLoad();
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-sm font-semibold">Verifying community membership...</p>
      </div>
    );
  }

  if (!isValidated || !community) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-1">
      <CommunityDiscussionView
        community={community}
        onBack={() => router.push("/student/dashboard/community")}
        onRefresh={validateAndLoad}
      />
    </div>
  );
}
