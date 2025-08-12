import React, { useState, useEffect } from 'react'
import api from '../lib/api'
import Card from './card'
import { API_BASE_URL } from '../lib/api';
const ASSET_BASE = API_BASE_URL;

const Hero = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog/getblog", {
        params: { search, page, limit: 9 }
      });
      setBlogs(res.data.blogs || []);
      setPages(res.data?.pagination?.pages || 1);
      setTotal(res.data?.pagination?.total || 0);
    } catch (e) {
      setBlogs([]);
      setPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] relative overflow-hidden flex flex-col">
      {/* Decorative blurred shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl animate-pulse" style={{ filter: "blur(120px)", left: "-10%", top: "-10%" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{ filter: "blur(120px)", right: "-10%", bottom: "-10%" }}></div>
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>
      {/* Hero Header */}
      <header className="w-full max-w-5xl mx-auto pt-16 pb-8 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 drop-shadow mb-4 animate-fade-in">Welcome to MEMEflex</h1>
        <p className="text-xl md:text-2xl text-blue-200/90 mb-6 animate-fade-in-slow">Discover, read, and share amazing MEME from our community.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-slow">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-2 w-full md:w-96">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search blogs..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-blue-200 px-2"
            />
            <button onClick={() => { setPage(1); fetchBlogs(); }} className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full">Search</button>
          </div>
          <a href="/Add" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition-all duration-200">Write a Blog</a>
        </div>
      </header>
      {/* Blog Cards Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center animate-fade-in-slow">
              {blogs.length === 0 ? (
                <div className="col-span-full text-white text-xl mt-12">No blogs found.</div>
              ) : (
                blogs.map((blog, idx) => (
                  <div key={blog._id} style={{ animationDelay: `${idx * 80}ms` }} className="animate-fade-in-up">
                    <Card
                      id={blog._id}
                      title={blog.title}
                       titalimg={`${ASSET_BASE}${blog.titalimg}`}
                      createdby={blog.createdby}
                      summary={blog.summary}
                      likes={Array.isArray(blog.likedBy) ? blog.likedBy.length : 0}
                      comments={Array.isArray(blog.comments) ? blog.comments.length : 0}
                    />
                  </div>
                ))
              )}
            </div>
            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8 text-white">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-white/10 border border-white/20 disabled:opacity-40">Prev</button>
                <span className="opacity-80">Page {page} of {pages} · {total} results</span>
                <button disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="px-3 py-1 rounded bg-white/10 border border-white/20 disabled:opacity-40">Next</button>
              </div>
            )}
          </>
        )}
      </main>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-slow { animation: fadeIn 1.5s cubic-bezier(.4,0,.2,1) both; }
        .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  )
}

export default Hero