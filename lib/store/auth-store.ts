import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../constants';

export const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@tokenbuddy.local',
  name: 'Demo User',
  role: 'Demo User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tokenbuddy-demo',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date(),
};

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginAsDemo: () => void;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => void;
  register: (email?: string, password?: string, name?: string) => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user: User | null) => set({ user, isAuthenticated: user !== null }),
      setToken: (token: string | null) => set({ token }),
      setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      loginAsDemo: () => {
        const token = `token_demo_${Date.now()}`;
        set({
          user: DEMO_USER,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
          } catch {
            // ignore storage quota errors
          }
        }
      },

      login: async () => {
        // Direct Demo User login
        const token = `token_demo_${Date.now()}`;
        set({
          user: DEMO_USER,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
          } catch {
            // ignore
          }
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          } catch {
            // ignore
          }
        }
      },

      register: async () => {
        // Direct Demo User registration / login
        const token = `token_demo_${Date.now()}`;
        set({
          user: DEMO_USER,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEMO_USER));
          } catch {
            // ignore
          }
        }
      },

      initAuth: () => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          } catch {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        }
        set({ isLoading: false });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
