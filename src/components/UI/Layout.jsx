import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#23234b] to-[#0f2027] relative overflow-hidden">
      <Sidebar />
      <div className="md:pl-64 pt-8 pb-20 md:pb-0 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;