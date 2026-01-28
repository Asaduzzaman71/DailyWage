import React, { useState, useEffect, useRef } from 'react';
import useSocketStore from '../../store/socketStore';

const Chat = ({ auth }) => {
  const {
    socket,
    isConnected,
    onlineUsers,
    messages,
    privateMessages,
    typingUsers,
    notifications,
    connect,
    disconnect,
    sendGroupMessage,
    sendPrivateMessage,
    startTyping,
    stopTyping,
    clearNotifications,
    isUserOnline
  } = useSocketStore();

  const [message, setMessage] = useState('');
  const [activeChat, setActiveChat] = useState('group');
  const messagesEndRef = useRef(null);

  // Connect to socket when component mounts
  useEffect(() => {
    if (auth) {
      console.log("user", auth)
      connect({
        userId: auth.user.id,
        username: auth.user.name,
        token: auth.token
      });
    }
    return () => {
      disconnect();
    };
  }, [auth, connect, disconnect]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, privateMessages, activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      if (activeChat === 'group') {
        sendGroupMessage(message);
      } else {
        sendPrivateMessage(activeChat, message);
      }
      setMessage('');
      stopTyping();
    }
  };

  const handleTyping = () => {
    if (message.trim()) {
      const options = activeChat === 'group' ? {} : { receiverId: activeChat };
      startTyping(options);
    } else {
      stopTyping();
    }
  };

  const getCurrentMessages = () => {
    console.log("messages", messages)
    if (activeChat === 'group') {
      return messages;
    }
    return privateMessages[activeChat] || [];
  };

  const getTypingUsersForCurrentChat = () => {
    if (activeChat === 'group') {
      return typingUsers.filter(typingUser => !typingUser.conversationId || typingUser.conversationId === 'group');
    }
    return typingUsers.filter(typingUser => typingUser.conversationId === activeChat || typingUser.userId === activeChat);
  };

  // Get typing usernames as a string
  const getTypingUsernames = () => {
    return getTypingUsersForCurrentChat()
      .map(typingUser => typingUser.username)
      .join(', ');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Chat Room</h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Online Users Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-700">
              Online Users ({onlineUsers.length})
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div 
              className={`p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
                activeChat === 'group'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveChat('group')}
            >
              <span className="font-medium">Group Chat {activeChat}</span>
            </div>
            {onlineUsers.map(onlineUser => (
              <div 
                key={onlineUser.id}
                className={`flex items-center justify-between p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
                  activeChat === onlineUser.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveChat(onlineUser.id)}
              >
                <span className="font-medium truncate">{onlineUser.username}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {getCurrentMessages().map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl p-3 ${
                  msg.type === 'system'
                    ? 'bg-yellow-100 border border-yellow-200 text-yellow-800 mx-auto text-center italic'
                    : msg.senderId === user.id
                    ? 'bg-blue-500 text-white ml-auto'
                    : 'bg-gray-100 text-gray-800'
                } ${msg.type !== 'system' ? 'rounded-bl-none' : ''}`}
              >
                {msg.type !== 'system' && msg.type !== 'private' && (
                  <div className="flex justify-between items-center mb-1">
                    <strong className={`text-sm ${msg.senderId === user.id ? 'text-blue-100' : 'text-gray-600'}`}>
                      {msg.username}
                    </strong>
                    <span className={`text-xs ${msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                <div className="break-words">{msg.message}</div>
                {msg.status && (
                  <div className={`text-xs mt-1 text-right ${
                    msg.senderId === user.id ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {msg.status}
                  </div>
                )}
              </div>
            ))}
            
            {/* Fixed Typing Indicator */}
            {getTypingUsersForCurrentChat().length > 0 && (
              <div key="typing-indicator" className="text-sm text-gray-500 italic py-2">
                {getTypingUsernames()} 
                {getTypingUsersForCurrentChat().length === 1 ? ' is' : ' are'} typing...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                placeholder={`Message ${activeChat === 'group' ? 'group' : 'user'}...`}
                disabled={!isConnected}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button 
                type="submit" 
                disabled={!message.trim() || !isConnected}
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>

        {/* Notifications Sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-700">Notifications</h3>
            <button 
              onClick={clearNotifications}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className="p-3 mb-2 bg-gray-50 rounded-lg border-l-4 border-blue-500 shadow-sm"
              >
                <div className="text-sm text-gray-700">{notification.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                No notifications
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;