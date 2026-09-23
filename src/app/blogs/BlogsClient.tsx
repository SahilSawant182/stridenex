"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, Share2, Copy, Linkedin, Facebook, X as CloseIcon, MessageCircle, Mail, Send, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface Blog {
  name: string;
  title: string;
  blog_category: string;
  blogger: string;
  blog_intro?: string;
  meta_description?: string;
  meta_image?: string;
  content_md?: string;
  content_html?: string;
  read_time?: number;
  published?: number;
  creation: string;
  [key: string]: unknown;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, "") || 'https://devstridenex.quantcloud.in';

export default function BlogsPage() {
  const [readingBlog, setReadingBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBlogs();
    
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const blogId = params.get("id");
      if (!blogId) {
        setReadingBlog(null);
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
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
        
        // Auto-open blog if ID is in URL
        const params = new URLSearchParams(window.location.search);
        const blogId = params.get("id");
        if (blogId) {
          const blogToOpen = fetchedBlogs.find((b: Blog) => b.name === blogId);
          if (blogToOpen) {
            setReadingBlog(blogToOpen);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openBlog = (blog: Blog) => {
    setReadingBlog(blog);
    window.history.pushState({}, "", `/blogs?id=${blog.name}`);
  };

  const closeBlog = () => {
    setReadingBlog(null);
    window.history.pushState({}, "", `/blogs`);
  };

  const handleShare = () => {
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      // Use native share on mobile devices if available
      navigator.share({
        title: readingBlog?.title,
        text: readingBlog?.blog_intro || readingBlog?.meta_description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      if (typeof window !== 'undefined' && window.ClipboardItem) {
        const textBlob = new Blob([url], { type: 'text/plain' });
        const htmlBlob = new Blob([`<a href="${url}">${url}</a>`], { type: 'text/html' });
        const item = new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch (e) {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {!readingBlog ? (
        <>
          <section className="bg-white pb-6 pt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-[28px] font-medium text-slate-900 tracking-normal mb-8">
                Blog
              </h1>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {loading ? (
              <div className="text-center py-20 text-slate-500 font-medium text-sm">Loading blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="bg-slate-50 rounded-lg p-16 text-center border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                <p className="text-slate-500 text-sm">Check back later for new content.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {blogs.map((blog) => (
                  <article 
                    key={blog.name} 
                    onClick={() => openBlog(blog)}
                    className="group flex flex-col h-full cursor-pointer"
                  >
                    <div className="w-full aspect-[1.6] bg-white rounded-xl mb-4 overflow-hidden flex items-center justify-center relative transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-slate-100 shadow-sm">
                      {blog.meta_image ? (
                        <img 
                          src={blog.meta_image.startsWith('http') ? blog.meta_image : `${BASE_URL}${blog.meta_image}`}
                          alt={blog.title}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-slate-500 font-medium text-[15px] leading-snug line-clamp-3 p-6 text-center">
                          {blog.title}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        {blog.blog_category || "EVENTS"}
                      </div>
                      
                      <h3 className="text-[17px] font-semibold text-slate-900 mb-2.5 group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug">
                        {blog.title}
                      </h3>
                      
                      <p className="text-[14px] text-slate-600 mb-5 line-clamp-3 flex-1 leading-relaxed">
                        {blog.blog_intro || blog.meta_description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-[9px] shrink-0">
                             {blog.blogger?.[0]?.toUpperCase() || "A"}
                           </div>
                           <div className="flex flex-row items-center gap-1.5">
                             <span className="text-[13px] font-medium text-blue-500">{blog.blogger || "Admin"}</span>
                             <span className="text-[13px] text-slate-400">
                               {new Date(blog.creation.replace(" ", "T")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · 2 min read
                             </span>
                           </div>
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
        <div className="w-full bg-white min-h-screen animate-in fade-in duration-300 font-sans">
          <div className="w-full max-w-[760px] mx-auto py-6 px-4 sm:px-6 flex items-center justify-between">
            <button 
              onClick={closeBlog}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          <article className="w-full max-w-[760px] mx-auto pt-4 pb-20 px-4 sm:px-6">
            <div className="mb-8 text-left">
              <div className="flex items-center gap-2 text-blue-500 text-[13px] mb-5 font-medium">
                 <span className="hover:underline cursor-pointer">Blog</span>
                 <span className="text-slate-300 font-normal">/</span>
                 <span className="hover:underline cursor-pointer">{readingBlog.blog_category || "Events"}</span>
              </div>
              
              <h1 className="text-[34px] sm:text-[40px] font-bold text-slate-900 mb-5 leading-[1.2] tracking-tight">
                {readingBlog.title}
              </h1>
              
              <p className="text-[16px] sm:text-[17px] text-slate-700 mb-5 leading-relaxed">
                {readingBlog.blog_intro || readingBlog.meta_description}
              </p>
              
              <p className="text-[13px] text-slate-500">
                {new Date(readingBlog.creation.replace(" ", "T")).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {readingBlog.read_time || 2} min read
              </p>
            </div>

            {readingBlog.meta_image && (
              <div className="w-full aspect-[21/9] sm:aspect-[2/1] rounded-2xl overflow-hidden mb-10 bg-white border border-slate-100 shadow-sm">
                <img 
                  src={readingBlog.meta_image.startsWith('http') ? readingBlog.meta_image : `${BASE_URL}${readingBlog.meta_image}`}
                  alt={readingBlog.title}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            )}

            <hr className="border-slate-100 my-8" />

            {readingBlog.content_md ? (
              <div className="prose prose-slate prose-blue max-w-none prose-headings:font-bold prose-h1:text-[28px] sm:prose-h1:text-[32px] prose-h2:text-[24px] sm:prose-h2:text-[28px] prose-p:text-[16px] sm:prose-p:text-[17px] leading-[1.75] text-slate-800 space-y-6 break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {readingBlog.content_md.replace(/\\n/g, '\n')}
                </ReactMarkdown>
              </div>
            ) : (
              <div 
                className="prose prose-slate max-w-none text-[15px] sm:text-[16px] leading-[1.7] text-slate-800 space-y-6 break-words"
                dangerouslySetInnerHTML={{ __html: String(readingBlog.content_html || readingBlog.content || readingBlog.blog_intro || readingBlog.meta_description || '<p>No content provided.</p>') }} 
              />
            )}
          </article>
          
          {showShareModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Share this article</h3>
                  <button onClick={() => setShowShareModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    <a 
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-[#0a66c2] hover:bg-[#0a66c2]/5 transition-colors group"
                    >
                      <Linkedin className="w-6 h-6 text-[#0a66c2] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-slate-600">LinkedIn</span>
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(readingBlog?.title || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-black hover:bg-black/5 transition-colors group"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-black group-hover:scale-110 transition-transform"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                      <span className="text-[11px] font-medium text-slate-600">X</span>
                    </a>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-[#1877F2] hover:bg-[#1877F2]/5 transition-colors group"
                    >
                      <Facebook className="w-6 h-6 text-[#1877F2] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-slate-600">Facebook</span>
                    </a>
                    <a 
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(readingBlog?.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-colors group"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 fill-[#25D366] group-hover:scale-110 transition-transform"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      <span className="text-[11px] font-medium text-slate-600">WhatsApp</span>
                    </a>
                    <a 
                      href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(readingBlog?.title || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-[#229ED9] hover:bg-[#229ED9]/5 transition-colors group"
                    >
                      <Send className="w-6 h-6 text-[#229ED9] group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-slate-600">Telegram</span>
                    </a>
                    <a 
                      href={`mailto:?subject=${encodeURIComponent(readingBlog?.title || '')}&body=${encodeURIComponent('Check out this article: ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl border border-slate-100 hover:border-slate-800 hover:bg-slate-50 transition-colors group"
                    >
                      <Mail className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] font-medium text-slate-600">Email</span>
                    </a>
                  </div>
                  <div className="relative pt-2 border-t border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-2">Or copy link</p>
                    <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                      <input 
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? window.location.href : ''}
                        className="flex-1 bg-transparent text-[13px] text-slate-600 outline-none px-2 truncate"
                      />
                      <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded shadow-sm border transition-colors shrink-0 ${copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
