import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../constants';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => {
        set((state) => {
          const newIsDark = !state.isDark;
          if (newIsDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: newIsDark };
        });
      },
      setTheme: (isDark: boolean) => {
        set({ isDark });
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      initTheme: () => {
        // Check localStorage first, then system preference
        const stored = localStorage.getItem(STORAGE_KEYS.THEME);
        if (stored !== null) {
          set({ isDark: stored === 'dark' });
          if (stored === 'dark') {
            document.documentElement.classList.add('dark');
          }
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ isDark: prefersDark });
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          }
        }
      },
    }),
    {
      name: STORAGE_KEYS.THEME,
    }
  )
);
