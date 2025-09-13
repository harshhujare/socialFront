import React, { useEffect, useMemo, useState } from 'react';
import api, { API_BASE_URL } from '../lib/api';

const statusColor = (isActive) => (isActive ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30' : 'text-rose-300 bg-rose-500/10 border-rose-400/30');

const Users = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async (q = '') => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/user/list`, { params: { q } });
      setUsers(Array.isArray(res.data?.users) ? res.data.users : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (
      (u.fullname || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    ));
  }, [users, query]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold">Users</h1>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search users by name or email"
              className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-blue-200"
            />
            <button onClick={() => fetchUsers(query)} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Search</button>
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 text-blue-200 text-sm border-b border-white/10">
            <div className="col-span-5">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1 text-right">Status</div>
          </div>

          {loading ? (
            <div className="p-6 text-center text-white">Loading users...</div>
          ) : error ? (
            <div className="p-6 text-center text-rose-300">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-blue-200">No users found.</div>
          ) : (
            <ul>
              {filtered.map(u => (
                <li key={u._id} className="grid grid-cols-12 gap-4 items-center p-4 border-t border-white/10">
                  <div className="col-span-5 flex items-center gap-3">
                    <img
                      src={u.profileImgUrl ? `${API_BASE_URL}${u.profileImgUrl}` : '/assets/image.png'}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                      alt={u.fullname}
                      onError={(e) => { e.currentTarget.src = '/assets/image.png'; }}
                    />
                    <div className="text-white">
                      <div className="font-semibold">{u.fullname}</div>
                      <div className="text-xs text-blue-200">Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</div>
                    </div>
                  </div>
                  <div className="col-span-4 text-blue-100">{u.email}</div>
                  <div className="col-span-2">
                    <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-blue-100 text-xs">{u.role}</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <span className={`px-2 py-1 rounded-lg border text-xs ${statusColor(u.isActive)}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;


