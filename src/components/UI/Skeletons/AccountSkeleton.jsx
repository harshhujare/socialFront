
import React from 'react';
import { useTheme } from '../../../context/themecontext.jsx';
const AccountSkeleton = () => {
const { theme } = useTheme(); 
  return (
    <div className={`min-h-screen w-full pt-20 pb-10 flex justify-center px-4 bg-gradient-to-br from-[${theme.colors.primary}] via-[${theme.colors.secondary}] to-[${theme.colors.tertiary}] relative overflow-hidden`}>
      {/* Ambient light effects */}
      <div
        className="fixed top-0 left-0 w-96 h-96 bg-purple-500 opacity-30 rounded-full blur-3xl animate-pulse -z-10"
        style={{ filter: "blur(120px)", left: "-10%", top: "-10%" }}
      ></div>
      <div
        className="fixed bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse -z-10"
        style={{ filter: "blur(120px)", right: "-10%", bottom: "-10%" }}
      ></div>

      <div className="w-full max-w-5xl">
        {/* Profile Header Skeleton */}
        <div
          className={`rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in mb-8`}
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            background: `linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16">
            {/* Profile Image Skeleton */}
            <div className="relative">
              <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-white/20 animate-pulse border-4 border-white/30`}></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
            </div>

            {/* Profile Info Skeleton */}
            <div className="flex-1 text-center md:text-left w-full">
              {/* Name and Buttons Skeleton */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="h-8 bg-white/20 rounded-lg animate-pulse w-48 mx-auto md:mx-0"></div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <div className="h-10 bg-white/20 rounded-lg animate-pulse w-32"></div>
                  <div className="h-10 bg-white/20 rounded-lg animate-pulse w-24"></div>
                </div>
              </div>

              {/* Stats Section Skeleton */}
              <div className="flex items-center gap-8 mb-8 border-b border-white/10 pb-6">
                <div className="text-center">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                  <div className="h-4 bg-white/15 rounded animate-pulse w-12 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                  <div className="h-4 bg-white/15 rounded animate-pulse w-16 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-8 mb-1 mx-auto"></div>
                  <div className="h-4 bg-white/15 rounded animate-pulse w-16 mx-auto"></div>
                </div>
              </div>

              {/* Engagement Stats Skeleton */}
              <div className="flex items-center gap-4 mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-20"></div>
                </div>
                <div className="w-px h-4 bg-white/10"></div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 bg-white/20 rounded animate-pulse w-24"></div>
                </div>
              </div>

              {/* Email Skeleton */}
              <div className="h-6 bg-white/20 rounded animate-pulse w-64 mx-auto md:mx-0 mb-2"></div>

              {/* Form Skeleton (for own profile) */}
              <div className="w-full mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="h-4 bg-white/15 rounded animate-pulse w-12"></div>
                    <div className="h-12 bg-white/20 rounded-xl animate-pulse"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-4 bg-white/15 rounded animate-pulse w-12"></div>
                    <div className="h-12 bg-white/20 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid Skeleton */}
        <div
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-xl border border-white/20 bg-white/10 animate-fade-in"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            background: "linear-gradient(120deg, rgba(255,255,255,0.10) 60%, rgba(46,142,255,0.10) 100%)",
          }}
        >
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-white/20 rounded animate-pulse w-32"></div>
            <div className="h-10 bg-white/20 rounded-lg animate-pulse w-36"></div>
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="group bg-white/10 rounded-xl border border-white/20 backdrop-blur-md overflow-hidden"
              >
                {/* Blog Image Skeleton */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-white/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  {/* Action buttons skeleton */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                    <div className="w-8 h-8 bg-white/20 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                
                {/* Blog Content Skeleton */}
                <div className="p-4">
                  <div className="h-6 bg-white/20 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-white/15 rounded animate-pulse w-full mb-1"></div>
                  <div className="h-4 bg-white/15 rounded animate-pulse w-2/3 mb-3"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-white/15 rounded animate-pulse w-20"></div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                        <div className="h-3 bg-white/15 rounded animate-pulse w-4"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
                        <div className="h-3 bg-white/15 rounded animate-pulse w-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;