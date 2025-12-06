import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import UsersService from '../services/UsersService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      initialized: false,
      
      // Initialize auth state on app startup
      initializeAuth: async () => {
        if (UsersService.isTokenValid()) {
          try {
            set({ loading: true });
            // Try to get user profile to validate token
            const user = await UsersService.getProfile();
            const token = localStorage.getItem('userToken');
            set({ 
              user: user, 
              token: token, 
              loading: false, 
              initialized: true 
            });
          } catch (error) {
            // Token is invalid, clear it
            UsersService.logout();
            set({ 
              user: null, 
              token: null, 
              loading: false, 
              error: null, 
              initialized: true 
            });
          }
        } else {
          set({ initialized: true });
        }
      },
      
      // Login function
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await UsersService.login(email, password);
          // Handle backend response structure
          set({ 
            user: response, 
            token: response.access || response.token, 
            loading: false, 
            error: null 
          });
          return response;
        } catch (err) {
          set({ error: err.message || 'Login failed', loading: false });
          throw err;
        }
      },
      
      // Logout function
      logout: () => {
        UsersService.logout(); // Clear token from localStorage
        set({ user: null, token: null });
      },
      
      // Get user role
      getUserRole: () => {
        const user = get().user;
        if (!user) return null;
        
        if (user.isAdmin) return 'admin';
        if (user.isAccountant) return 'accountant';
        if (user.isTeacher) return 'teacher';
        return 'student'; // Default role for custom users
      },
      
      // Check if user is admin
      isAdmin: () => {
        const user = get().user;
        return user?.isAdmin || false;
      },
      
      // Check if user is accountant
      isAccountant: () => {
        const user = get().user;
        return user?.isAccountant || false;
      },
      
      // Check if user is teacher
      isTeacher: () => {
        const user = get().user;
        return user?.isTeacher || false;
      },
      
      // Signup function
      signup: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await UsersService.signup(userData);
          // Handle backend response structure
          set({ 
            user: response.user, 
            token: response.user.token, 
            loading: false, 
            error: null 
          });
          return response;
        } catch (err) {
          set({ error: err.message || 'Signup failed', loading: false });
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }), // only persist user and token
    }
  )
); 