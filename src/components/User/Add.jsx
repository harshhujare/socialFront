import React, { useState, useEffect } from "react";
import api from "../../lib/api";
import { useAuth } from "../../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "../../lib/permissions";
import { useMediaQuery } from '../../hooks/useMediaQuery';
import BackButton from "../buttons/BackButton";
import { useTheme } from '../../context/themecontext.jsx';
const Add = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
    const isMobile = useMediaQuery('(max-width: 768px)');
  
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const userid = user?._id;
  const fullname = user?.fullname;
  const navigate = useNavigate();
  const [hasAddBlogPermission, setHasAddBlogPermission] = useState(false);
  const [permissionLoading, setPermissionLoading] = useState(true);
  const { theme } = useTheme(); 

  // Check if user has permission to add blog
  useEffect(() => {
    const checkPermission = async () => {
      if (!user?.role) {
        setHasAddBlogPermission(false);
        setPermissionLoading(false);
        return;
      }

      try {
        const canAddBlog = await hasPermission(user.role, 'addBlog');
        setHasAddBlogPermission(canAddBlog);
        
        if (!canAddBlog) {
          setError("You don't have permission to add blogs");
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasAddBlogPermission(false);
        setError("Error checking permissions");
      } finally {
        setPermissionLoading(false);
      }
    };

    checkPermission();
  }, [user?.role, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // File type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file?.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    // File size validation (e.g., 5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file?.size > maxSize) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setError(""); // Clear any previous errors

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        setError("Error reading file");
        setImagePreview(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setError("");
    setIsUploading(true);
    setUploadProgress(0);

    // Check if required fields are filled
    if (!title || !description  || !summary) {
      setError("Please fill all required fields");
      setIsUploading(false);
      return;
    }

    const formdata = new FormData();
    formdata.append("blogimg", image);
    formdata.append("userid", userid);
    formdata.append("description", description);
    formdata.append("title", title);
    formdata.append("summary", summary);
    formdata.append("createdby", fullname);

    try {
      setTimeout(() =>  5000);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
     
      const res = await api.post(
        "/blog/upload",
        formdata,
        {
          signal: controller.signal,
          onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
            setUploadProgress(percentCompleted);
          },
        }
      );

      clearTimeout(timeoutId);

      if (res.data.success) {
        navigate("/");
      } else {
        setError("Failed to create blog. Please try again.");
      }
    } catch (err) {
      console.log(err);
      if (err.name === "AbortError") {
        setError(
          "Upload timed out. Please try again with a smaller image or check your connection."
        );
      } else if (err.response?.status === 401) {
        setError("Please login to add a blog");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to add blogs");
      } else if (err.response?.status === 400) {
        setError("Invalid data. Please check your input.");
      } else { 
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Show loading while checking permissions
  if (permissionLoading) {
    return (
      <div className="min-h-screen  w-full flex items-center justify-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-200">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no permission
  if (!hasAddBlogPermission) {
    return (
      <div className="min-h-screen pt-20 w-full flex items-center justify-center px-4 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-blue-200 mb-4">You don't have permission to add blogs.</p>
          {error && <p className="text-red-300 mb-4">{error}</p>}
          <p className="text-blue-300">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen  w-full flex items-center justify-center px-4 bg-gradient-to-br ${theme.colors.primary} relative overflow-hidden`}>
   
      <div className="w-full max-w-lg p-0">
                    {isMobile&& <BackButton/>}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in gap-8"
          style={{
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(0,0,0,0.10)",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
          }}
        >
            
          {/* Ima ge Upload */}
          <div className="flex flex-col items-center w-full gap-2">
            <label className="text-blue-200 font-semibold text-sm mb-1">
              Upload Image
            </label>
            <div className="w-32 h-32 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-dashed border-blue-400 mb-2 overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-blue-300 text-xs">No image selected</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-blue-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Title */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-blue-200 font-semibold text-sm ml-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-white/30 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/50 transition shadow-inner backdrop-blur-md"
              placeholder="Enter a title"
              required
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="text-blue-200 font-semibold text-sm ml-1">
              Summary
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-white/30 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/50 transition shadow-inner backdrop-blur-md"
              placeholder="A breaf summary"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col w-full gap-2">
            <label className="text-blue-200 font-semibold text-sm ml-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-white/30 text-white placeholder:text-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/50 transition shadow-inner backdrop-blur-md min-h-[100px] resize-none"
              placeholder="Write your description here..."
              required
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          {isUploading && (
            <div className="w-full">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-blue-200 text-sm text-center mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg 
    ${
      !isUploading
        ? "hover:scale-105 hover:from-blue-600 hover:to-purple-600"
        : "opacity-50 cursor-not-allowed"
    } 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 mt-2`}
          >
            {isUploading ? "Uploading..." : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;
