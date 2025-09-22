import React from 'react'

const MessageBubble = ({  message, isOwnMessage, senderName }) => {
    const formatMessageTime = (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    };
    
    // Detect touch device
    const isTouchDevice = () => {
      return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    };
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2 md:mb-3`}>
         <div className={`max-w-[75%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg shadow-lg ${
           isOwnMessage 
             ? 'bg-purple-600 text-white rounded-br-none' 
             : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-none border border-white/20'
         }`}>
           <div className="flex items-end space-x-2">
             <div className="flex-1">
              
               <p className="text-sm leading-relaxed break-words">
                 {message.content}
               </p>
             </div>
             <div className="flex items-center space-x-1">
               <span className={`text-[10px] md:text-xs opacity-60 ${isOwnMessage ? 'text-purple-100' : 'text-white/60'}`}>
                 {formatMessageTime(message.createdAt)}
               </span>
               {isOwnMessage && (
                 <div className="flex items-center space-x-1 ml-2">
                   {/* Message status indicator */}
                   <svg className="w-3 h-3 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                   </svg>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
  )
}

export default MessageBubble