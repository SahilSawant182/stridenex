"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, X, Send, Edit, User, Mail, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Blogger {
  name?: string;
  blogger_name: string;
  short_name: string;
  full_name: string;
  user: string;
  bio: string;
  avatar: string | null;
  _user_tags: string | null;
  _comments: string | null;
  _assign: string | null;
  _liked_by: string | null;
  [key: string]: unknown;
}

const BASE_URL = 'https://devstridenex.quantcloud.in';

export default function BloggersPage() {
  const [bloggers, setBloggers] = useState<Blogger[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Blogger>({
    blogger_name: "",
    short_name: "",
    full_name: "",
    user: "",
    bio: "",
    avatar: null,
    _user_tags: null,
    _comments: null,
    _assign: null,
    _liked_by: null
  });

  useEffect(() => {
    fetchBloggers();
  }, []);

  const fetchBloggers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.get_bloggers`);
      const data = await res.json();
      if (data.message && data.message.data) {
        setBloggers(data.message.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData({
      blogger_name: "",
      short_name: "",
      full_name: "",
      user: "",
      bio: "",
      avatar: null,
      _user_tags: null,
      _comments: null,
      _assign: null,
      _liked_by: null
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, blogger: Blogger) => {
    e.stopPropagation();
    setFormData({
      name: blogger.name,
      blogger_name: blogger.name || "",
      short_name: blogger.short_name || "",
      full_name: blogger.full_name || "",
      user: blogger.user || "",
      bio: blogger.bio || "",
      avatar: blogger.avatar || null,
      _user_tags: blogger._user_tags || null,
      _comments: blogger._comments || null,
      _assign: blogger._assign || null,
      _liked_by: blogger._liked_by || null
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing 
        ? `${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.update_blogger`
        : `${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.create_blogger`;

      const payload = {
        ...(isEditing && formData.name ? { name: formData.name } : {}),
        blogger_name: formData.blogger_name,
        short_name: formData.short_name,
        full_name: formData.full_name,
        user: formData.user,
        bio: formData.bio,
        avatar: formData.avatar,
        _user_tags: formData._user_tags,
        _comments: formData._comments,
        _assign: formData._assign,
        _liked_by: formData._liked_by
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!data.exc_type) {
        alert(isEditing ? "Blogger updated!" : "Blogger created!");
        setIsModalOpen(false);
        fetchBloggers();
      } else {
        alert("Error saving blogger: " + (data.exc || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const filteredBloggers = bloggers.filter(blogger => 
    (blogger.name && blogger.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (blogger.full_name && blogger.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (blogger.user && blogger.user.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative bg-white border-b border-slate-200 pb-12 pt-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Manage the <span className="text-blue-600">Voices</span> of StrideNex
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 mb-8 font-medium">
              Create and organize the experts who share their insights with the community.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full">
              <div className="relative w-full sm:max-w-md group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search bloggers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={openCreateModal}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
                Add Blogger
              </button>

              <Link 
                href="/blogs"
                className="w-full sm:w-auto px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium text-lg">Loading bloggers...</div>
        ) : filteredBloggers.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No bloggers found</h3>
            <p className="text-slate-500">We couldn\We couldn\We couldn't find anyoneapos;t find anyoneapos;t find anyone matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBloggers.map((blogger) => (
              <div 
                key={blogger.name} 
                className="group bg-white rounded-3xl border border-slate-100 p-8 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 relative"
              >
                <div className="absolute top-6 right-6">
                   <button onClick={(e) => openEditModal(e, blogger)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100">
                     <Edit className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 text-blue-600 flex items-center justify-center font-bold text-2xl shadow-inner border border-white">
                    {blogger.name?.[0]?.toUpperCase() || "B"}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{blogger.full_name || blogger.name}</h3>
                    <p className="text-sm font-medium text-slate-500">@{blogger.short_name || blogger.name}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{blogger.user || "No email"}</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <span className="line-clamp-2">{blogger.bio || "No bio provided."}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isEditing ? "Edit Blogger Profile" : "Add New Blogger"}</h2>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">{isEditing ? "Update blogger information and bio" : "Create a new expert profile for StrideNex"}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50 overflow-y-auto max-h-[70vh]">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Blogger Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. quantbit" 
                    value={formData.blogger_name}
                    onChange={(e) => setFormData({...formData, blogger_name: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Short Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. quant" 
                    value={formData.short_name}
                    onChange={(e) => setFormData({...formData, short_name: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stridenex" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">User Email</label>
                  <input 
                    type="email" 
                    placeholder="e.g. sstridenex@gmail.com" 
                    value={formData.user}
                    onChange={(e) => setFormData({...formData, user: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Biography</label>
                <textarea 
                  placeholder="Share a brief description about the author..." 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all resize-y min-h-[140px] shadow-sm font-medium placeholder:text-slate-400 leading-relaxed"
                />
              </div>
              
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                {isEditing ? "Save Changes" : "Create Blogger"}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
