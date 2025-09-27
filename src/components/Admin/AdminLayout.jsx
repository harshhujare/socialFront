import React from 'react';
import { useTheme } from '../../context/themecontext.jsx';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authcontext';
import MobileMenu from '../UI/MobileMenu';
import {
  FiHome,
  FiTable,
  FiCreditCard,
  FiUser,
  FiUsers,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

const AdminLayout = ({ children, embedded = false }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const { user, handelLogout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600/20 text-white' : 'hover:bg-white/10 text-blue-100';
  };

  // If this component is embedded in another component, only render the children
  if (embedded) {
    return <>{children}</>;
  }
  return (
    <div className={`min-h-screen w-full pt-16 flex items-start justify-center flex-col px-4 bg-gradient-to-br ${theme.colors.primary} relative overflow-hidden transition-colors duration-500`}>
      {/* Mobile Menu */}
      <MobileMenu>
        <div className="flex flex-col h-full">
          {/* Admin Header */}
          <div className="py-6 text-center border-b border-white/10 mb-6">
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-blue-200/80 text-sm">{user?.role || 'Admin'}</p>
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-6 text-sm flex-1">
            <div>
              <div className="text-blue-200/80 mb-2 uppercase tracking-wide">Pages</div>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard')}`}>
                    <FiHome /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/approvals" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/approvals')}`}>
                    <FiTable /> Approvals
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/permissions" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/permissions')}`}>
                    <FiCreditCard /> Permissions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-blue-200/80 mb-2 uppercase tracking-wide">Account</div>
              <ul className="space-y-1">
                {user?.role === "ADMIN" && (
                  <li>
                    <Link to="/dashboard/users" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/users')}`}>
                      <FiUsers /> Users
                    </Link>
                  </li>
                )}
                <li>
                  <Link to={`/Account/${user?._id}`} className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100`}>
                    <FiUser /> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100`}>
                    <FiHome /> Main Site
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handelLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </MobileMenu>

      {/* Admin Sidebar */}
      <aside className="fixed top-0 right-0 bottom-0 w-64 p-4 overflow-y-auto bg-white/5 border-l border-white/10 z-40 transition-all duration-300 transform md:translate-x-0 translate-x-full md:translate-x-0">
        <div className="flex flex-col h-full">
          {/* Admin Header */}
          <div className="py-6 text-center border-b border-white/10 mb-6">
            <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
            <p className="text-blue-200/80 text-sm">{user?.role || 'Admin'}</p>
          </div>

          {/* Admin Navigation */}
          <nav className="space-y-6 text-sm flex-1">
            <div>
              <div className="text-blue-200/80 mb-2 uppercase tracking-wide">Pages</div>
              <ul className="space-y-1">
                <li>
                  <Link to="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard')}`}>
                    <FiHome /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/approvals" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/approvals')}`}>
                    <FiTable /> Approvals
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/permissions" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/permissions')}`}>
                    <FiCreditCard /> Permissions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-blue-200/80 mb-2 uppercase tracking-wide">Account</div>
              <ul className="space-y-1">
                {user?.role === "ADMIN" && (
                  <li>
                    <Link to="/dashboard/users" className={`flex items-center gap-3 px-3 py-2 rounded-xl ${isActive('/dashboard/users')}`}>
                      <FiUsers /> Users
                    </Link>
                  </li>
                )}
                <li>
                  <Link to={`/Account/${user?._id}`} className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100`}>
                    <FiUser /> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100`}>
                    <FiHome /> Main Site
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handelLogout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 text-blue-100"
                  >
                    <FiLogOut /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          {/* User info at bottom */}
          {user && (
            <div className="border-t border-white/10 pt-4 mt-auto">
              <Link to={`/Account/${user?._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                  {user.profileImgUrl ? (
                    <img src={user.profileImgUrl} alt={user.fullname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm">{user.fullname?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{user.fullname}</div>
                  <div className="text-white/60 text-xs">{user.email}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </aside>

  {/* Mobile overlay handled inside MobileMenu component */}

      {/* Main content */}
      <main className="w-full md:pr-64 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;