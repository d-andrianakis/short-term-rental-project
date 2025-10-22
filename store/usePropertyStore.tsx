import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PropertyState {
  propertyId: string | null;
  setPropertyId: (id: string) => void;
  clearPropertyId: () => void;

  // added date range
  fromDate: string | null;
  toDate: string | null;
  setFromDate: (date: string | null) => void;
  setToDate: (date: string | null) => void;
  clearDates: () => void;
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set) => ({
      propertyId: null,
      setPropertyId: (id) => set({ propertyId: id }),
      clearPropertyId: () => set({ propertyId: null }),
      fromDate: null,
      toDate: null,
      setFromDate: (date) => set({ fromDate: date }),
      setToDate: (date) => set({ toDate: date }),
      clearDates: () => set({ fromDate: null, toDate: null }),
    }),
    {
      name: "property-storage", // localStorage key
    }
  )
);
