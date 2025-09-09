// src/store/authStore.js
import { create } from "zustand";
import { jwtDecode } from 'jwt-decode';
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    validationErrors: null,
    // Initialize auth state from localStorage
    initialize: () => {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }
    },
    
    setUser: (user) => set({ 
      user, 
      isAuthenticated: !!user, 
      loading: false 
    }),
    setError: (error) => set({ error }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    clearAuth: () => set({ 
      user: null, 
      isAuthenticated: false,
      error: null,
      validationErrors: null 
    }),
    logout : () => {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    },
    isTokenValid: () => {
      console.log("hello")
        const token = localStorage.getItem('access_token');
        if (!token) return false;
        try {
          const decoded = jwtDecode(token);
          return decoded.exp * 1000 > Date.now();
        } catch {
          return false;
        }
    },
}));