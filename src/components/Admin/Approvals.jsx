import React, { useEffect, useState } from 'react'
import api, { API_BASE_URL } from '../../lib/api'

export const Approvals = ({ embedded }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [approvingId, setApprovingId] = useState(null)

  const fetchRejected = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/blog/rejected')
      setBlogs(Array.isArray(res.data?.blogs) ? res.data.blogs : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending blogs')
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id) => {
    try {
      setApprovingId(id)
      await api.put(`/blog/${id}/approve`)
      // remove approved blog from list
      setBlogs(prev => prev.filter(b => b._id !== id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve blog')
    } finally {
      setApprovingId(null)
    }
  }

  useEffect(() => { fetchRejected() }, [])

  return (
    <div className="min-h-screen pt-4 md:pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-bold">Pending Approvals</h1>
        <button
          onClick={fetchRejected}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 text-blue-200 text-sm border-b border-white/10">
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Created By</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-white">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-rose-300">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="p-6 text-center text-blue-200">No pending blogs.</div>
        ) : (
          <ul>
            {blogs.map(b => (
              <li key={b._id} className="grid grid-cols-12 gap-4 items-center p-4 border-t border-white/10">
                <div className="col-span-6 text-white flex items-center gap-3">
                  <img
                    src={b.titalimg ? `${API_BASE_URL}${b.titalimg}` : '/assets/image.png'}
                    className="w-10 h-10 rounded-lg object-cover border border-white/20"
                    alt={b.title}
                    onError={(e) => { e.currentTarget.src = '/assets/image.png' }}
                  />
                  <div>
                    <div className="font-semibold">{b.title}</div>
                    <div className="text-xs text-blue-200">{new Date(b.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="col-span-3 text-blue-100">{b.createdby || 'Unknown'}</div>
                <div className="col-span-2">
                  <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-blue-100 text-xs">{b.AP_Status}</span>
                </div>
                <div className="col-span-1 text-right">
                  <button
                    disabled={approvingId === b._id}
                    onClick={() => approve(b._id)}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 border border-emerald-400/30 disabled:opacity-50"
                  >
                    {approvingId === b._id ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Approvals
