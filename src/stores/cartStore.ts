import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  primary_image?: string;
}

interface Delivery {
  type: 'standard' | 'express' | 'economy';
  address: string;
  city: string;
  postal_code: string;
  recipient_name: string;
  recipient_phone: string;
  estimated_days: { min: number; max: number };
  delivery_cost: number;
}

interface CartStore {
  // State
  items: CartItem[];
  delivery: Delivery | null;
  guest_email: string | null;
  guest_phone: string | null;
  subtotal: number;
  total: number;

  // Actions
  addItem: (product: CartItem) => void;
  removeItem: (product_id: number) => void;
  updateQuantity: (product_id: number, quantity: number) => void;
  clearCart: () => void;
  setDelivery: (delivery: Delivery) => void;
  setGuestInfo: (email: string, phone: string) => void;
  getCartCount: () => number;
  calculateTotals: () => void;
}

const calculateTotals = (items: CartItem[], delivery: Delivery | null) => {
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const delivery_cost = delivery?.delivery_cost || 0;
  return {
    subtotal,
    total: subtotal + delivery_cost,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      delivery: null,
      guest_email: null,
      guest_phone: null,
      subtotal: 0,
      total: 0,

      addItem: (product: CartItem) => {
        set((state) => {
          const existing = state.items.find((item) => item.product_id === product.product_id);
          let newItems: CartItem[];

          if (existing) {
            newItems = state.items.map((item) =>
              item.product_id === product.product_id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            );
          } else {
            newItems = [...state.items, product];
          }

          const { subtotal, total } = calculateTotals(newItems, state.delivery);
          return {
            items: newItems,
            subtotal,
            total,
          };
        });
      },

      removeItem: (product_id: number) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.product_id !== product_id);
          const { subtotal, total } = calculateTotals(newItems, state.delivery);
          return {
            items: newItems,
            subtotal,
            total,
          };
        });
      },

      updateQuantity: (product_id: number, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            get().removeItem(product_id);
            return state;
          }
          const updatedItems = state.items.map((item) =>
            item.product_id === product_id ? { ...item, quantity } : item
          );
          const { subtotal, total } = calculateTotals(updatedItems, state.delivery);
          return {
            items: updatedItems,
            subtotal,
            total,
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          delivery: null,
          guest_email: null,
          guest_phone: null,
        });
      },

      setDelivery: (delivery: Delivery) => {
        set((state) => {
          const { subtotal, total } = calculateTotals(state.items, delivery);
          return {
            delivery,
            subtotal,
            total,
          };
        });
      },

      setGuestInfo: (email: string, phone: string) => {
        set({
          guest_email: email,
          guest_phone: phone,
        });
      },

      getCartCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      calculateTotals: () => {
        const state = get();
        const { subtotal, total } = calculateTotals(state.items, state.delivery);
        set({ subtotal, total });
      },
    }),
    {
      name: 'autoparts-cart',
      partialize: (state) => ({
        items: state.items,
        delivery: state.delivery,
        guest_email: state.guest_email,
        guest_phone: state.guest_phone,
        subtotal: state.subtotal,
        total: state.total,
      }),
    }
  )
);
