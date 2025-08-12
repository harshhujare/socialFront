import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../lib/api';
import { useAuth } from '../../context/authcontext';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, IsLoggedIn } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [commentMessage, setCommentMessage] = useState(null); // success/info
  const [commentError, setCommentError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);

  const normalizeId = (value) => {
    try {
      if (value == null) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value.toString) return value.toString();
      return String(value);
    } catch (_) {
      return String(value);
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/blog/getblog/${id}`);
        const b = res.data.blog;
        setBlog(b);
        const likedBy = Array.isArray(b?.likedBy) ? b.likedBy : [];
        setLikesCount(likedBy.length);
        setLiked(IsLoggedIn && likedBy.some(uid => String(uid) === String(user?._id)));
        setComments(Array.isArray(b?.comments) ? b.comments : []);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.response?.data?.message || 'Failed to load blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, IsLoggedIn, user?._id]);

  // Reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.summary || blog?.summery || blog?.description?.substring(0, 100),
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleCopyContent = async () => {
    if (!blog) return;
    const contentParts = [
      blog.title || '',
      (blog.summary || blog.summery) ? `${blog.summary || blog.summery}` : '',
      blog.description || ''
    ];
    const textToCopy = contentParts.filter(Boolean).join('\n\n');
    try {
      setCopying(true);
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content', err);
    } finally {
      setCopying(false);
    }
  };

  const isOwner = useMemo(() => {
    if (!blog || !user) return false;
    return String(blog.userid) === String(user._id);
  }, [blog, user]);

  const handleToggleLike = async () => {
    if (!IsLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      setLiking(true);
      const res = await api.post(
        `/blog/${id}/like`,
        {}
      );
      if (res.data?.success) {
        setLiked(res.data.liked);
        setLikesCount(res.data.likes ?? (res.data.liked ? likesCount + 1 : Math.max(0, likesCount - 1)));
      }
    } catch (err) {
      console.error('Failed to toggle like', err);
    } finally {
      setLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!IsLoggedIn) {
      navigate('/login');
      return;
    }
    const text = newComment.trim();
    if (!text) return;
    try {
      setPostingComment(true);
      const res = await api.post(
        `/blog/${id}/comments`,
        { text }
      );
      if (res.data?.success) {
        setComments(res.data.comments || []);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentMessage(null);
    setCommentError(null);
    if (!IsLoggedIn) {
      setCommentError('Please log in to delete comments.');
      navigate('/login');
      return;
    }
    const prevComments = comments;
    try {
      setDeletingCommentId(commentId);
      // Optimistic update
      setComments((prev) => prev.filter((c) => normalizeId(c._id) !== normalizeId(commentId)));
      const res = await api.delete(
        `/blog/${id}/comments/${commentId}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (res.data?.success) {
        // Use authoritative server state if provided
        if (Array.isArray(res.data.comments)) {
          setComments(res.data.comments);
        } else {
          // Ensure the optimistic state persists
          setComments((prev) => prev.filter((c) => normalizeId(c._id) !== normalizeId(commentId)));
        }
        setCommentMessage('Comment deleted.');
        setTimeout(() => setCommentMessage(null), 2000);
      } else {
        setComments(prevComments);
        setCommentError(res.data?.message || 'Failed to delete comment.');
      }
    } catch (err) {
      // Revert optimistic update
      setComments(prevComments);
      const status = err?.response?.status;
      if (status === 401) setCommentError('Not authorized. Please log in.');
      else if (status === 403) setCommentError('You can only delete your own comment or comments on your blog.');
      else if (status === 404) setCommentError('Comment or blog not found.');
      else setCommentError('Something went wrong deleting the comment.');
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] px-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-lg">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] px-4">
        <div className="max-w-md w-full bg-gray-900/20 border border-gray-500/30 rounded-2xl p-8 text-center backdrop-blur-lg">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Blog Post Not Found</h2>
          <p className="text-gray-300 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBackClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Author avatar (initials)
  const initials = blog.createdby ? blog.createdby.split(' ').map(n => n[0]).join('').toUpperCase() : 'A';
  const avatarColor = stringToColor(blog.createdby || 'A');

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all backdrop-blur-md border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-lg overflow-hidden">
            {/* Blog Image */}
            <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
              {/* Loading skeleton */}
              {imageLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
              )}
              
              <img
                src={blog.titalimg ? `${API_BASE_URL}${blog.titalimg}` : '/assets/image.png'}
                alt={blog.title}
                className={`object-cover w-full h-full transition-opacity duration-500 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              
              {/* Fallback for image error */}
              {imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p>Image not available</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#23234b] via-transparent to-transparent opacity-60" />
            </div>

            {/* Blog Content */}
            <div className="p-6 md:p-8 lg:p-10">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 text-center leading-tight">
                {blog.title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border-2 border-white/30 transition-transform hover:scale-110"
                  style={{ background: avatarColor, color: '#fff' }}
                  title={blog.createdby}
                >
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-blue-200 font-semibold text-lg">{blog.createdby || 'Anonymous'}</span>
                  {blog.date && (
                    <span className="text-sm text-gray-300">{formatDate(blog.date)}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              {(blog.summary || blog.summery) && (
                <div className="mb-8 p-6 bg-blue-900/30 rounded-2xl border border-blue-400/20">
                  <h2 className="text-xl font-semibold text-blue-200 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Summary
                  </h2>
                  <p className="text-white/90 leading-relaxed text-lg">{blog.summary || blog.summery}</p>
                </div>
              )}

              {/* Main Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                <div className="text-lg text-white/90 leading-relaxed whitespace-pre-line">
                  {blog.description}
                </div>
              </div>

              {/* Footer - Reactions */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleLike}
                      disabled={liking}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${liked ? 'bg-pink-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'} `}
                      title={IsLoggedIn ? (liked ? 'Unlike' : 'Like') : 'Login to like'}
                    >
                      <svg className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.828l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span className="font-semibold">{likesCount}</span>
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyContent}
                      disabled={copying}
                      className={`flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-full transition-all ${copied ? 'ring-2 ring-green-400/60' : ''}`}
                      title={copied ? 'Copied!' : 'Copy content'}
                      aria-label="Copy content"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {copied ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2h-2M6 7a2 2 0 012-2h7a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" />
                        )}
                      </svg>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </button>
                    <button
                      onClick={handleBackClick}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Blogs
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-white mb-4">Comments ({comments?.length || 0})</h3>
                {commentMessage && (
                  <div className="mb-3 text-green-300 bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2 text-sm">
                    {commentMessage}
                  </div>
                )}
                {commentError && (
                  <div className="mb-3 text-red-300 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2 text-sm">
                    {commentError}
                  </div>
                )}
                {/* New comment */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={IsLoggedIn ? 'Write a comment...' : 'Login to write a comment'}
                      disabled={!IsLoggedIn || postingComment}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
                    />
                    <button
                      type="submit"
                      disabled={!IsLoggedIn || postingComment || !newComment.trim()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl"
                    >
                      {postingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>

                {/* Comments list */}
                <div className="space-y-4">
                  {(comments || []).map((c) => {
                    const canDelete = IsLoggedIn && (String(c.userId) === String(user?._id) || isOwner);
                    return (
                      <div key={c._id || c.createdAt} className="bg-white/10 border border-white/20 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-blue-200 font-semibold">{c.userName || 'User'}</div>
                            <div className="text-white/90 mt-1">{c.text}</div>
                            <div className="text-xs text-blue-300 mt-2">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                          </div>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(normalizeId(c._id))}
                              disabled={normalizeId(deletingCommentId) === normalizeId(c._id)}
                              className="text-red-300 hover:text-red-400 text-sm disabled:opacity-50"
                              title="Delete comment"
                            >
                              {deletingCommentId === c._id ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail; 