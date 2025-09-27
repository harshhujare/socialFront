import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-500">
      <Sidebar />
      <div className="md:pl-64  pb-20 md:pb-0 transition-all duration-300">
        {children}
      </div>
    </div>
  );
};

export default Layout;