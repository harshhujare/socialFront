import React, { useState } from 'react';
import { FiX, FiMenu } from 'react-icons/fi';

const MobileMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMenu}
          />
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-b from-blue-800 to-blue-950 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;

