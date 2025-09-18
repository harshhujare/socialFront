import React from "react";
import {  useNavigate } from "react-router-dom";

const handleBack = () => {
  navigate(-1);
};
const BackButton = () => {
    const navigate = useNavigate();
    const handleBack = () => {
  navigate(-1);
};
  return (
    <button
      onClick={ handleBack}
      className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

export default BackButton;
