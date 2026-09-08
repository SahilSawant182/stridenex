"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Clock, X, Send, ChevronLeft, Edit, Trash2, Users } from "lucide-react";
import Link from "next/link";

interface Blog {
  name: string;
  title: string;
  blog_category: string;
  blogger: string;
  blog_intro: string;
  published?: number;
  creation: string;
  [key: string]: unknown;
}

const BASE_URL = 'https://devstridenex.quantcloud.in';

export default function BlogsPage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readingBlog, setReadingBlog] = useState<Blog | null>(null);
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    blog_category: "",
    blogger: "",
    blog_intro: "",
    published: 1,
    creation: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.get_blog_posts`);
      const data = await res.json();
      if (data.message && data.message.data) {
        const fetchedBlogs = data.message.data;
        fetchedBlogs.sort((a: Blog, b: Blog) => new Date(a.creation.replace(" ", "T")).getTime() - new Date(b.creation.replace(" ", "T")).getTime());
        setBlogs(fetchedBlogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.delete_blog_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!data.exc_type) {
        alert("Deleted successfully");
        fetchBlogs();
        if (readingBlog?.name === name) setReadingBlog(null);
      } else {
        alert("Error deleting blog");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();
    setFormData({
      name: blog.name,
      title: blog.title || "",
      blog_category: blog.blog_category || "",
      blogger: blog.blogger || "",
      blog_intro: blog.blog_intro || "",
      published: blog.published !== undefined ? Number(blog.published) : 1,
      creation: blog.creation || ""
    });
    setIsEditing(true);
    setIsPostModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      title: "",
      blog_category: "",
      blogger: "",
      blog_intro: "",
      published: 1,
      creation: ""
    });
    setIsEditing(false);
    setIsPostModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const url = isEditing 
        ? `${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.update_blog_post`
        : `${BASE_URL}/api/method/stridenex_app.api_stridenex_app.blog.create_blog_post`;
        
      const now = new Date().toISOString().replace('T', ' ');
      const payload = {
        name: formData.name || "",
        title: formData.title || "",
        blog_intro: formData.blog_intro || "",
        blog_category: formData.blog_category || "",
        blogger: formData.blogger || "",
        published: formData.published,
        route: formData.name ? `blog/${formData.blog_category}/${formData.name}` : `blog/${formData.blog_category}/${formData.title.toLowerCase().replace(/\\s+/g, '-')}`,
        creation: formData.creation || now,
        modified: now
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.exc_type) {
        alert(isEditing ? "Blog updated!" : "Blog created!");
        setIsPostModalOpen(false);
        fetchBlogs();
        if (isEditing && readingBlog?.name === formData.name) {
           setReadingBlog({ ...readingBlog, ...formData } as Blog);
        }
      } else {
        alert("Error saving blog");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isPostModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isPostModalOpen]);

  const filteredBlogs = blogs.filter(blog => 
    (blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (blog.blog_category && blog.blog_category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {!readingBlog ? (
        <>
          <section className="bg-white pb-8 pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  Blog
                </h1>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 text-sm text-slate-900 placeholder:text-slate-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    onClick={openCreateModal}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    Write
                  </button>
                  <Link 
                    href="/bloggers"
                    className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                  >
                    <Users className="w-4 h-4" />
                    Bloggers
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6">
            {loading ? (
              <div className="text-center py-20 text-slate-500 font-medium">Loading blogs...</div>
            ) : filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-500 text-sm">We couldn&apos;t find anything matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <article 
                    key={blog.name} 
                    onClick={() => setReadingBlog(blog)}
                    className="group bg-white rounded-xl border border-slate-200 p-6 flex flex-col h-full cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex flex-col flex-1">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        {blog.blog_category || "General"}
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-1 leading-relaxed">
                        {blog.blog_intro}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                             {blog.blogger?.[0]?.toUpperCase() || "A"}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-sm font-semibold text-slate-900">{blog.blogger || "Admin"}</span>
                             <span className="text-xs text-slate-500">
                               {new Date(blog.creation.replace(" ", "T")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · 5 min read
                             </span>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={(e) => openEditModal(e, blog)} className="p-1.5 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-900" title="Edit">
                             <Edit className="w-4 h-4" />
                           </button>
                           <button onClick={(e) => handleDelete(e, blog.name)} className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-slate-400 hover:text-red-600" title="Delete">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <div className="w-full bg-white min-h-screen animate-in fade-in duration-500">
          <div className="w-full max-w-4xl mx-auto py-6 px-6 flex items-center justify-between border-b border-slate-100">
            <button 
              onClick={() => setReadingBlog(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Blogs</span>
            </button>
            <div className="flex items-center gap-4">
              <button onClick={(e) => { e.stopPropagation(); openEditModal(e, readingBlog); }} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(e, readingBlog.name); }} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <article className="w-full max-w-4xl mx-auto pt-10 pb-20 px-6">
            <div className="mb-8 text-left">
              <div className="flex items-center gap-2 text-blue-500 text-sm mb-4">
                 <span className="hover:underline cursor-pointer">Blog</span>
                 <span className="text-slate-300">/</span>
                 <span className="hover:underline cursor-pointer">{readingBlog.blog_category || "General"}</span>
              </div>
              
              <h1 className="text-3xl md:text-[40px] font-semibold text-slate-900 mb-4 leading-tight tracking-tight">
                {readingBlog.title}
              </h1>
              
              <p className="text-[15px] md:text-base text-slate-700 mb-6 leading-relaxed">
                {readingBlog.blog_intro}
              </p>
              
              <p className="text-[13px] text-slate-500">
                {new Date(readingBlog.creation.replace(" ", "T")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · 5 min read
              </p>
            </div>

            <hr className="border-slate-200 my-8" />

            <div 
              className="prose prose-slate max-w-none text-[15px] md:text-base leading-relaxed text-slate-700 space-y-4 break-words"
              dangerouslySetInnerHTML={{ __html: String(readingBlog.blog_content || readingBlog.blog_intro || '<p>No content provided.</p>') }} 
            />
          </article>
        </div>
      )}

      {isPostModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-white relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{isEditing ? "Edit Blog Post" : "Write a New Story"}</h2>
                <p className="text-sm text-slate-500 mt-1.5 font-medium">{isEditing ? "Update your blog post details" : "Share your knowledge with the StrideNex community"}</p>
              </div>
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 bg-slate-50/50 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Blog Title</label>
                <input 
                  type="text" 
                  placeholder="Enter an engaging title..." 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Technology, General" 
                    value={formData.blog_category}
                    onChange={(e) => setFormData({...formData, blog_category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Blogger Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stride" 
                    value={formData.blogger}
                    onChange={(e) => setFormData({...formData, blogger: e.target.value})}
                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all shadow-sm font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Introduction / Content</label>
                <textarea 
                  placeholder="Write a captivating introduction for your blog post..." 
                  value={formData.blog_intro}
                  onChange={(e) => setFormData({...formData, blog_intro: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 transition-all resize-y min-h-[140px] shadow-sm font-medium placeholder:text-slate-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="published"
                  checked={formData.published === 1}
                  onChange={(e) => setFormData({...formData, published: e.target.checked ? 1 : 0})}
                  className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-slate-900 focus:ring-2 cursor-pointer transition-colors"
                />
                <label htmlFor="published" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                  Publish immediately
                </label>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
                {isEditing ? "Save Changes" : "Publish Post"}
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
