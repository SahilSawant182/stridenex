"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Loader2, X, Search, Globe, Lock } from "lucide-react";
import { createCommunity, getCommunities, getCommunity } from "@/services/api.services";
import SharedCommunityDiscussionView from "./SharedCommunityDiscussionView";
import { useToast } from "@/context/ToastContext";

interface SharedCommunityTabContentProps {
  userType: "mentor" | "college" | "industry";
}

interface Community {
  name: string;
  community_name: string;
  description: string;
  community_type: string;
  user_type: string;
  community_owner: string;
  member_count?: number;
  creation?: string;
}

export default function SharedCommunityTabContent({ userType }: SharedCommunityTabContentProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [communityDetails, setCommunityDetails] = useState<any | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    community_name: "",
    description: "",
    community_type: "Public",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunities();
  }, [userType]);

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      const capitalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1);
      const response = await getCommunities({
        user: email,
        user_type: capitalizedUserType,
      });
      if (response) {
        let communitiesArray = response?.message?.data || response?.data?.data || response?.data || response?.message || [];
        if (!Array.isArray(communitiesArray)) {
          if (Array.isArray(response?.message?.communities)) communitiesArray = response.message.communities;
          else if (Array.isArray(response?.data?.communities)) communitiesArray = response.data.communities;
          else communitiesArray = [];
        }
        setCommunities(Array.isArray(communitiesArray) ? communitiesArray : []);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to load communities", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      const capitalizedUserType = userType.charAt(0).toUpperCase() + userType.slice(1);
      const response = await createCommunity({
        ...formData,
        user_type: capitalizedUserType,
        community_owner: email,
      });
      
      const successMsg = response?.message?.message || response?.data?.message || "Community created successfully!";
      showToast(successMsg, "success");
      setIsModalOpen(false);
      setFormData({ community_name: "", description: "", community_type: "Public" });
      fetchCommunities();
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to create community";
      showToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommunityClick = async (community: Community) => {
    setSelectedCommunityId(community.name);
    setIsFetchingDetails(true);
    try {
      const response = await getCommunity({ community: community.name });
      if (response && (response.message?.data || response.data?.data)) {
        const data = response.message?.data || response.data?.data;
        setCommunityDetails({
          ...data,
          id: data.name,
          name: data.community_name,
          category: data.community_type,
          description: data.description,
        });
      } else {
        // Fallback to list data if API fails to return expected format
        setCommunityDetails({
          ...community,
          id: community.name,
          name: community.community_name,
          category: community.community_type,
          description: community.description,
        });
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch community details", "error");
      setCommunityDetails({
        ...community,
        id: community.name,
        name: community.community_name,
        category: community.community_type,
        description: community.description,
      });
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const filteredCommunities = (Array.isArray(communities) ? communities : []).filter(c => 
    c.community_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCommunityId && communityDetails) {
    return (
      <div className="fixed inset-0 z-[100] w-full h-full bg-[#0E0F10] text-white overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-0 min-h-screen">
          <SharedCommunityDiscussionView 
            community={communityDetails} 
            onBack={() => {
              setSelectedCommunityId(null);
              setCommunityDetails(null);
            }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Communities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect, share, and collaborate with your peers.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm shadow-accent/20"
        >
          <Plus className="w-5 h-5" />
          Create Community
        </button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search communities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
          <p className="text-slate-500 mt-4 font-medium">Loading communities...</p>
        </div>
      ) : filteredCommunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={community.name || index}
              onClick={() => handleCommunityClick(community)}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative"
            >
              {isFetchingDetails && selectedCommunityId === community.name && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  {community.community_type === "Private" ? <Lock className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                  {community.community_type || "Public"}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{community.community_name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">
                {community.description || "No description provided."}
              </p>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Users className="w-4 h-4" />
                  <span>{community.member_count || 1} members</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">No communities found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {searchQuery ? "Try adjusting your search terms." : "You haven't created or joined any communities yet."}
          </p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Create Community</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <form id="create-community-form" onSubmit={handleCreateCommunity} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Community Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.community_name}
                      onChange={(e) => setFormData({ ...formData, community_name: e.target.value })}
                      placeholder="e.g. React Developers"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What is this community about?"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Privacy Type</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, community_type: "Public" })}
                        className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          formData.community_type === "Public" 
                            ? "bg-accent/10 border-accent text-accent" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold text-sm">Public</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, community_type: "Private" })}
                        className={`flex-1 py-3 px-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                          formData.community_type === "Private" 
                            ? "bg-accent/10 border-accent text-accent" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Lock className="w-4 h-4" />
                        <span className="font-semibold text-sm">Private</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="create-community-form"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-accent hover:bg-accent-hover transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Community"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
