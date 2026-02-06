import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: number;
  user_id: number;
  phone_number: string;
  avatar_url?: string;
  bio?: string;
  is_owner: boolean;
  business_registration?: string;
  tax_id?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile: UserProfile;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthStore {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOwner: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (tokens: AuthTokens, user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  checkOwner: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isOwner: false,

      setUser: (user: User | null) => {
        set((state) => ({
          user,
          isAuthenticated: !!user,
          isOwner: user?.profile?.is_owner || false,
        }));
      },

      setTokens: (tokens: AuthTokens | null) => {
        set({ tokens });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      login: (tokens: AuthTokens, user: User) => {
        set((state) => ({
          user,
          tokens,
          isAuthenticated: true,
          isOwner: user.profile?.is_owner || false,
          error: null,
        }));
        // Store tokens in localStorage/cookie
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
      },

      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isOwner: false,
          error: null,
        });
        // Clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      },

      updateProfile: (updates: Partial<UserProfile>) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                profile: {
                  ...state.user.profile,
                  ...updates,
                },
              }
            : null,
          isOwner: updates.is_owner !== undefined ? updates.is_owner : get().isOwner,
        }));
      },

      getAccessToken: () => {
        return get().tokens?.access || localStorage.getItem('access_token');
      },

      getRefreshToken: () => {
        return get().tokens?.refresh || localStorage.getItem('refresh_token');
      },

      checkOwner: () => {
        return get().isOwner;
      },
    }),
    {
      name: 'autoparts-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        isOwner: state.isOwner,
      }),
    }
  )
);
