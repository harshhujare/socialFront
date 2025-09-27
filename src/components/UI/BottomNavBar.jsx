import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authcontext';
import { hasPermission } from '../../lib/permissions';
import { useTheme } from '../../context/themecontext';
import { 
  FiHome, 
  FiSearch, 
  FiPlusSquare, 
  FiMessageCircle, 
  FiUser, 
  FiSettings,
  FiLogIn
} from 'react-icons/fi';

const BottomNavBar = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const { IsLoggedIn = false, user = null } = useAuth() || {};
  const [canAddBlog, setCanAddBlog] = React.useState(false);

  // Check if user can add blog
  React.useEffect(() => {
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
    return location.pathname === path ? 'text-blue-300' : 'text-white/70';
  };

  const NavItem = ({ to, icon: Icon, condition = true, onClick }) => {
    if (!condition) return null;
    
    const handleClick = (e) => {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    };

    const active = location.pathname === to;

    return (
      <Link 
        to={to} 
        className={`flex flex-col items-center justify-center w-full ${isActive(to)}`}
        onClick={handleClick}
      >
        <div className="text-2xl transition-all duration-200 transform hover:scale-110">
          <Icon />
        </div>
        {active && <div className="h-1 w-6 bg-blue-300 rounded-full mt-1"></div>}
      </Link>
    );
  };

  return (
    <div className={`md:hidden fixed bottom-0 left-0 right-0 ${theme.colors.background} border-t border-white/10 z-50 h-16 px-2 backdrop-blur-md`}>
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <NavItem to="/" icon={FiHome} />
        <NavItem 
          to="/" 
          icon={FiSearch} 
          onClick={() => {
            // Focus the search input on the homepage
            const searchInput = document.querySelector('input[placeholder="Search blogs..."]');
            if (searchInput) {
              searchInput.focus();
            } else {
              // If not on homepage, navigate there first
              window.location.href = '/';
            }
          }} 
        />
        {canAddBlog && <NavItem to="/Add" icon={FiPlusSquare} condition={canAddBlog} />}
        {IsLoggedIn && <NavItem to="/chat" icon={FiMessageCircle} />}
        {IsLoggedIn && <NavItem to={`/Account/${user?._id}`} icon={FiUser} />}
        {IsLoggedIn && (user?.role === "ADMIN" || user?.role === "APPROVER") && (
          <NavItem to="/dashboard" icon={FiSettings} />
        )}
        {/* Show Login option when user is not logged in */}
        {!IsLoggedIn && (
          <NavItem to="/Login" icon={FiLogIn} condition={!IsLoggedIn} />
        )}
      </div>
    </div>
  );
};

export default BottomNavBar;