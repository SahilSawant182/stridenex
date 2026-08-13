import React, { useState } from "react";
import { ArrowLeft, MessageSquare, Plus, Folder, Hash, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SharedCommunityDiscussionViewProps {
  community: any;
  onBack: () => void;
}

export default function SharedCommunityDiscussionView({ community, onBack }: SharedCommunityDiscussionViewProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "discussions" | "members">("categories");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = community?.categories || [];
  const tags = community?.tags || [];

  return (
    <div className="flex flex-col h-screen w-full bg-[#0E0F10] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2023] bg-[#121315]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 border-l border-[#1F2023] pl-4">
            <MessageSquare className="w-5 h-5 text-white" />
            <h1 className="text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate">
              {community.community_name || community.name} Space
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-blue-900/40 text-blue-400 uppercase">
              {community.community_type || 'Public'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button className="h-8 bg-[#FF6B00] hover:bg-[#E66000] text-white text-xs font-bold border-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Create Topic
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-[#1F2023] bg-[#121315] flex flex-col hidden md:flex overflow-y-auto">
          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">Navigation</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab("categories")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "categories" ? "bg-[#1F2023] text-white" : "text-slate-400 hover:text-white hover:bg-[#1F2023]/50"
                }`}
              >
                <Folder className={`w-4 h-4 ${activeTab === "categories" ? "text-blue-500" : ""}`} />
                Categories
              </button>
              <button 
                onClick={() => setActiveTab("discussions")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "discussions" ? "bg-[#1F2023] text-white" : "text-slate-400 hover:text-white hover:bg-[#1F2023]/50"
                }`}
              >
                <MessageSquare className={`w-4 h-4 ${activeTab === "discussions" ? "text-[#FF6B00]" : ""}`} />
                Discussions Feed
              </button>
              <button 
                onClick={() => setActiveTab("members")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "members" ? "bg-[#1F2023] text-white" : "text-slate-400 hover:text-white hover:bg-[#1F2023]/50"
                }`}
              >
                <Hash className={`w-4 h-4 ${activeTab === "members" ? "text-[#10B981]" : ""}`} />
                Members
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-4 border-t border-[#1F2023]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Categories</h3>
              <span className="text-slate-500 text-xs">▼</span>
            </div>
            <div className="space-y-1">
              {categories.length > 0 ? (
                categories.map((cat: any, idx: number) => (
                  <button key={idx} className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1F2023]/50 transition-colors text-left">
                    <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
                    <span className="truncate">{cat.category_name || cat.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500 px-3">No categories defined.</p>
              )}
            </div>
          </div>

          {/* Tags List */}
          <div className="p-4 border-t border-[#1F2023]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Tags</h3>
              <div className="flex items-center gap-2">
                <Plus className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" />
                <span className="text-slate-500 text-xs">▼</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag: any, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-[#1F2023] text-slate-400 rounded-md text-[10px] font-semibold border border-[#334155] cursor-pointer hover:text-white hover:border-slate-500 transition-colors">
                    #{tag.title || tag.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500 px-3">No tags found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-[#0E0F10]">
          <div className="max-w-5xl w-full mx-auto p-6 md:p-8">
            {/* Header / Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-white mb-4 tracking-tight">
                Welcome to {community.community_name || community.name} discussions!
              </h2>
              <div className="flex items-start justify-between gap-6">
                <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {community.description || "A central space to collaborate, find support, ask technical questions, and share resources with fellow members."}
                </p>
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search discussions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-[#121315] border border-[#1F2023] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sub Nav */}
            <div className="flex items-center gap-6 border-b border-[#1F2023] mb-6">
              <button 
                onClick={() => setActiveTab("categories")}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "categories" ? "text-[#FF6B00] border-[#FF6B00]" : "text-slate-400 border-transparent hover:text-white"
                }`}
              >
                Categories
              </button>
              <button 
                onClick={() => setActiveTab("discussions")}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "discussions" ? "text-[#FF6B00] border-[#FF6B00]" : "text-slate-400 border-transparent hover:text-white"
                }`}
              >
                Discussions Feed
              </button>
              <button 
                onClick={() => setActiveTab("members")}
                className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "members" ? "text-[#FF6B00] border-[#FF6B00]" : "text-slate-400 border-transparent hover:text-white"
                }`}
              >
                Members
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "categories" && (
              <div className="space-y-4">
                {categories.length > 0 ? (
                  categories.map((cat: any, idx: number) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-stretch bg-[#121315] border border-[#1F2023] rounded-xl overflow-hidden hover:border-[#334155] transition-colors cursor-pointer">
                      {/* Left Side: Category Info */}
                      <div className="flex-1 p-5 md:border-r border-[#1F2023]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                          <h3 className="text-lg font-bold text-white">{cat.category_name || cat.name}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                          {cat.description || `Discussions related to ${cat.category_name || cat.name}.`}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-[#1F2023] rounded text-[10px] font-medium text-slate-300 border border-[#27272A]">Introductions</span>
                          <span className="px-2 py-1 bg-[#1F2023] rounded text-[10px] font-medium text-slate-300 border border-[#27272A]">News</span>
                        </div>
                      </div>
                      
                      {/* Middle: Stats */}
                      <div className="hidden md:flex flex-col items-center justify-center p-5 min-w-[120px] md:border-r border-[#1F2023]">
                        <span className="text-lg font-bold text-white">0 / month</span>
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-1">Topics</span>
                      </div>

                      {/* Right Side: Latest Topics */}
                      <div className="flex-1 p-5 hidden lg:flex flex-col justify-center space-y-3">
                        <div className="flex items-center justify-between group">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-3 h-3 text-slate-500 flex-shrink-0" />
                            <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">Welcome to the category!</span>
                          </div>
                          <span className="text-[10px] text-slate-500 flex-shrink-0 ml-4">1d</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-[#121315] rounded-xl border border-[#1F2023]">
                    <Folder className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-white mb-1">No categories yet</h3>
                    <p className="text-xs text-slate-400">This community doesn't have any categories defined.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "discussions" && (
              <div className="space-y-4">
                <div className="text-center py-12 bg-[#121315] rounded-xl border border-[#1F2023]">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-base font-semibold text-white mb-2">No discussions found</h3>
                  <p className="text-sm text-slate-400">Be the first to start a conversation in this community!</p>
                  <Button className="mt-6 bg-[#FF6B00] hover:bg-[#E66000] text-white">
                    Start a Discussion
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "members" && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-4">Community Members ({community.members?.length || 0})</h3>
                {community.members && community.members.length > 0 ? (
                  community.members.map((member: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-[#121315] border border-[#1F2023] rounded-xl hover:border-[#334155] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1F2023] border border-[#334155] flex items-center justify-center font-bold text-white">
                          {(member.member || "G")[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{member.member}</h4>
                          <p className="text-xs text-slate-400">Joined on {new Date(member.joined_on).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                          member.role === 'Admin' ? 'bg-blue-900/40 text-blue-400' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {member.role || "Member"}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase ${
                          member.status === 'Approved' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'
                        }`}>
                          {member.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-[#121315] rounded-xl border border-[#1F2023]">
                    <h3 className="text-sm font-semibold text-white mb-1">No members found</h3>
                    <p className="text-xs text-slate-400">This community doesn't have any members yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
