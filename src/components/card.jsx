
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, title, titalimg, summary, createdby, likes = 0, comments = 0 }) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleView = () => {
    navigate(`/blog/${id}`);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article
      className="group w-80 h-[430px] rounded-3xl overflow-hidden shadow-xl bg-white/5 border border-white/15 backdrop-blur-xl m-6 flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-3xl">
        {/* Loading Skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
        )}

        {/* Image */}
        <img
          src={titalimg || './assets/image.png'}
          alt={title}
          className={`object-cover w-full h-full transition duration-500 ${imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Fallback for image error */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}

        {/* Gradient overlay + badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90" />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white/90 text-xs">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.828l-6.828-6.829a4 4 0 010-5.656z"/></svg>
              {likes}
            </span>
            <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h2v3l4-3h6a2 2 0 002-2z" clipRule="evenodd"/></svg>
              {comments}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors duration-200">
          {title}
        </h2>
        <p className="text-blue-100 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
          {summary || 'No summary available'}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-blue-300">
              By <span className="font-semibold text-blue-200">{createdby || 'Anonymous'}</span>
            </span>
            <span className="text-xs text-gray-400 mt-1">{formatDate(new Date())}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleView(); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 hover:shadow-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`View blog post: ${title}`}
          >
            Read
          </button>
        </div>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
    </article>
  );
};

export default Card;