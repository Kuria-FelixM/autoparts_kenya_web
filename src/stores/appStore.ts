import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface AppStore {
  // UI State
  mobileMenuOpen: boolean;
  sideDrawerOpen: boolean;
  currentLocale: 'en' | 'sw';
  isDarkMode: boolean;
  notifications: Notification[];

  // Network State
  isOnline: boolean;
  isLoading: boolean;

  // App State
  lastSync: number | null;

  // Actions
  setMobileMenuOpen: (open: boolean) => void;
  setSideDrawerOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleSideDrawer: () => void;
  setLocale: (locale: 'en' | 'sw') => void;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setOnline: (online: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLastSync: (timestamp: number) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  mobileMenuOpen: false,
  sideDrawerOpen: false,
  currentLocale: 'en',
  isDarkMode: false,
  notifications: [],
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isLoading: false,
  lastSync: null,

  setMobileMenuOpen: (open: boolean) => {
    set({ mobileMenuOpen: open });
  },

  setSideDrawerOpen: (open: boolean) => {
    set({ sideDrawerOpen: open });
  },

  toggleMobileMenu: () => {
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
  },

  toggleSideDrawer: () => {
    set((state) => ({ sideDrawerOpen: !state.sideDrawerOpen }));
  },

  setLocale: (locale: 'en' | 'sw') => {
    set({ currentLocale: locale });
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  },

  setDarkMode: (dark: boolean) => {
    set({ isDarkMode: dark });
    if (typeof document !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDark = !state.isDarkMode;
      if (typeof document !== 'undefined') {
        if (newDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDarkMode: newDark };
    });
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const fullNotification = { ...notification, id };

    set((state) => ({
      notifications: [...state.notifications, fullNotification],
    }));

    // Auto-remove after duration
    const duration = notification.duration || 3000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },

  setOnline: (online: boolean) => {
    set({ isOnline: online });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setLastSync: (timestamp: number) => {
    set({ lastSync: timestamp });
  },
}));
