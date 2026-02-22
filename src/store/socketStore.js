import { create } from 'zustand';
import io from 'socket.io-client';

const normalizePrivateMessagePayload = (message = {}) => ({
  ...message,
  conversationId: message.conversationId ?? message.conversation_id,
  senderId: message.senderId ?? message.sender_id,
  receiverId: message.receiverId ?? message.receiver_id
});

const useSocketStore = create((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  onlineUsers: [],
  messages: [],
  privateMessages: {},
  conversationIdByUser: {},
  typingUsers: [],
  notifications: [],
  authUser: null,

  // Actions
  connect: (userData) => {
    const { socket, disconnect } = get();

    if (socket) {
      disconnect();
    }

    const newSocket = io(import.meta.env.REACT_APP_SERVER_URL || 'http://localhost:3004', {
      authUser: {
        token: userData.token,
        id: userData.userId
      }
    });

    newSocket.on('connect', () => {
      set({ isConnected: true });
      console.log('[socket] Connected to server', userData);

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
      const { privateMessages, conversationIdByUser } = get();
      const normalizedMessage = normalizePrivateMessagePayload(message);
      const conversationId = normalizedMessage.conversationId;
      console.log('private message received', message);

      set({
        privateMessages: {
          ...privateMessages,
          [conversationId]: [
            ...(privateMessages[conversationId] || []),
            { ...normalizedMessage, type: 'private' }
          ]
        },
        conversationIdByUser:
          normalizedMessage.conversationId && normalizedMessage.senderId
            ? {
                ...conversationIdByUser,
                [normalizedMessage.senderId]: normalizedMessage.conversationId
              }
            : conversationIdByUser
      });
      console.log('updated privateMessages:', get().privateMessages);
      console.log('Updated conversationIdByUser:', get().conversationIdByUser);
    });

    newSocket.on('user_joined', (data) => {
      const { notifications } = get();
      console.log('data from user_joined', data);
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
      console.log('Message sent:', message);
      const { conversationIdByUser, privateMessages } = get();
      const normalizedMessage = normalizePrivateMessagePayload(message);
      const conversationId = normalizedMessage.conversationId;
      const receiverId = normalizedMessage.receiverId;

      if (conversationId && receiverId) {
        set({
          privateMessages: {
            ...privateMessages,
            [conversationId]: [
              ...(privateMessages[conversationId] || []),
              { ...normalizedMessage, type: 'private' }
            ]
          },
          conversationIdByUser: {
            ...conversationIdByUser,
            [receiverId]: conversationId
          }
        });
        console.log('updated privateMessages:', get().privateMessages);
        console.log('Updated conversationIdByUser:', get().conversationIdByUser);
      }
    });

    newSocket.on('message_read_receipt', (data) => {
      const { privateMessages } = get();
      const updatedMessages = { ...privateMessages };

      Object.keys(updatedMessages).forEach(conversationId => {
        updatedMessages[conversationId] = updatedMessages[conversationId].map(msg =>
          msg.id === data.messageId ? { ...msg, status: 'read', readAt: data.readAt } : msg
        );
      });

      set({ privateMessages: updatedMessages });
    });

    newSocket.on('conversation_details', (payload) => {
      console.log('[socket] Received conversation details:', payload);
      if (!payload?.conversationId || !payload?.peerId) {
        return;
      }
      const { privateMessages, conversationIdByUser } = get();
      const normalizedMessages = Array.isArray(payload.messages)
        ? payload.messages.map(msg => ({ ...normalizePrivateMessagePayload(msg), type: 'private' }))
        : [];

      set({
        privateMessages: {
          ...privateMessages,
          [payload.conversationId]: normalizedMessages
        },
        conversationIdByUser: {
          ...conversationIdByUser,
          [payload.peerId]: payload.conversationId
        }
      });
    });

    set({
      socket: newSocket,
      authUser: {
        userId: userData.userId,
        username: userData.username
      }
    });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        onlineUsers: [],
        typingUsers: [],
        authUser: null
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

  ensureConversation: (peerId) => {
    const { socket, authUser } = get();
    console.log('[socket] ensureConversation called:', { peerId, socket: !!socket, authUser });
    if (!socket || !peerId || !authUser?.userId) {
      console.log('[socket] ensureConversation skipped: missing socket/authUser/peerId');
      return;
    }

    socket.emit('ensure_conversation', {
      userId: authUser.userId,
      peerId
    });
    console.log('[socket] ensure_conversation emitted:', { userId: authUser.userId, peerId });
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
