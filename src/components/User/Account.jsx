import React, { useState, useEffect, useRef } from "react";
import api, { API_BASE_URL } from "../../lib/api.js";
import { useAuth } from "../../../context/authcontext.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { FaPen, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { followUser, UnfollowUser } from "../../lib/utilAip.js";
import AccountSkeleton from "../UI/Skeletons/AccountSkeleton.jsx";
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import BackButton from '../buttons/BackButton.jsx';
import Blogcard from "../UI/Blogcard.jsx";
import { useTheme } from "../../context/themecontext.jsx";
import ThemeSettings from "../UI/ThemeSettings.jsx";
export default function AccountPage() {
  const { theme } = useTheme();
  const { id } = useParams();
  const { user, handelLogout } = useAuth();
  const navigate = useNavigate();
  // ✅ userid + anotheruser derived directly
  const userid = id && id !== user?._id ? id : user?._id;
  const anotheruser = id && id !== user?._id;
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [following, setfollowing] = useState(false);
  const [nName, setnName] = useState("");
  const [formData, setFormData] = useState({ email: "" });
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("/assets/image.png");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Blogs
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [followLoading, setFollowLoading] = useState(false);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fileInputRef = useRef(null);

  // Fetch user info
  useEffect(() => {
    if (!userid) return; // don’t run until ready
    if (!anotheruser) {
      checkLogin();
    }
    handelgetuser(userid);
  }, [userid]);

  // Fetch blogs
  useEffect(() => {
    if (userid) {
      fetchUserBlogs();
    }
  }, [userid]);

  // Handle initial loading state
  useEffect(() => {
    if (userid && !loadingProfile && !loadingBlogs) {
      // Add a small delay to better demonstrate the skeleton
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userid, loadingProfile, loadingBlogs]);

  const checkLogin = async () => {
    try {
      const res = await api.get("/auth/check");
      setnName(res.data.user.fullname);
      setFormData({ email: res.data.user.email });
    } catch (error) {
      console.log(error);
    }
  };
  //get user info
  const handelgetuser = async (userid) => {
    setLoadingProfile(true);
    try {
      const res = await api.get(`/user/getuser/${userid}`);
      // console.log("this is clevar", res.data.user);
      setnName(res.data.user.fullname);
      setfollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
      setFollowingCount(res.data.followingCount);
      setProfileImagePreview(
        res.data.user.profileImgUrl
          ? `${res.data.user.profileImgUrl}`
          : "/assets/image.png"
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUserBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await api.get(`/blog/user/${userid}`);
      // console.log("these are itsms", response.data.blogs);
      if (response.data.success) {
        setUserBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log("Error fetching user blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setDeletingBlog(blogId);
      try {
        const response = await api.delete(`/blog/delete/${blogId}`);
        if (response.data.success) {
          setUserBlogs((prevBlogs) =>
            prevBlogs.filter((blog) => blog._id !== blogId)
          );
        }
      } catch (error) {
        console.log("Error deleting blog:", error);
      } finally {
        setDeletingBlog(null);
      }
    }
  };

  const handelsave = async () => {
    setSaving(true);
    try {
      // Update user info
      await api.put("/user/update", {
        fullname: nName,
        email: formData.email,
      });

      // Upload profile image if new file selected
      if (profileImage) {
        const formdata = new FormData();
        formdata.append("image", profileImage);
        await api.put(`/profile/upload/${userid}`, formdata);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setnName(e.target.value);
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const handelfollow = async (id) => {
    try {
      setFollowLoading(true);
      const res = await followUser(id);
      // refresh counts / status
      await handelgetuser(userid);
      
      setfollowing(true);
    } catch (err) {
      console.error('Follow failed', err);
    } finally {
      setFollowLoading(false);
    }

  };
  const unhandelfollow = async (id) => {
    try {
      setFollowLoading(true);
      const res = await UnfollowUser(id);
      await handelgetuser(userid);
      setfollowing(false);
    } catch (err) {
      console.error('Unfollow failed', err);
    } finally {
      setFollowLoading(false);
    }
  };
  // Show skeleton while loading
  if (initialLoading) {
    return <AccountSkeleton />;
  }

  return (
    <>
      <div className="min-h-screen w-full pt-0 pb-10 flex justify-center px-4 relative overflow-hidden from-[#141416] via-[#252528] to-[#222425] ">
        {/* Ambient light effects */}

        <div
          className={`fixed top-0 left-0 w-96 h-96 ${theme.colors.ambientPurple} opacity-30 rounded-full blur-3xl animate-pulse -z-10`}
          style={{ filter: "blur(120px)", left: "-10%", top: "-10%" }}
        ></div>
        <div
          className={`fixed bottom-0 right-0 w-96 h-96 ${theme.colors.ambientBlue} opacity-30 rounded-full blur-3xl animate-pulse -z-10`}
          style={{ filter: "blur(120px)", right: "-10%", bottom: "-10%" }}
        ></div>

        <div className="w-full max-w-5xl">
          <div className="w-full flex justify-end pt-4 mb-2">
            <ThemeSettings />
          </div>

          {/* Profile Header Section */}
          <div
            className="rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in mb-8"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
            }}
          >
             {isMobile&& <BackButton/>}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
              {/* Profile Image Section */}
              <div className="relative group">
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg object-cover"
                  style={{
                    boxShadow:
                      "0 0 0 6px rgba(46,142,255,0.25), 0 8px 32px 0 rgba(31,38,135,0.37)",
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                {!anotheruser && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full shadow-lg opacity-90 hover:opacity-100 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <FaPlus size={16} />
                  </button>
                )}
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  {loadingProfile ? (
                    <div className="h-8 bg-white/20 rounded-lg animate-pulse w-48 mx-auto md:mx-0"></div>
                  ) : (
                    <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
                      {nName}
                    </h2>
                  )}
                  <div className="flex gap-3">
                    {!anotheruser ? (
                      <>
                        <button
                          onClick={handelsave}
                          disabled={saving}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          onClick={handelLogout}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        {following ? (
                          <button
                           onClick={() => unhandelfollow(userid)}
                            disabled={followLoading}
                            className={`px-6 py-2 rounded-lg bg-gradient-to-r from-[#ff4d4d] to-[#ff4d4d] text-white font-semibold text-sm shadow-lg transition-all duration-200 ${followLoading ? 'opacity-70 cursor-wait scale-100' : 'hover:scale-105'}`}
                          >
                            {followLoading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Unfollowing</span>
                              </div>
                            ) : (
                              'Unfollow'
                            )}
                          </button>
                        ) : (
                          <button
                           onClick={() => handelfollow(userid)}
                            disabled={followLoading}
                            className={`px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm shadow-lg transition-all duration-200 ${followLoading ? 'opacity-70 cursor-wait scale-100' : 'hover:scale-105'}`}
                          >
                            {followLoading ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Following</span>
                              </div>
                            ) : (
                              'Follow'
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => console.log("Message clicked")}
                          className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                        >
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Primary Stats Section (Instagram-like) */}
                <div className="flex items-center gap-8 mb-8 border-b border-white/10 pb-6">
                  <div className="text-center">
                    {loadingProfile ? (
                      <>
                        <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                        <div className="h-4 bg-white/15 rounded animate-pulse w-12 mx-auto"></div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-white mb-1">
                          {userBlogs.length}
                        </div>
                        <div className="text-blue-200 text-sm font-medium tracking-wide">posts</div>
                      </>
                    )}
                  </div>
                  <button 
                    className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {/* TODO: Show followers modal */}}
                  >
                    {loadingProfile ? (
                      <>
                        <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                        <div className="h-4 bg-white/15 rounded animate-pulse w-16 mx-auto"></div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-white mb-1">
                          {followersCount}
                        </div>
                        <div className="text-blue-200 text-sm font-medium tracking-wide">followers</div>
                      </>
                    )}
                  </button>
                  <button 
                    className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {/* TODO: Show following modal */}}
                  >
                    {loadingProfile ? (
                      <>
                        <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                        <div className="h-4 bg-white/15 rounded animate-pulse w-16 mx-auto"></div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-white mb-1">
                          {followingCount}
                        </div>
                        <div className="text-blue-200 text-sm font-medium tracking-wide">following</div>
                      </>
                    )}
                  </button>
                </div>

                {/* Engagement Stats Section */}
                <div className="flex items-center gap-4 mb-4 px-2">
                  {loadingProfile ? (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                        <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                      </div>
                      <div className="w-px h-4 bg-white/10"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                        <div className="h-4 bg-white/20 rounded animate-pulse w-24"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.828l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                        <div className="text-sm">
                          <span className="font-bold text-white">
                            {userBlogs.reduce(
                              (total, blog) =>
                                total +
                                (Array.isArray(blog.likedBy)
                                  ? blog.likedBy.length
                                  : 0),
                              0
                            )}
                          </span>
                          <span className="text-blue-200 ml-1">total likes</span>
                        </div>
                      </div>
                      <div className="w-px h-4 bg-white/10"></div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <div className="text-sm">
                          <span className="font-bold text-white">
                            {userBlogs.reduce(
                              (total, blog) =>
                                total +
                                (Array.isArray(blog.comments)
                                  ? blog.comments.length
                                  : 0),
                              0
                            )}
                          </span>
                          <span className="text-blue-200 ml-1">total comments</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {loadingProfile ? (
                  <div className="h-6 bg-white/20 rounded animate-pulse w-64 mx-auto md:mx-0 mb-2"></div>
                ) : (
                  <p className="text-lg text-blue-100 font-mono tracking-wide mb-2">
                    {formData.email}
                  </p>
                )}

                {/* Dashboard access moved to sidebar for consistency */}
              </div>
            </div>

            {!anotheruser && user && (
              <form
                onSubmit={handleSubmit}
                className="w-full mt-6"
                autoComplete="off"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-200 font-semibold text-sm ml-1">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={nName}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-xl bg-white/30 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/50 transition shadow-inner backdrop-blur-md"
                      placeholder="Enter your name"
                      spellCheck={false}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-200 font-semibold text-sm ml-1">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-5 py-3 rounded-xl bg-white/20 text-blue-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/40 transition shadow-inner backdrop-blur-md cursor-not-allowed"
                      placeholder="Email"
                      spellCheck={false}
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Blog Grid Section */}
          <div
            className="rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in"
            style={{
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">
                {`${nName}'s`} Posts
              </h2>
              {!anotheruser && (
                <button
                  onClick={() => navigate("/add")}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Create New Post
                </button>
              )}
            </div>

            {/* Blog Grid */}
            <div className="w-full">
              {loadingBlogs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="group bg-white/10 rounded-xl border border-white/20 backdrop-blur-md overflow-hidden"
                    >
                      {/* Blog Image Skeleton */}
                      <div className="relative h-48 overflow-hidden">
                        <div className="w-full h-full bg-white/20 animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {/* Action buttons skeleton */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                          <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Blog Content Skeleton */}
                      <div className="p-4">
                        <div className="h-6 bg-white/20 rounded animate-pulse w-3/4 mb-2"></div>
                        <div className="h-4 bg-white/15 rounded animate-pulse w-full mb-1"></div>
                        <div className="h-4 bg-white/15 rounded animate-pulse w-2/3 mb-3"></div>
                        
                        <div className="flex items-center justify-between">
                          <div className="h-3 bg-white/15 rounded animate-pulse w-20"></div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                              <div className="h-3 bg-white/15 rounded animate-pulse w-4"></div>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                              <div className="h-3 bg-white/15 rounded animate-pulse w-4"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userBlogs.length === 0 ? (
                <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-6xl mb-4">📝</div>
                  <div className="text-xl font-semibold text-white mb-2">
                    No posts yet
                  </div>
                  <div className="text-blue-200 mb-6">
                    Share your thoughts with the world!
                  </div>
                  {!anotheruser && (
                    <button
                      onClick={() => navigate("/add")}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 transition-all duration-200"
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              ) : (
                
                <Blogcard userBlogs={userBlogs} anotheruser={anotheruser} setUserBlogs={setUserBlogs} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}