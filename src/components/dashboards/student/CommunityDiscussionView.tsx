import React, { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Plus, Folder, Hash, Search, FileText, Send, User, Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import DashboardDynamicModal from "@/components/dashboards/shared/DashboardDynamicModal";
import { createCategory, getPosts, createPost, getPostDetail, postComment, leaveCommunity, apiService } from "@/services/api.services";
interface CommunityDiscussionViewProps {
  community: any;
  onBack: () => void;
  onRefresh?: () => void;
}

const SUGGESTED_CATEGORIES = [
  {
    name: "Academics",
    description: "Discuss classes, courses, exams, share lecture notes and study guides.",
    icon: "📚"
  },
  {
    name: "Placements",
    description: "Discuss job search, internships, interview experiences, resume reviews, and advice.",
    icon: "💼"
  },
  {
    name: "Projects",
    description: "Find project teammates, share progress, post ideas, or collaborate on hackathons.",
    icon: "🚀"
  },
  {
    name: "Coding",
    description: "Talk programming languages, framework updates, algorithms, system design, and dev news.",
    icon: "💻"
  },
  {
    name: "Design",
    description: "Share layouts, logo design, receive UI/UX feedback, and show off design portfolios.",
    icon: "🎨"
  },
  {
    name: "General",
    description: "Get to know peers, discuss campus events, make general announcements, and casual chats.",
    icon: "💬"
  }
];

export default function CommunityDiscussionView({ community, onBack, onRefresh }: CommunityDiscussionViewProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "discussions">("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false);
  const [selectedSuggestedCategory, setSelectedSuggestedCategory] = useState<number | null>(null);
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [customCategoryDescription, setCustomCategoryDescription] = useState("");

  useEffect(() => {
    if (!isCategoryModalOpen) {
      setShowCustomCategoryForm(false);
      setSelectedSuggestedCategory(null);
      setCustomCategoryName("");
      setCustomCategoryDescription("");
    }
  }, [isCategoryModalOpen]);
  
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);
  
  // Category Posts Thread State
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [postDetails, setPostDetails] = useState<any>(null);
  const [isFetchingPostDetails, setIsFetchingPostDetails] = useState(false);

  const [newComment, setNewComment] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { showToast } = useToast();

  const handleCreateCategory = async (formData: Record<string, any>) => {
    try {
      setIsSubmittingCategory(true);
      const response = await createCategory({
        category_name: formData.category_name,
        description: formData.description,
        parent_category: community.id || community.name,
      });
      
      if (response?.message?.success === false || response?.success === false) {
        throw new Error(response?.message?.message || response?.message || "Failed to create category");
      }

      const successMsg = response?.message?.message || response?.message || "Category created successfully!";
      showToast(typeof successMsg === 'string' ? successMsg : "Category created successfully!", "success");
      setIsCategoryModalOpen(false);
      if (onRefresh) {
        onRefresh();
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to create category";
      const finalMsg = typeof errMsg === 'string' ? errMsg : "Failed to create category";
      showToast(finalMsg, "error");
      alert(finalMsg);
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleCreateTag = async (formData: Record<string, any>) => {
    try {
      setIsSubmittingTag(true);
      const response = await apiService.post(
        "method/stridenex_app.stridenex_app.doctype.community.community.create_tag",
        { title: formData.title }
      );
      
      if (response?.message?.success === false || response?.success === false) {
        throw new Error(response?.message?.message || response?.message || "Failed to create tag");
      }

      const successMsg = response?.message?.message || response?.message || "Tag created successfully!";
      showToast(typeof successMsg === 'string' ? successMsg : "Tag created successfully!", "success");
      setIsTagModalOpen(false);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to create tag";
      const finalMsg = typeof errMsg === 'string' ? errMsg : "Failed to create tag";
      showToast(finalMsg, "error");
      alert(finalMsg);
    } finally {
      setIsSubmittingTag(false);
    }
  };

  const fetchPosts = async (catName: string) => {
    try {
      setIsFetchingPosts(true);
      const response = await getPosts({
        community: community.id || community.name,
        category: catName
      });
      if (response?.message?.data) {
        setPosts(response.message.data);
      } else if (response?.data) {
        setPosts(response.data);
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to fetch posts";
      showToast(typeof errMsg === 'string' ? errMsg : "Failed to fetch posts", "error");
    } finally {
      setIsFetchingPosts(false);
    }
  };

  const handlePostClick = async (post: any) => {
    setSelectedPost(post);
    setIsFetchingPostDetails(true);
    setPostDetails(null);
    setNewComment("");
    setReplyingToCommentId("");
    try {
      const response = await getPostDetail({ post: post.name });
      if (response?.message?.data) {
        setPostDetails(response.message.data);
      } else if (response?.data?.data) {
        setPostDetails(response.data.data);
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch post details", "error");
    } finally {
      setIsFetchingPostDetails(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      showToast("Comment cannot be empty", "error");
      return;
    }
    try {
      setIsSubmittingComment(true);
      const studentEmail = typeof window !== 'undefined' ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      
      const response = await postComment({
        post: selectedPost.name,
        comment: newComment,
        parent_comment: replyingToCommentId,
        student: studentEmail
      });

      if (response?.message?.success === false || response?.success === false) {
        throw new Error(response?.message?.message || response?.message || "Failed to post comment");
      }

      const successMsg = response?.message?.message || response?.data?.message || "Comment posted successfully!";
      showToast(typeof successMsg === 'string' ? successMsg : "Comment posted successfully!", "success");
      
      setNewComment("");
      setReplyingToCommentId("");
      
      // Refresh post details
      const detailResponse = await getPostDetail({ post: selectedPost.name });
      if (detailResponse?.message?.data) {
        setPostDetails(detailResponse.message.data);
      } else if (detailResponse?.data?.data) {
        setPostDetails(detailResponse.data.data);
      }
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to post comment";
      showToast(typeof errMsg === 'string' ? errMsg : "Failed to post comment", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchPosts(selectedCategory.category_name || selectedCategory.name);
    }
  }, [selectedCategory]);

  const handleLeaveCommunity = async () => {
    try {
      const email = typeof window !== "undefined" ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      
      const response = await apiService.post(
        "method/stridenex_app.stridenex_app.doctype.community.community.leave_community",
        {
          community: community.id,
          student: email
        }
      );

      if (response?.message?.success === false) {
        throw new Error(response.message.message || "Failed to leave space");
      }

      onBack();
    } catch (err: any) {
      console.error("Error leaving community:", err);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      showToast("Post content cannot be empty", "error");
      return;
    }
    try {
      setIsSubmittingPost(true);
      const studentEmail = typeof window !== 'undefined' ? (localStorage.getItem("currentUser") || localStorage.getItem("userEmail") || "") : "";
      if (!studentEmail) {
        showToast("User not found. Please log in again.", "error");
        setIsSubmittingPost(false);
        return;
      }

      const response = await createPost({
        community: community.id,
        user: studentEmail,
        content: newPostContent,
        post_type: "Text",
        category: selectedCategory.category_name || selectedCategory.name
      });
      
      if (response?.message?.success === false || response?.success === false) {
        throw new Error(response?.message?.message || response?.message || "Failed to create post");
      }

      const successMsg = response?.message?.message || response?.data?.message || "Post created successfully!";
      showToast(typeof successMsg === 'string' ? successMsg : "Post created successfully!", "success");
      setNewPostContent("");
      // Refresh posts
      fetchPosts(selectedCategory.category_name || selectedCategory.name);
    } catch (error: any) {
      const errMsg = error?.response?.data?.message?.message || error?.response?.data?.message || error.message || "Failed to create post";
      const finalMsg = typeof errMsg === 'string' ? errMsg : "Failed to create post";
      showToast(finalMsg, "error");
      alert(finalMsg);
    } finally {
      setIsSubmittingPost(false);
    }
  };



  const categories = community?.categories || [];
  const tags = community?.tags || [];

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (selectedPost) {
                setSelectedPost(null);
                setPostDetails(null);
              } else if (selectedCategory) {
                setSelectedCategory(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <h1 className="text-sm font-bold text-slate-800 max-w-[200px] sm:max-w-md truncate">
              {community.community_name || community.name} Space
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-blue-50 border border-blue-100 text-blue-600 uppercase">
              {community.community_type || 'Public'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleLeaveCommunity}
            variant="outline"
            className="border-red-200 hover:border-red-500 bg-white hover:bg-red-50 text-red-600 font-bold text-xs md:text-sm py-2 px-4 transition-all active:scale-[0.98]"
          >
            Leave Space
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col hidden md:flex overflow-y-auto">
          {/* Navigation */}
          <div className="p-4">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Navigation</h3>
            <div className="space-y-1">
              <button 
                onClick={() => setActiveTab("categories")}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "categories" ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Folder className={`w-4 h-4 ${activeTab === "categories" ? "text-blue-500" : ""}`} />
                Categories
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Categories</h3>
            </div>
            <div className="space-y-1">
              {categories.length > 0 ? (
                categories.map((cat: any, idx: number) => (
                  <button key={idx} className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left" onClick={() => setSelectedCategory(cat)}>
                    <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
                    <span className="truncate">{cat.category_name || cat.name}</span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-400 px-3">No categories defined.</p>
              )}
            </div>
          </div>

          {/* Tags List */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Tags</h3>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">▼</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag: any, idx: number) => (
                  <span key={idx} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-md text-[10px] font-semibold border border-slate-200 cursor-pointer hover:text-slate-900 hover:bg-slate-100 transition-colors">
                    #{tag.title || tag.name}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 px-3">No tags found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
          {selectedPost ? (
            <div className="flex-1 flex flex-col h-full bg-slate-50">
              <div className="p-6 flex-1 overflow-y-auto">
                {isFetchingPostDetails ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                  </div>
                ) : postDetails ? (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Post Content */}
                    <div className="flex gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base text-slate-800">{postDetails.author}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(postDetails.posted_on).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-base text-slate-600 whitespace-pre-wrap mt-2">{postDetails.content}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 py-4 border-y border-slate-200">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <svg className="w-5 h-5" fill={postDetails.is_liked ? "#FF6B00" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                        </svg>
                        <span>{postDetails.like_count} Likes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <MessageSquare className="w-5 h-5" />
                        <span>{postDetails.comment_count} Comments</span>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                      <h3 className="text-base font-bold text-slate-800 mb-4">Comments</h3>
                      {postDetails.comments && postDetails.comments.length > 0 ? (
                        <div className="space-y-4">
                          {postDetails.comments.map((comment: any, idx: number) => (
                            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="font-bold text-sm text-slate-800">{comment.comment_by || comment.student || "Anonymous"}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(comment.posted_on || comment.creation).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{comment.content}</p>
                              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                                <button className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors group">
                                  <Heart className={`w-3.5 h-3.5 group-hover:text-[#FF6B00] transition-colors ${comment.is_liked ? 'text-[#FF6B00] fill-[#FF6B00]' : ''}`} />
                                  <span>{comment.like_count || 0} Likes</span>
                                </button>
                                <button 
                                  onClick={() => setReplyingToCommentId(comment.name)}
                                  className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors group"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 group-hover:text-[#FF6B00] transition-colors" />
                                  <span>Reply</span>
                                </button>
                              </div>
                              
                              {/* Display Replies */}
                              {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-4">
                                  {comment.replies.map((reply: any, rIdx: number) => (
                                    <div key={rIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-xs text-slate-800">{reply.comment_by || reply.student || "Anonymous"}</span>
                                        <span className="text-[10px] text-slate-400">
                                          {new Date(reply.posted_on || reply.creation).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-600">{reply.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No comments yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-400">Failed to load post details.</div>
                )}
              </div>
              
              {/* Sticky Comment Input Panel */}
              {postDetails && !isFetchingPostDetails && (
                <div className="p-4 border-t border-slate-200 bg-white shadow-lg">
                  <div className="max-w-4xl mx-auto w-full">
                    {replyingToCommentId && (
                      <div className="flex justify-between items-center bg-slate-100 px-3 py-2 rounded-lg text-xs text-slate-500 mb-2 border border-slate-200">
                        <span>Replying to comment...</span>
                        <button onClick={() => setReplyingToCommentId("")} className="text-[#FF6B00] hover:text-[#FF6B00]/80 font-semibold">Cancel</button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder={`Post something in ${selectedCategory?.category_name || selectedCategory?.name || 'this post'}...`}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newComment.trim() && !isSubmittingComment) {
                            handlePostComment();
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#FF6B00] transition-all"
                      />
                      <button
                        onClick={handlePostComment}
                        disabled={isSubmittingComment || !newComment.trim()}
                        className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold py-3 px-6 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmittingComment ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : selectedCategory ? (
            <div className="flex flex-col h-full bg-slate-50">
              {/* Category Header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 bg-white shadow-sm">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </button>
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <Folder className="w-5 h-5 text-blue-500" />
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{selectedCategory.category_name || selectedCategory.name}</h2>
                  </div>
                </div>
              </div>

              {/* Thread Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isFetchingPosts ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post: any, idx: number) => (
                    <div 
                      key={idx} 
                      className="bg-white border border-slate-200/65 rounded-xl p-5 flex gap-4 cursor-pointer hover:border-[#FF6B00]/50 shadow-sm hover:shadow-md transition-all duration-200"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-800">{post.author || post.user || "User"}</span>
                          <span className="text-xs text-slate-400">
                            {new Date(post.posted_on || post.creation || Date.now()).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap mb-3 leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                          <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                            <svg className="w-4 h-4" fill={post.is_liked ? "#FF6B00" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                            <span>{post.like_count || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comment_count || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 border border-dashed border-slate-200 bg-white rounded-xl shadow-sm">
                    <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No posts yet</h3>
                    <p className="text-sm text-slate-500">Be the first to start the discussion in this category!</p>
                  </div>
                )}
              </div>

              {/* Create Post Input */}
              <div className="p-4 border-t border-slate-200 bg-white shadow-lg">
                <div className="w-full flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-[#FF6B00] transition-all h-[48px]">
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={`Post something in ${selectedCategory.category_name || selectedCategory.name}...`}
                      className="w-full h-full bg-transparent text-sm text-slate-800 px-4 py-3 focus:outline-none resize-none placeholder:text-slate-400"
                    />
                  </div>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={isSubmittingPost || !newPostContent.trim()}
                    className="h-[48px] px-6 bg-[#FF6B00] hover:bg-[#E66000] text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    {isSubmittingPost ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Post</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl w-full mx-auto p-6 md:p-8">
              {/* Header / Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
                  Welcome to {community.community_name || community.name} discussions!
                </h2>
                <div className="flex items-start justify-between gap-6">
                  <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                    {community.description || "A central space to collaborate, find support, ask technical questions, and share resources with fellow members."}
                  </p>
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search discussions..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Sub Nav */}
              <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
                <button 
                  onClick={() => setActiveTab("categories")}
                  className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
                    activeTab === "categories" ? "text-[#FF6B00] border-[#FF6B00]" : "text-slate-500 border-transparent hover:text-slate-800"
                  }`}
                >
                  Categories
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "categories" && (
                <div className="space-y-4">
                  {categories.length > 0 ? (
                    categories.map((cat: any, idx: number) => (
                      <div key={idx} onClick={() => setSelectedCategory(cat)} className="flex flex-col md:flex-row md:items-stretch bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:border-[#FF6B00]/50 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                        {/* Left Side: Category Info */}
                        <div className="flex-1 p-5 md:border-r border-slate-200/85">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-sm bg-blue-500 group-hover:bg-[#FF6B00] transition-colors"></div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#FF6B00] transition-colors">{cat.category_name || cat.name}</h3>
                          </div>
                          <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                            {cat.description || `Discussions related to ${cat.category_name || cat.name}.`}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-medium text-slate-650 border border-slate-100">Introductions</span>
                            <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-medium text-slate-650 border border-slate-100">News</span>
                          </div>
                        </div>
                        
                        {/* Middle: Stats */}
                        <div className="hidden md:flex flex-col items-center justify-center p-5 min-w-[120px] md:border-r border-slate-200/85">
                          <span className="text-lg font-bold text-slate-800">0 / month</span>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Topics</span>
                        </div>

                        {/* Right Side: Latest Topics */}
                        <div className="flex-1 p-5 hidden lg:flex flex-col justify-center space-y-3">
                          <div className="flex items-center justify-between group">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-xs font-semibold text-slate-600 group-hover:text-[#FF6B00] truncate">Welcome to the category!</span>
                            </div>
                            <span className="text-[10px] text-slate-400 flex-shrink-0 ml-4">1d</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <Folder className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <h3 className="text-sm font-semibold text-slate-800 mb-1">No categories yet</h3>
                      <p className="text-xs text-slate-500">This community doesn&apos;t have any categories defined.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <DashboardDynamicModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Category"
        fields={[]}
        onSubmit={async () => {}}
        hideFooter={true}
        headerIcon={Folder}
      >
        <div className="space-y-6">
          {!showCustomCategoryForm ? (
            <>
              <div>
                <p className="text-sm text-slate-500 mb-4">
                  Select a suggested category style to quickly set up your channel discussion, or create a completely custom one:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[360px] overflow-y-auto pr-1">
                  {SUGGESTED_CATEGORIES.map((suggested, index) => {
                    const isSelected = selectedSuggestedCategory === index;
                    return (
                      <button
                        key={suggested.name}
                        onClick={() => setSelectedSuggestedCategory(index)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 focus:outline-none flex gap-3 ${
                          isSelected
                            ? "border-[#FF6B00] bg-orange-50/40 shadow-sm"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <span className="text-2xl mt-0.5 shrink-0 select-none">
                          {suggested.icon}
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            {suggested.name}
                            {isSelected && (
                              <span className="inline-block w-2 h-2 rounded-full bg-[#FF6B00]" />
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 leading-normal">
                            {suggested.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
                <div className="flex-1" />
                <button
                  onClick={() => setShowCustomCategoryForm(true)}
                  className="w-full sm:w-auto px-4 py-2 border border-[#FF6B00] hover:bg-orange-50/50 text-[#FF6B00] rounded-xl text-xs font-semibold transition-all active:scale-95 text-center"
                >
                  Create Custom Category
                </button>
                <button
                  disabled={selectedSuggestedCategory === null || isSubmittingCategory}
                  onClick={async () => {
                    if (selectedSuggestedCategory === null) return;
                    const cat = SUGGESTED_CATEGORIES[selectedSuggestedCategory];
                    await handleCreateCategory({
                      category_name: cat.name,
                      description: cat.description
                    });
                  }}
                  className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center ${
                    selectedSuggestedCategory === null
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95"
                  }`}
                >
                  {isSubmittingCategory ? "Creating..." : "Create Suggested Category"}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-slate-500 mb-4">
                  Enter a unique name and description for your custom discussion category:
                </p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      placeholder="e.g., Marketing, General Q&A"
                      className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={customCategoryDescription}
                      onChange={(e) => setCustomCategoryDescription(e.target.value)}
                      placeholder="Explain what members should discuss in this category..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#FF6B00] focus:border-[#FF6B00] resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowCustomCategoryForm(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-all active:scale-95 text-center"
                >
                  Back to Suggestions
                </button>
                <div className="flex-1" />
                <button
                  disabled={!customCategoryName.trim() || !customCategoryDescription.trim() || isSubmittingCategory}
                  onClick={async () => {
                    await handleCreateCategory({
                      category_name: customCategoryName.trim(),
                      description: customCategoryDescription.trim()
                    });
                  }}
                  className={`w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center ${
                    !customCategoryName.trim() || !customCategoryDescription.trim()
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#FF6B00] hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95"
                  }`}
                >
                  {isSubmittingCategory ? "Creating..." : "Create Category"}
                </button>
              </div>
            </>
          )}
        </div>
      </DashboardDynamicModal>

      <DashboardDynamicModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Create Tag"
        fields={[
          {
            name: "title",
            label: "Tag Title",
            type: "text",
            required: true,
            placeholder: "e.g., React, Help, Bug",
            colSpan: 2
          }
        ]}
        onSubmit={handleCreateTag}
        loading={isSubmittingTag}
        headerIcon={Hash}
        submitText="Create Tag"
      />

    </div>
  );
}
