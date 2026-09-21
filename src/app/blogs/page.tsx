"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
                    onClick={() => setReadingBlog(blog)}
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
              onClick={() => setReadingBlog(null)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
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
              <div className="prose prose-slate max-w-none text-[15px] sm:text-[16px] leading-[1.7] text-slate-800 space-y-6 break-words">
                <ReactMarkdown>
                  {readingBlog.content_md}
                </ReactMarkdown>
              </div>
            ) : (
              <div 
                className="prose prose-slate max-w-none text-[15px] sm:text-[16px] leading-[1.7] text-slate-800 space-y-6 break-words"
                dangerouslySetInnerHTML={{ __html: String(readingBlog.content_html || readingBlog.content || readingBlog.blog_intro || readingBlog.meta_description || '<p>No content provided.</p>') }} 
              />
            )}
          </article>
        </div>
      )}
    </div>
  );
}
