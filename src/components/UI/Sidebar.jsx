import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/authcontext";
import { hasPermission } from "../../lib/permissions";
import MobileMenu from "./MobileMenu";
import BottomNavBar from "./BottomNavBar";
import { API_BASE_URL } from "../../lib/api";
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
  const location = useLocation();
  const { IsLoggedIn = false, user = null, handelLogout = () => {}, loading = false } = useAuth() || {};
  const [canAddBlog, setCanAddBlog] = useState(false);
  const [IsChatOpen, setIsChatOpen] = useState(false);
  // Don't render until auth context is loaded
  if (loading) {
    return null;
  }

  // Check if user can add blog
  useEffect(() => {
    const checkAddBlogPermission = async () => {
      // Only check if user is logged in and has a role
      if (!IsLoggedIn || !user?.role) {
        setCanAddBlog(false);
        return;
      }

      try {
        const canAdd = await hasPermission(user.role, 'addBlog');
        setCanAddBlog(canAdd);
      } catch (error) {
        console.error('Error checking add blog permission:', error);
        setCanAddBlog(false);
      }
    };

    checkAddBlogPermission();
  }, [IsLoggedIn, user]);

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
        className={`flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-white/10 ${isActive(to)}`}
      >
        <div className="text-white text-xl">
          <Icon />
        </div>
        <span className="text-white">{label}</span>
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
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-800 to-blue-950 backdrop-blur-md border-r border-white/10 z-40 transition-all duration-300 transform -translate-x-full md:translate-x-0">
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
            <NavLink to={`/Account/${user?._id}`} icon={FiUser} label="Profile" condition={IsLoggedIn} />
            <NavLink to="/dashboard" icon={FiSettings} label="Dashboard" condition={IsLoggedIn && (user?.role === "ADMIN" || user?.role === "APPROVER")} />
            <NavLink to="/Signup" icon={FiLogIn} label="Sign Up" condition={!IsLoggedIn} />
          </nav>

          {/* User info at bottom */}
          {IsLoggedIn && user && (
            <div className="border-t border-white/10 pt-4 mt-auto">
              <Link to={`/Account/${user?._id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                  {user.profileImgUrl ? (
                    <img src={`${user.profileImgUrl}`} alt={user.fullname} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/image.png'; }} />
                  ) : (
                    <span className="text-white text-sm">{user.fullname?.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="text-white font-medium">{user.fullname}</div>
                  <div className="text-white/60 text-xs">{user.role}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay is now handled by MobileMenu component */}

      {/* Content padding for desktop */}
      <div className="md:pl-64 transition-all duration-300">
        {/* This is just a spacer div to push content to the right on desktop */}
      </div>
    </>
  );
};

export default Sidebar;