import React from 'react'
import { useTheme } from '../../../context/themecontext.jsx';
const Skeliton = () => {
const { theme } = useTheme(); 
return (
<div className={`flex h-screen ${theme.colors.primary} text-white`}>
{/* Sidebar */}
<div className="w-80 border-r border-gray-700 p-4 flex flex-col">
<div className="h-10 bg-gray-700/50 rounded mb-4 animate-pulse"></div>
<div className="flex gap-2 mb-4">
<div className="h-8 w-20 bg-gray-700/50 rounded animate-pulse"></div>
<div className="h-8 w-20 bg-gray-700/50 rounded animate-pulse"></div>
</div>
{/* Chat List */}
<div className="space-y-3">
{Array.from({ length: 5 }).map((_, i) => (
<div
key={i}
className="flex items-center gap-3 p-2 rounded bg-gray-700/30 animate-pulse"
>
<div className="h-10 w-10 rounded-full bg-gray-600"></div>
<div className="flex-1">
<div className="h-4 w-24 bg-gray-600 rounded mb-1"></div>
<div className="h-3 w-16 bg-gray-600 rounded"></div>
</div>
</div>
))}
</div>
</div>


{/* Chat Window */}
<div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-400 ">
{/* Chat Header */}
<div className="flex items-center gap-3 mb-6">
<div className="h-12 w-12 rounded-full bg-gray-600 animate-pulse"></div>
<div>
<div className="h-4 w-24 bg-gray-600 rounded mb-2 animate-pulse"></div>
<div className="h-3 w-16 bg-gray-600 rounded animate-pulse"></div>
</div>
</div>


{/* Empty State */}
<div className="flex-1 flex flex-col justify-center items-center text-center gap-4">
<div className="h-16 w-16 bg-gray-600 rounded-full animate-pulse"></div>
<div className="h-6 w-48 bg-gray-600 rounded animate-pulse"></div>
<div className="h-4 w-64 bg-gray-600 rounded animate-pulse"></div>
<div className="h-4 w-52 bg-gray-600 rounded animate-pulse"></div>
</div>


{/* Input Bar */}
<div className="flex items-center gap-3 mt-6">
<div className="h-10 w-10 bg-gray-600 rounded animate-pulse"></div>
<div className="flex-1 h-10 bg-gray-600 rounded animate-pulse"></div>
<div className="h-10 w-10 bg-gray-600 rounded animate-pulse"></div>
</div>
</div>
</div>
);
}

export default Skeliton