import React,{useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import api, { API_BASE_URL } from "../../lib/api.js";
import { FaPen, FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { useAuth } from "../../context/authcontext.jsx";
const Blogcard = ({ userBlogs , anotheruser , setUserBlogs }) => {
//      const { user, handelLogout } = useAuth();
//       const { id } = useParams();
//       const userid = id && id !== user?._id ? id : user?._id;
//   const anotheruser = id && id !== user?._id;
const navigate = useNavigate();
  console.log(anotheruser, "anotheruser");
    const [deletingBlog, setDeletingBlog] = useState(null);

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userBlogs.map((blog) => (


<div key={blog._id} class="relative inline-block p-3 bg-gray-900   before:content-[''] before:absolute before:top-0 before:left-[10%] 
     before:w-[80%] before:border-t-1 before:border-teal-100 ">
  <div
    class="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-teal-100"
  ></div>
  <div class="absolute top-[10%] left-0 h-[80%] border-l-1 border-teal-100"></div>
  <div
    class="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-teal-100"
  ></div>
  <div
    class="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-teal-100"
  ></div>
    <div class="absolute bottom-[10%] right-0 h-[80%] border-r-1 border-teal-100"></div>
  <div
    class="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-teal-100"
  ></div>
   <div class="absolute bottom-0 left-[10%] w-[80%] border-b-1 border-teal-100"></div>

 <div
                          key={blog._id}
                          className="group bg-white/10   backdrop-blur-md overflow-hidden hover:bg-white/15 transition-all duration-300"
                        >
                          {/* Blog Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                blog.titalimg
                                  ? `${blog.titalimg}`
                                  : "/assets/image.png"
                              }
                              alt={blog.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            {/* Action buttons */}
                            {!anotheruser && (
                              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={() => navigate(`/blog/${blog._id}`)}
                                  className="p-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                                  title="View Blog"
                                >
                                  <FaEye size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  disabled={deletingBlog === blog._id}
                                  className="p-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                  title="Delete Blog"
                                >
                                  {deletingBlog === blog._id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <FaTrash size={16} />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          {/* Blog Content */}
                          <div className="p-4">
                            <h4 className="text-white font-semibold text-lg mb-2 line-clamp-1">
                              {blog.title}
                            </h4>
                            <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                              {blog.summary || blog.description.substring(0, 100)}
                              ...
                            </p>
                            <div className="flex items-center justify-between text-xs text-blue-300">
                              <span>
                                {new Date(
                                  blog.createdAt || Date.now()
                                ).toLocaleDateString()}
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.828l-6.828-6.829a4 4 0 010-5.656z" />
                                  </svg>
                                  {Array.isArray(blog.likedBy)
                                    ? blog.likedBy.length
                                    : 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                  </svg>
                                  {Array.isArray(blog.comments)
                                    ? blog.comments.length
                                    : 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
 
</div>

                      ))}
                    </div>
  )
}

export default Blogcard