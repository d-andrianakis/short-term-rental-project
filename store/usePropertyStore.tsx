import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PropertyState {
  propertyId: string | null;
  setPropertyId: (id: string) => void;
  clearPropertyId: () => void;
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      propertyId: null,
      setPropertyId: (id) => set({ propertyId: id }),
      clearPropertyId: () => set({ propertyId: null }),
    }),
    {
      name: "property-storage", // localStorage key
    }
  )
);
