// src/store/authStore.js
import { create } from "zustand";
import { authService } from "../services";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    validationErrors: null, // New state for validation errors
    
    login: async (payload) => {
        try {
            set({ isLoading: true, error: null, validationErrors: null });
            const response = await authService.login(payload);
            set({ 
                user: response.data.user, 
                isAuthenticated: true,
                isLoading: false 
            });
            return response;
        } catch (error) {
        // Handle different error types
            if (error.response?.status === 422) {
                set({ 
                    validationErrors: error.response.data.errors,
                    isLoading: false
                });
            } else {
                set({ 
                    error: error.response?.data?.message || "Login failed",
                    isLoading: false 
                });
            }
            throw error; // Re-throw for component to handle if needed
        }
    },
    register: async (payload) => {
        try {
            set({ isLoading: true, error: null, validationErrors: null });
            const response = await authService.register(payload);
            set({ 
                isAuthenticated: true,
                isLoading: false 
            });
            return response;
        } catch (error) {
        // Handle different error types
            if (error.response?.status === 422) {
                set({ 
                    validationErrors: error.response.data.errors,
                    isLoading: false
                });
            } else {
                set({ 
                    error: error.response?.data?.message || "Login failed",
                    isLoading: false 
                });
            }
            throw error; // Re-throw for component to handle if needed
        }
    },
    
    logout: async () => {
        try {
            set({ isLoading: true });
            await authService.logout();
            set({ 
                user: null, 
                isAuthenticated: false,
                isLoading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Logout failed",
                isLoading: false 
            });
            throw error;
        }
    },
}));