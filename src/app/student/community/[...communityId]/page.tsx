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

  useEffect(() => {
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

        // 1. Verify / Join channel
        const joinUrl = `method/stridenex_app.api_stridenex_app.raven.join_channel`;
        await apiService.post(joinUrl, { channel_id: communityId }, { headers });

        // 2. Fetch channel list to get metadata
        const channelsResponse = await apiService.get(
          "method/stridenex_app.api_stridenex_app.raven.list_channels"
        );
        
        let foundComm: CommunityDetails = {
          id: communityId,
          name: formatChannelName(communityId).join(" & "),
          category: "Public",
          description: "",
        };

        if (channelsResponse && channelsResponse.message) {
          const rawChannel = channelsResponse.message.find(
            (c: any) => c.name === communityId
          );
          if (rawChannel) {
            const prettyName = formatChannelName(rawChannel.channel_name);
            const prettyNameStr = prettyName.join(" & ");
            foundComm = {
              id: rawChannel.name,
              name: prettyNameStr,
              category: rawChannel.type || "Public",
              description:
                rawChannel.channel_description ||
                getFallbackDescription(rawChannel.type, prettyNameStr),
            };
          }
        }
        
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

    validateAndLoad();
  }, [communityId, router, showToast]);

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
    <div className="w-full min-h-screen bg-[#0E0F10] text-white p-1">
      <CommunityDiscussionView
        community={community}
        onBack={() => router.push("/student/dashboard/community")}
      />
    </div>
  );
}
