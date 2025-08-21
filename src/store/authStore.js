// src/store/authStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  validationErrors: null,
  
  // State setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),
  setValidationErrors: (errors) => set({ validationErrors: errors }),
  clearAuth: () => set({ 
    user: null, 
    isAuthenticated: false,
    error: null,
    validationErrors: null 
  }),
}));