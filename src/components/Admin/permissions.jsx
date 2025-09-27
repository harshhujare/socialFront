import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useTheme } from '../../context/themecontext.jsx';

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const roles = ['USER', 'APPROVER', 'ADMIN'];
  const permissionTypes = [
    { key: 'comment', label: 'Comment' },
    { key: 'addBlog', label: 'Add Blog' },
    { key: 'adminPanel', label: 'Admin Panel' },
    { key: 'approverPanel', label: 'Approver Panel' },
    { key: 'userPanel', label: 'User Panel' },
    { key: 'like', label: 'Like' }
  ];

  const initializePermissionsData = () => {
    const def = {};
    roles.forEach(r => {
      def[r] = {};
      permissionTypes.forEach(p => { def[r][p.key] = false; });
    });
    return def;
  };

  const [permissionsData, setPermissionsData] = useState(initializePermissionsData());

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/permissions');
      if (response.data.success) {
        const fetched = response.data.data;
        const next = initializePermissionsData();
        fetched.forEach(rolePerm => {
          if (next[rolePerm.role]) next[rolePerm.role] = rolePerm.permissions;
        });
        setPermissionsData(next);
        setPermissions(fetched);
      }
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setMessage('Error loading permissions');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultPermissions = async () => {
    try {
      setSaving(true);
      const response = await api.post('/permissions/initialize');
      if (response.data.success) {
        setMessage('Default permissions initialized successfully!');
        fetchPermissions();
      }
    } catch (err) {
      console.error('Error initializing permissions:', err);
      setMessage('Error initializing permissions');
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionChange = (role, permission, value) => {
    setPermissionsData(prev => ({
      ...prev,
      [role]: { ...prev[role], [permission]: value }
    }));
  };

  const saveRolePermissions = async (role) => {
    try {
      setSaving(true);
      const response = await api.put(`/permissions/${role}`, { permissions: permissionsData[role] });
      if (response.data.success) {
        setMessage(`${role} permissions updated successfully!`);
        fetchPermissions();
      }
    } catch (err) {
      console.error(`Error updating ${role} permissions:`, err);
      setMessage(`Error updating ${role} permissions`);
    } finally {
      setSaving(false);
    }
  };

  const saveAllPermissions = async () => {
    try {
      setSaving(true);
      const promises = roles.map(role => api.put(`/permissions/${role}`, { permissions: permissionsData[role] }));
      await Promise.all(promises);
      setMessage('All permissions updated successfully!');
      fetchPermissions();
    } catch (err) {
      console.error('Error updating permissions:', err);
      setMessage('Error updating permissions');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { fetchPermissions(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-white/80">Loading permissions...</p>
        </div>
      </div>
    );
  }

  const { theme } = useTheme();

  return (
    <div className="min-h-screen pt-20 w-full relative overflow-hidden transition-colors duration-500">
      {/* Background Effects */}
      <div className={`absolute top-20 left-10 w-72 h-72 ${theme.colors.ambientBlue} rounded-full blur-3xl opacity-30`}></div>
      <div className={`absolute bottom-20 right-10 w-96 h-96 ${theme.colors.ambientPurple} rounded-full blur-3xl opacity-30`}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`backdrop-blur-xl ${theme.colors.cardBorder} border ${theme.colors.cardBg} rounded-3xl shadow-2xl p-8`}
             style={{
               boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 4px 0 rgba(0,0,0,0.10)",
               background: "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)"
             }}>
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Permissions Management</h1>

            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={initializeDefaultPermissions}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {saving ? 'Initializing...' : ' Defaults'}
              </button>
              <button
                onClick={saveAllPermissions}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
              >
                {saving ? 'Saving...' : 'Save All'}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl backdrop-blur-lg border ${
              message.includes('Error') 
                ? 'bg-red-500/20 border-red-500/30 text-red-200' 
                : 'bg-green-500/20 border-green-500/30 text-green-200'
            }`}>
              <div className="flex items-center gap-2">
                {message.includes('Error') ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 001 1V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 011.414 0L9 10.586 7.707 9.293a1 1 0 01.414-1.414l2 2a1 1 0 011.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}

          {/* Permissions Table */}
          <div className={`overflow-x-auto rounded-2xl backdrop-blur-lg ${theme.colors.cardBorder} border ${theme.colors.cardBg}`}>
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
                    Role / Permission
                  </th>
                  {permissionTypes.map(perm => (
                    <th key={perm.key} className="px-6 py-4 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
                      {perm.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {roles.map(role => (
                  <tr key={role} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 shadow-lg ${
                          role === 'ADMIN' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 
                          role === 'APPROVER' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                          'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}></div>
                        <span className="text-white font-semibold">{role}</span>
                      </div>
                    </td>
                    {permissionTypes.map(perm => (
                      <td key={perm.key} className="px-6 py-4 whitespace-nowrap">
                        <label className="flex items-center cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={permissionsData[role]?.[perm.key] || false}
                              onChange={(e) => handlePermissionChange(role, perm.key, e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                              permissionsData[role]?.[perm.key] 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent' 
                                : 'border-white/30 bg-white/10 group-hover:border-white/50'
                            }`}>
                              {permissionsData[role]?.[perm.key] && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </label>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => saveRolePermissions(role)}
                        disabled={saving}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          
        </div>
      </div>
    </div>
  );
};

export default Permissions;