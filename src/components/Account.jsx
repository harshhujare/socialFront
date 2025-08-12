import React, { useState, useEffect, useRef } from "react";
import api, { API_BASE_URL } from "../lib/api";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { FaPen, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import Dashboard from "./Dashboard";
export default function AccountPage() {
  const { SetIsLoggedIn, user,handelLogout } = useAuth();
  const userid = user?._id;
  const navigate = useNavigate();
  const [nName, setneName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [id, setid] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] =
    useState("./assets/image.png");
  
  // Blog dashboard state
  const [userBlogs, setUserBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    checkLogin();
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    if (userid) {
      fetchUserBlogs();
    }
  }, [userid]);

  const checkLogin = async () => {
    try {
      const res = await api.get("/auth/check");
      const name = res.data.user.fullname;
      const email = res.data.user.email;
      const id = res.data.user._id;

      setFormData({ name, email });
      handelgetuser(email);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch user blogs
  const fetchUserBlogs = async () => {
    setLoadingBlogs(true);
    try {
      const response = await api.get(`/blog/user/${userid}`);
      if (response.data.success) {
        setUserBlogs(response.data.blogs);
      }
    } catch (error) {
      console.log("Error fetching user blogs:", error);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Delete blog
  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      setDeletingBlog(blogId);
      try {
        const response = await api.delete(`/blog/delete/${blogId}`);
        if (response.data.success) {
          // Remove the deleted blog from state
          setUserBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
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
      await api.put(
        "/user/update",
        {
          fullname: nName,
          email: formData.email,
        },
        { }
      );

      // Only upload image if a new file is selected
      if (profileImage) {
        const formdata = new FormData();
        formdata.append("image", profileImage);

        await api.put(
          `/profile/upload/${userid}`,
          formdata
        );
      }
    } catch (err) {
      console.log(err);
      // Optionally show error message here
    } finally {
      setSaving(false);
    }
  };
  // handelLogout();
  // const handelLogout = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:8000/user/logout", {
  //       withCredentials: true,
  //     });
  //     if (res.data.success) {
  //       SetIsLoggedIn(false);
  //       navigate("/");
  //     }
  //   } catch (err) {
  //     console.log("error is error", err);
  //   }
  // };

  const handleChange = (e) => {
    setneName(e.target.value);
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

  const handelgetuser = async (email) => {
    try {
      const newuser = await api.get("/user/getuser", {
        params: { email },
      });
      setneName(newuser.data.user.fullname);
     
      setProfileImagePreview(`${API_BASE_URL}${newuser.data.user.profileImgUrl}`);
      // 
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 
  };

  return (
    <>
    <div className="min-h-screen w-full pt-20 flex items-center justify-center flex-col px-4 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] relative overflow-hidden">
      {/* Gls */}
      <div
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl animate-pulse -z-10"
        style={{ filter: "blur(120px)", left: "-10%", top: "-10%" }}
      ></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse -z-10"
        style={{ filter: "blur(120px)", right: "-10%", bottom: "-10%" }}
      ></div>
      <div className="w-full max-w-xl p-0">
        <div
          className="rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(0,0,0,0.10)",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
          }}
        >
          {/* Profile Image with Update Option */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                style={{
                  boxShadow:
                    "0 0 0 6px rgba(46,142,255,0.25), 0 8px 32px 0 rgba(31,38,135,0.37)",
                }}
              />
              {/* Update Profile Image Button */}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfileImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold opacity-90 hover:opacity-100 transition-all duration-200 group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ fontSize: "0.75rem" }}
              >
                <FaPlus />
              </button>
            </div>

            <h2 className="text-3xl font-extrabold text-white mt-6 tracking-tight drop-shadow-lg">
              {nName || formData.name}
            </h2>
            <p className="text-lg text-blue-100 mt-1 font-mono tracking-wide">
              {formData.email}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-6 mt-2"
            autoComplete="off"
          >
            <div className="flex flex-col gap-2">
              <label className="text-blue-200 font-semibold text-sm ml-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={nName}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-2xl bg-white/30 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/50 transition shadow-inner backdrop-blur-md"
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
                className="w-full px-5 py-3 rounded-2xl bg-white/20 text-blue-100 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/40 transition shadow-inner backdrop-blur-md cursor-not-allowed"
                placeholder="Email"
                spellCheck={false}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={handelsave}
                disabled={saving}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handelLogout}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
                Log Out
              </button>
            </div>
          { user.role==="Admin"&& <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#1643d9] to-pink-500 text-white font-bold shadow-lg hover:scale-105 hover:from-red-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
              >
               Go to Admin DashBoard
              </button>}
          </form>
        </div>
        
        {/* Blog Dashboard */}
        <div
          className="mt-8 rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(0,0,0,0.10)",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
          }}
        >
          <h2 className="text-3xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Blog Dashboard
          </h2>
          
          {/* Blog Stats */}
          <div className="w-full mb-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {loadingBlogs ? "..." : userBlogs.length}
                </div>
                <div className="text-blue-200 font-semibold">
                  {userBlogs.length === 1 ? "Blog Posted" : "Blogs Posted"}
                </div>
              </div>
            </div>
          </div>

          {/* Blog List */}
          <div className="w-full">
            {loadingBlogs ? (
              <div className="text-center text-blue-200">Loading blogs...</div>
            ) : userBlogs.length === 0 ? (
              <div className="text-center text-blue-200 py-8">
                <div className="text-2xl mb-2">📝</div>
                <div className="text-lg font-semibold">No blogs yet</div>
                <div className="text-sm opacity-75">Start writing your first blog!</div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Your Blogs</h3>
                {userBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-1">
                          {blog.title}
                        </h4>
                        <p className="text-blue-200 text-sm mb-2 line-clamp-2">
                          {blog.summary || blog.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-4 text-xs text-blue-300">
                          <span>Created: {new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                          <span>Likes: {Array.isArray(blog.likedBy) ? blog.likedBy.length : 0}</span>
                          <span>Comments: {Array.isArray(blog.comments) ? blog.comments.length : 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/blog/${blog._id}`)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-all duration-200 hover:scale-105"
                          title="View Blog"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          disabled={deletingBlog === blog._id}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                          title="Delete Blog"
                        >
                          {deletingBlog === blog._id ? (
                            <div className="w-4 h-4 border-2 border-red-200 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaTrash size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  
    </div>
    </>
  );
}
