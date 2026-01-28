import { create } from 'zustand';
import io from 'socket.io-client';

const useSocketStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  onlineUsers: [],
  messages: [],
  privateMessages: {},
  typingUsers: [],
  notifications: [],

  // Actions
  connect: (userData) => { 
    const { socket, disconnect } = get();
    
    // Disconnect existing socket if any
    if (socket) {
      disconnect();
    }

    // Create new socket connection
    const newSocket = io(import.meta.env.REACT_APP_SERVER_URL || 'http://localhost:3004', {
      authUser: {
        token: userData.token, // if using JWT
        id: userData.userId
      }
    });

    newSocket.on('connect', () => {
      set({ isConnected: true });
      console.log('Connected to server', userData);
      
      // Join chat with user data
      newSocket.emit('user_join', {
        userId: userData.userId,
        username: userData.username
      });
    });

    newSocket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Disconnected from server');
    });

    newSocket.on('online_users', (users) => {
      set({ onlineUsers: users });
    });

    newSocket.on('receive_group_message', (message) => {
      const { messages } = get();
      set({ 
        messages: [...messages, { ...message, type: 'group' }]
      });
    });

    newSocket.on('receive_private_message', (message) => {
      const { privateMessages } = get();
      const conversationId = message.conversationId || message.senderId;
      
      set({
        privateMessages: {
          ...privateMessages,
          [conversationId]: [
            ...(privateMessages[conversationId] || []),
            { ...message, type: 'private' }
          ]
        }
      });
    });

    newSocket.on('user_joined', (data) => {
      const { notifications } = get();
      console.log("data from user_joined", data)
      set({
        notifications: [...notifications, { ...data, type: 'user_join', id: Date.now() }]
      });
    });

    newSocket.on('user_left', (data) => {
      const { notifications } = get();
      set({
        notifications: [...notifications, { ...data, type: 'user_left', id: Date.now() }]
      });
    });

    newSocket.on('user_typing', (data) => {
      const { typingUsers } = get();
      set({
        typingUsers: [...typingUsers.filter(user => user.userId !== data.userId), data]
      });
    });

    newSocket.on('user_stop_typing', (data) => {
      const { typingUsers } = get();
      set({
        typingUsers: typingUsers.filter(user => user.userId !== data.userId)
      });
    });

    newSocket.on('message_sent', (message) => {
      // Handle message sent confirmation
      console.log('Message sent:', message);
    });

    newSocket.on('message_read_receipt', (data) => {
      // Handle read receipts
      const { privateMessages } = get();
      const updatedMessages = { ...privateMessages };
      
      Object.keys(updatedMessages).forEach(conversationId => {
        updatedMessages[conversationId] = updatedMessages[conversationId].map(msg => 
          msg.id === data.messageId ? { ...msg, status: 'read', readAt: data.readAt } : msg
        );
      });
      
      set({ privateMessages: updatedMessages });
    });

    set({ socket: newSocket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        isConnected: false,
        onlineUsers: [],
        typingUsers: []
      });
    }
  },

  sendGroupMessage: (message) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('send_group_message', { message });
    }
  },

  sendPrivateMessage: (receiverId, message, conversationId = null) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('send_private_message', {
        receiverId,
        message,
        conversationId
      });
    }
  },

  startTyping: (options = {}) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('typing_start', options);
    }
  },

  stopTyping: () => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('typing_stop');
    }
  },

  markMessageAsRead: (messageId, conversationId, senderId) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      socket.emit('message_read', {
        messageId,
        conversationId,
        senderId
      });
    }
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  clearPrivateMessages: (conversationId = null) => {
    if (conversationId) {
      const { privateMessages } = get();
      const updatedMessages = { ...privateMessages };
      delete updatedMessages[conversationId];
      set({ privateMessages: updatedMessages });
    } else {
      set({ privateMessages: {} });
    }
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Selectors
  getMessagesByConversation: (conversationId) => {
    const { privateMessages, messages } = get();
    if (conversationId) {
      return privateMessages[conversationId] || [];
    }
    return messages;
  },

  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.some(user => user.id === userId);
  }
}));

export default useSocketStore;