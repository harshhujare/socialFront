import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/authcontext';
import { getMutuals } from '../../lib/utilAip';
import { API_BASE_URL } from '../../lib/api';
import { socket } from '../Socket';       
import MessageBubble from './MessageBubble';
import Skeliton from '../UI/Skeletons/Skeliton';
import { setMessages,setSelectedConversation } from '../ChatSlice/ConversationSlice.jsx';
// Helper function for formatting message time
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { useTheme } from '../../context/themecontext.jsx';
import { useDispatch, useSelector } from "react-redux";
const ChatBoard = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileView, setMobileView] = useState('contacts'); // 'contacts' or 'chat'
  
const [messages, setMessages] = useState([]);
  const [mutuals, setMutuals] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      fetchUsers();
      try {
        if (socket && !socket.connected) {
          console.log('Attempting to connect socket...');
          socket.connect();
          
          // Add connection event listeners
          socket.on('connect', () => {
            console.log('Socket connected successfully');
          });
          
          socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
          });
          
          socket.on('message_error', (error) => {
            console.error('Message error:', error);
          });
        }
      } catch (err) {
        console.error('Socket connect error:', err);
      }

      // cleanup: disconnect only if we created/initiated the connection
      return () => {
        try {
          if (socket) {
            // remove any event listeners that might remain
            socket.off();
            if (socket.connected) socket.disconnect();
          }
        } catch (err) {
          console.error('Socket disconnect error:', err);
        }
      };
    }
  }, [user]);
  useEffect(() => {
    if (!socket) return;
  
    // listen for incoming messages
    socket.on("new_message", (msg) => {
      
      console.log('Received new message:', msg);
      setMessages((prev) => [...prev, msg]);
    });
   

    // listen for message sent confirmation
    socket.on("message_sent", (msg) => {
      console.log('Message sent confirmation:', msg);
      // Update the message with the real ID from server
      setMessages((prev) => 
        prev.map(m => 
          m._id === Date.now() && m.content === msg.content 
            ? { ...m, _id: msg._id, createdAt: msg.createdAt }
            : m
        )
      );
    });

    // listen for typing events
    socket.on("user_typing", (data) => {
      if (data.from === selectedChat?._id) {
        setIsTyping(data.isTyping);
      }
    });

    // listen for message errors
    socket.on("message_error", (error) => {
      console.error('Message error received:', error);
      // Remove the temporary message if it failed to send
      setMessages((prev) => prev.filter(m => m._id !== Date.now()));
    });
  
    return () => {
      socket.off("new_message");
      socket.off("message_sent");
      socket.off("user_typing");
      socket.off("message_error");
    };
  }, [socket, selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add touch event listeners for mobile devices
  useEffect(() => {
    const handleTouchStart = () => {
      // Add any touch-specific behavior here
      // For example, you might want to hide the keyboard on touch outside input
      document.activeElement.blur();
    };
    
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
      };
    }
  }, [isMobile]);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const mutualsRes = await getMutuals(user._id);
      // console.log("Mutual Friends22:", mutualsRes);
      if (mutualsRes) {
        setMutuals(mutualsRes || []);
      }
    } catch (error) {
      console.error('Error fetching mutual users:', error);
      // Set empty array on error to prevent UI issues
      setMutuals([]);
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (userData) => {
    if (userData.profileImgUrl && userData.profileImgUrl !== '/public/uploads/profile/image.png') {
      return `${userData.profileImgUrl}`;
    }
    // Return a fallback avatar using a data URL or default image
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2Q3I3M0QiLz4KPHBhdGggZD0iTTIwIDEwQzIyLjA3NjEgMTAgMjQgMTEuOTIzOSAyNCAxNEMyNCAxNi4wNzYxIDIyLjA3NjEgMTggMjAgMThDMTcuOTIzOSAxOCAxNiAxNi4wNzYxIDE2IDE0QzE2IDExLjkyMzkgMTcuOTIzOSAxMCAyMCAxMFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yNiAyNkMyNiAyOS4zMTM3IDIzLjMxMzcgMzIgMjAgMzJDMTYuNjg2MyAzMiAxNCAyOS4zMTM3IDE0IDI2QzE0IDIyLjY4NjMgMTYuNjg2MyAyMCAyMCAyMEMyMy4zMTM3IDIwIDI2IDIyLjY4NjMgMjYgMjZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K';
  };

  const filteredUsers = () => {
    if (!searchQuery) return mutuals;
    
    return mutuals.filter(userData => {
      return userData.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
             userData.email?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };
  // console.log("filteredUsers",filteredUsers());
  
  const handleUserSelect = (userData) => {
    setSelectedChat(userData);
    // Clear messages when switching users
    setMessages([]);
    // TODO: Load chat history from backend when implemented
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: '2-digit', 
        day: '2-digit',
        year: '2-digit'
      });
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedChat) {
      const tempId = Date.now();
      
      // Create message object
      const newMessage = {
        content: messageText,
        sender: user._id,
        createdAt: new Date(),
        _id: tempId // Temporary ID for local state
      };
      
      // Add to local messages immediately for instant feedback
      setMessages((prev) => [...prev, newMessage]);
      
      // Send via socket
      console.log('Sending message to:', selectedChat._id, 'Content:', messageText);
      socket.emit("private_message", { to: selectedChat._id, content: messageText });
      console.log( "alll messages",messages);
      // Clear input
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle touch scroll for mobile devices
  const handleTouchScroll = () => {
    // Add smooth scrolling behavior for touch devices
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    // Emit typing event
    if (socket && selectedChat) {
      socket.emit('typing', { to: selectedChat._id, isTyping: true });
      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        socket.emit('typing', { to: selectedChat._id, isTyping: false });
      }, 3000);
    }
  };

  // Group messages by date for better organization
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages: messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    }));
  };

  // Format date for message headers
  const formatMessageDate = (dateString) => {
    
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short', 
        day: 'numeric'
      });
    }
  };



  if (loading) {
    return (
     <>
        <Skeliton />
      </>
    );
  }

  // Function to go back to contacts list on mobile
  const handleBackToContacts = () => {
    setMobileView('contacts');
  };

  // Function to handle user selection and view change on mobile
  const handleMobileUserSelect = (userData) => {
    setSelectedChat(userData._id);
    console.log("first", userData._id);
    handleUserSelect(userData);
    if (isMobile) {
      setMobileView('chat');
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 ">
      <div className="flex h-[calc(100vh)]">
        {/* Left Sidebar - Users List */}

        <div className={`${isMobile && mobileView === 'chat' ? 'hidden' : 'block'} ${isMobile ? 'w-full' : 'w-96'} backdrop-blur-xl shadow-2xl border-r border-white/10`}>
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/10">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Chats</h1>
            
         
            <div className="relative">
              <input
                type="text"
                placeholder="Search or start a new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 pl-10 md:pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/15 text-sm md:text-base"
              />
              <svg className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            
            
          </div>

              
        <div className="overflow-y-auto h-[calc(100vh-230px)] md:h-[calc(100vh-280px)]">
            {filteredUsers().map((userData, index) => {
              const isSelected = selectedChat?._id === userData._id;
              
              return (
                <div
                  key={userData._id || `user-${index}`}
                  onClick={() => handleMobileUserSelect(userData)}
 className={`p-4 cursor-pointer transition-all duration-200   hover:bg-[rgba(255,255,255,0.1)]  ${isSelected ? 'bg-[rgba(244,244,244,0.1)] border-r-2 border-blue-500 shadow-lg ' : '' }`}
                >
                
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="relative">
                      <img
                        src={userData.profileImgUrl || getProfileImage(userData)}
                        alt={userData.fullname}
                        className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover border-2 border-white/20"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium truncate text-sm md:text-base">{userData.fullname}</h3>
                        <span className="text-[10px] md:text-xs text-white/60">
                          Online
                        </span>
                      </div>
                      <p className="text-white/60 text-xs truncate">Mutual connection</p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredUsers().length === 0 && (
              <div className="p-8 text-center text-white/60">
                {searchQuery ? (
                  <div>
                    <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-base md:text-lg font-medium">No users found</p>
                    <p className="text-xs md:text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-base md:text-lg font-medium">No mutual connections yet</p>
                    <p className="text-xs md:text-sm">Connect with users who follow each other to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

                 {/* Right Side - Chat Area */}
         <div className={`${isMobile && mobileView === 'contacts' ? 'hidden' : 'block'} flex-1 bg-black/10 backdrop-blur-xl shadow-inner transition-all duration-300 relative`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isMobile && (
                      <button 
                        onClick={handleBackToContacts}
                        className="mr-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <img
                      src={selectedChat.profileImgUrl || getProfileImage(selectedChat)}
                      alt={selectedChat.fullname}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                    />
                    <div>
                      <h3 className="text-white font-medium">{selectedChat.fullname}</h3>
                      <p className="text-white/60 text-sm">Online</p>
                    </div>
                  </div>
                </div>
              </div>

                             {/* Chat Messages Area */}
               <div 
                 className="flex-1 p-4 md:p-6 overflow-y-auto pb-24" 
                 onTouchEnd={handleTouchScroll}
               >
                {/* Messages Container */}
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-white/60">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">No messages yet</h3>
                    <p className="text-xs md:text-sm opacity-80">Start your conversation with {selectedChat.fullname}</p>
                    
                    {/* System Messages */}
                    <div className="mt-6 md:mt-8 space-y-2 md:space-y-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 md:px-4 py-2 text-white/80 text-xs md:text-sm max-w-[90%] md:max-w-md text-center mx-auto">
                        This is a secure chat with {selectedChat.fullname}. Messages are end-to-end encrypted.
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 md:px-4 py-2 text-white/80 text-xs md:text-sm max-w-[90%] md:max-w-md text-center mx-auto">
                        Start your conversation by typing a message below.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Group messages by date */}
                    {groupMessagesByDate(messages).map(({ date, messages: dayMessages }) => (
                      <div key={date}>
                        <div className="text-center text-white/40 text-sm mb-4">
                          {formatMessageDate(date)}
                        </div>
                        
                        {dayMessages.map((message, index) => (
                          <MessageBubble 
                            key={message._id || `temp-${index}`}
                            message={message}
                            isOwnMessage={message.sender === user._id}
                            senderName={message.sender === user._id ? user.fullname : selectedChat.fullname}
                          />
                                                 ))}
                       </div>
                     ))}
                   </div>
                 )}
                 {/* Scroll reference for auto-scroll */}
                 <div ref={messagesEndRef} />
               </div>

                             {/* Typing Indicator */}
               {isTyping && (
                 <div className="absolute bottom-20 left-4 text-white/60 text-sm flex items-center space-x-2">
                   <div className="flex space-x-1">
                     <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   </div>
                   <span>{selectedChat.fullname} is typing...</span>
                 </div>
               )}

               {/* Message Input */}
               <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="flex items-center space-x-2 md:space-x-3">
                  {!isMobile && (
                    <>
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a2 2 0 002.828-2.828l-6.586-6.586a2 2 0 00-2.828 0L7 6.172a2 2 0 002.828 2.828z" />
                        </svg>
                      </button>
                    </>  
                  )}
                                     <input
                     type="text"
                     placeholder="Type a message"
                     value={messageText}
                     onChange={handleInputChange}
                     onKeyPress={handleKeyPress}
                     className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                     autoComplete="off"
                     autoCorrect="on"
                     spellCheck="true"
                     enterKeyHint="send"
                   />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                  {!isMobile && (
                    <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white/60">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Welcome to Chat</h2>
                <p className="text-base md:text-lg">{isMobile ? 'Select a user to start chatting' : 'Select a user from the left to start chatting'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBoard;
