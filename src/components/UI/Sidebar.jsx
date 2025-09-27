import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/authcontext";
import { hasPermission } from "../../lib/permissions";
import MobileMenu from "./MobileMenu";
import BottomNavBar from "./BottomNavBar";
import { API_BASE_URL } from "../../lib/api";
import { useTheme } from "../../context/themecontext.jsx";

import { 
  FiHome, 
  FiSearch, 
  FiPlusSquare, 
  FiMessageCircle, 
  FiUser, 
  FiLogIn,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const Sidebar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { IsLoggedIn = false, user = null, handelLogout = () => {}, loading = false } = useAuth() || {};
  
  const [canAddBlog, setCanAddBlog] = useState(true);
  const [IsChatOpen, setIsChatOpen] = useState(false);
  // Don't render until auth context is loaded
  if (loading) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-600/20" : "";
  };

  const NavLink = ({ to, icon: Icon, label, condition = true }) => {
    if (!condition) return null;
    if(to==="/chat"){
      setIsChatOpen(true);
    }else{
      setIsChatOpen(false);
    }
    return (
      <Link 
        to={to} 
        className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/20 ${isActive(to)}`}
      >
        <div className={`text-xl ${theme.colors.textPrimary}`}>
          <Icon />
        </div>
        <span className={`${theme.colors.textPrimary}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Logo for mobile */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <img src="/assets/logo.png" alt="Logo" className="w-10 h-10" />
      </div>

      {/* Bottom Navigation Bar for mobile */}
      <BottomNavBar />

      {/* Sidebar for desktop */}
      <div className={`fixed left-0 top-0 bottom-0 w-64 backdrop-blur-md ${theme.colors.cardBorder} border-r ${theme.colors.cardBg} z-40 transition-all duration-300 transform -translate-x-full md:translate-x-0`}>
        <div className="flex flex-col h-full p-4">

          {/* Logo */}
          <div className="flex items-center justify-center py-6">
            <img src="/assets/logo.png" alt="Logo" className="w-12 h-12" />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2 mt-6">
            <NavLink to="/" icon={FiHome} label="Home" />
            <NavLink to="/" icon={FiSearch} label="Search" onClick={(e) => {
              e.preventDefault();
              // Focus the search input on the homepage
              const searchInput = document.querySelector('input[placeholder="Search blogs..."]');
              if (searchInput) {
                searchInput.focus();
              } else {
                // If not on homepage, navigate there first
                window.location.href = '/';
              }
            }} />
            <NavLink to="/Add" icon={FiPlusSquare} label="Create Post" condition={canAddBlog} />
            <NavLink to="/chat" icon={FiMessageCircle} label="Messages" condition={IsLoggedIn} />
            <NavLink to="/dashboard" icon={FiSettings} label="Dashboard" condition={IsLoggedIn && (user?.role === "ADMIN" || user?.role === "APPROVER")} />
            <NavLink to="/Signup" icon={FiLogIn} label="Sign Up" condition={!IsLoggedIn} />
          </nav>

          {/* User info at bottom */}
          {IsLoggedIn && user && (
            <div className={`pt-4 mt-auto ${theme.colors.cardBorder} border-t`}>
              <Link to={`/Account/${user?._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/20">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                  {user.profileImgUrl ? (
                    <img src={`${user.profileImgUrl}`} alt={user.fullname} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/image.png'; }} />
                  ) : (
                    <span className={`text-sm ${theme.colors.textPrimary}`}>{user.fullname?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className={`font-medium ${theme.colors.textPrimary}`}>{user.fullname}</div>
                  <div className={`text-xs ${theme.colors.textSecondary}`}>{user.role}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content padding for desktop */}
      <div className="md:pl-64 transition-all duration-300">
        {/* This is just a spacer div to push content to the right on desktop */}
      </div>
    </>
  );
};

export default Sidebar;