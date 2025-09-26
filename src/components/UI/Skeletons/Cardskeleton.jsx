import React from 'react'

const Cardskeleton = () => {
return (
<div className="w-full max-w-sm bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-4 shadow-md animate-pulse">
{/* Image Placeholder */}
<div className="w-full h-40 bg-gray-700 rounded-lg"></div>


{/* Likes & Comments */}
<div className="flex items-center gap-4 mt-3">
<div className="w-8 h-4 bg-gray-600 rounded"></div>
<div className="w-8 h-4 bg-gray-600 rounded"></div>
</div>


{/* Title */}
<div className="h-5 bg-gray-600 rounded w-3/4 mt-3"></div>


{/* Description */}
<div className="h-4 bg-gray-700 rounded w-5/6 mt-2"></div>
<div className="h-4 bg-gray-700 rounded w-4/6 mt-1"></div>


{/* Footer */}
<div className="flex justify-between items-center mt-6">
<div>
<div className="h-4 bg-gray-600 rounded w-20"></div>
<div className="h-4 bg-gray-700 rounded w-16 mt-1"></div>
</div>
<div className="h-8 w-16 bg-gray-600 rounded-full"></div>
</div>
</div>
);
};


export default Cardskeleton