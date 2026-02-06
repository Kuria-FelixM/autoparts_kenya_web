import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteProduct {
  id: number;
  name: string;
  sku: string;
  price: number;
  discount_percentage?: number;
  primary_image?: string;
  category?: string;
}

interface FavoritesStore {
  // State
  favorites: FavoriteProduct[];
  
  // Actions
  addFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (product_id: number) => void;
  isFavorited: (product_id: number) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (product: FavoriteProduct) => {
        set((state) => {
          const exists = state.favorites.find((fav) => fav.id === product.id);
          if (!exists) {
            return {
              favorites: [...state.favorites, product],
            };
          }
          return state;
        });
      },

      removeFavorite: (product_id: number) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== product_id),
        }));
      },

      isFavorited: (product_id: number) => {
        return get().favorites.some((fav) => fav.id === product_id);
      },

      toggleFavorite: (product: FavoriteProduct) => {
        const state = get();
        if (state.isFavorited(product.id)) {
          state.removeFavorite(product.id);
        } else {
          state.addFavorite(product);
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoriteCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: 'autoparts-favorites',
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    }
  )
);
