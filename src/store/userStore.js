// src/store/authStore.js
import { create } from "zustand";
export const useUserStore = create((set) => ({
    userList: null,
    error: null,
    validationErrors: null,
    // Initialize auth state from localStorage
    setError: (error) => set({ error }),
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    
    
    
}));