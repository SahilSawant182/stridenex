import React, { useState, useEffect } from "react";
import { ArrowLeft, MessageSquare, Plus, Folder, Hash, Search, FileText, Send, User, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import DashboardDynamicModal from "@/components/dashboards/shared/DashboardDynamicModal";
import { createCategory, getPosts, createPost, getPostDetail, postComment, leaveCommunity, apiService } from "@/services/api.services";
interface SharedCommunityDiscussionViewProps {
  community: any;
  onBack: () => void;
  onRefresh?: () => void;
}

export default function SharedCommunityDiscussionView({ community, onBack, onRefresh }: SharedCommunityDiscussionViewProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "discussions" | "members">("categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  
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
      if (onRefresh) {
        onRefresh();
      }
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
    <div className="flex flex-col h-screen w-full bg-[#0E0F10] text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2023] bg-[#121315]">
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
              <Plus className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" onClick={() => setIsCategoryModalOpen(true)} />
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
                <Plus className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white" onClick={() => setIsTagModalOpen(true)} />
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0E0F10] relative">
          {selectedPost ? (
            <div className="flex-1 flex flex-col h-full bg-[#0E0F10]">
              <div className="p-6 flex-1 overflow-y-auto">
                {isFetchingPostDetails ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B00]"></div>
                  </div>
                ) : postDetails ? (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Post Content */}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-base text-white">{postDetails.author}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(postDetails.posted_on).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-base text-slate-300 whitespace-pre-wrap mt-2">{postDetails.content}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 py-4 border-y border-[#1F2023]">
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
                      <h3 className="text-base font-bold text-white mb-4">Comments</h3>
                      {postDetails.comments && postDetails.comments.length > 0 ? (
                        <div className="space-y-4">
                          {postDetails.comments.map((comment: any, idx: number) => (
                            <div key={idx} className="bg-[#121315] p-5 rounded-xl border border-[#1F2023]">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="font-bold text-sm text-white">{comment.comment_by || comment.student || "Anonymous"}</span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(comment.posted_on || comment.creation).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-300 mb-3">{comment.content}</p>
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
                                <div className="mt-4 pl-4 border-l-2 border-[#1F2023] space-y-4">
                                  {comment.replies.map((reply: any, rIdx: number) => (
                                    <div key={rIdx} className="bg-[#1F2023]/50 p-4 rounded-xl">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="font-bold text-xs text-white">{reply.comment_by || reply.student || "Anonymous"}</span>
                                        <span className="text-[10px] text-slate-500">
                                          {new Date(reply.posted_on || reply.creation).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-300">{reply.content}</p>
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
                <div className="p-4 border-t border-[#1F2023] bg-[#121315]">
                  <div className="max-w-4xl mx-auto w-full">
                    {replyingToCommentId && (
                      <div className="flex justify-between items-center bg-[#1F2023] px-3 py-2 rounded-lg text-xs text-slate-400 mb-2">
                        <span>Replying to comment...</span>
                        <button onClick={() => setReplyingToCommentId("")} className="text-[#FF6B00] hover:text-[#FF6B00]/80">Cancel</button>
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
                        className="flex-1 bg-[#0E0F10] border border-[#1F2023] rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
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
            <div className="flex flex-col h-full bg-[#0E0F10]">
              {/* Category Header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-[#1F2023] bg-[#121315]">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Categories
                </button>
                <div className="flex items-center gap-3 border-l border-[#1F2023] pl-4">
                  <Folder className="w-5 h-5 text-blue-500" />
                  <div>
                    <h2 className="text-lg font-bold text-white leading-tight">{selectedCategory.category_name || selectedCategory.name}</h2>
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
                      className="bg-[#121315] border border-[#1F2023] rounded-xl p-4 flex gap-4 cursor-pointer hover:border-[#FF6B00]/50 transition-colors"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-white">{post.author || post.user || "User"}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(post.posted_on || post.creation || Date.now()).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 whitespace-pre-wrap mb-3">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                          <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill={post.is_liked ? "#FF6B00" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                            </svg>
                            <span>{post.like_count || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comment_count || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-12 border border-dashed border-[#1F2023] rounded-xl">
                    <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No posts yet</h3>
                    <p className="text-sm text-slate-400">Be the first to start the discussion in this category!</p>
                  </div>
                )}
              </div>

              {/* Create Post Input */}
              <div className="p-4 border-t border-[#1F2023] bg-[#121315]">
                <div className="w-full flex items-center gap-3">
                  <div className="flex-1 bg-[#0E0F10] border border-[#1F2023] rounded-xl overflow-hidden focus-within:border-[#FF6B00] transition-colors h-[48px]">
                    <textarea 
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder={`Post something in ${selectedCategory.category_name || selectedCategory.name}...`}
                      className="w-full h-full bg-transparent text-sm text-white px-4 py-3 focus:outline-none resize-none"
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
                      <div key={idx} onClick={() => setSelectedCategory(cat)} className="flex flex-col md:flex-row md:items-stretch bg-[#121315] border border-[#1F2023] rounded-xl overflow-hidden hover:border-[#FF6B00]/50 transition-colors cursor-pointer group">
                        {/* Left Side: Category Info */}
                        <div className="flex-1 p-5 md:border-r border-[#1F2023]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 rounded-sm bg-blue-500 group-hover:bg-[#FF6B00] transition-colors"></div>
                            <h3 className="text-lg font-bold text-white group-hover:text-[#FF6B00] transition-colors">{cat.category_name || cat.name}</h3>
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
          )}
        </div>
      </div>

      <DashboardDynamicModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Category"
        fields={[
          {
            name: "category_name",
            label: "Category Name",
            type: "text",
            required: true,
            placeholder: "e.g., Technology",
            colSpan: 2
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            required: true,
            placeholder: "Category description",
            colSpan: 2
          }
        ]}
        onSubmit={handleCreateCategory}
        loading={isSubmittingCategory}
        headerIcon={Folder}
        submitText="Create Category"
      />

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
