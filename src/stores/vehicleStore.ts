import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectedVehicle {
  make_id?: number;
  make_name?: string;
  model_id?: number;
  model_name?: string;
  year?: number;
}

interface VehicleStore {
  // State
  selectedVehicle: SelectedVehicle | null;
  savedVehicles: SelectedVehicle[];
  
  // Actions
  setVehicle: (vehicle: SelectedVehicle | null) => void;
  updateVehicle: (updates: Partial<SelectedVehicle>) => void;
  clearVehicle: () => void;
  addSavedVehicle: (vehicle: SelectedVehicle & { id?: number }) => void;
  removeSavedVehicle: (id: number) => void;
  setSavedVehicles: (vehicles: SelectedVehicle[]) => void;
  getSelectedVehicleString: () => string;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set, get) => ({
      selectedVehicle: null,
      savedVehicles: [],

      setVehicle: (vehicle: SelectedVehicle | null) => {
        set({ selectedVehicle: vehicle });
      },

      updateVehicle: (updates: Partial<SelectedVehicle>) => {
        set((state) => ({
          selectedVehicle: state.selectedVehicle
            ? { ...state.selectedVehicle, ...updates }
            : updates as SelectedVehicle,
        }));
      },

      clearVehicle: () => {
        set({ selectedVehicle: null });
      },

      addSavedVehicle: (vehicle: SelectedVehicle & { id?: number }) => {
        set((state) => {
          const exists = state.savedVehicles.some(
            (v) =>
              v.make_id === vehicle.make_id &&
              v.model_id === vehicle.model_id &&
              v.year === vehicle.year
          );
          if (!exists) {
            return {
              savedVehicles: [...state.savedVehicles, vehicle],
            };
          }
          return state;
        });
      },

      removeSavedVehicle: (id: number) => {
        set((state) => ({
          savedVehicles: state.savedVehicles.filter((_, idx) => idx !== id),
        }));
      },

      setSavedVehicles: (vehicles: SelectedVehicle[]) => {
        set({ savedVehicles: vehicles });
      },

      getSelectedVehicleString: () => {
        const vehicle = get().selectedVehicle;
        if (!vehicle) return '';
        const parts = [vehicle.make_name, vehicle.model_name, vehicle.year]
          .filter(Boolean);
        return parts.join(' ');
      },
    }),
    {
      name: 'autoparts-vehicle',
      partialize: (state) => ({
        selectedVehicle: state.selectedVehicle,
        savedVehicles: state.savedVehicles,
      }),
    }
  )
);
