import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VendorLocation } from '../types';

interface VendorState {
  locations: VendorLocation[];
  vendorMap: Record<string, string>; // Map of vendor ID to vendor name
  vendorLocations: Record<string, VendorLocation[]>; // Map of vendor ID to locations
  addLocation: (location: VendorLocation) => void;
  updateLocation: (locationZip: string, location: VendorLocation) => void;
  removeLocation: (locationZip: string) => void;
  addZipCode: (locationZip: string, zipCode: string) => void;
  removeZipCode: (locationZip: string, zipCode: string) => void;
  setVendorMap: (vendorMap: Record<string, string>) => void;
  setVendorLocations: (vendorId: string, locations: VendorLocation[]) => void;
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set) => ({
      locations: [],
      vendorMap: {},
      vendorLocations: {},

      addLocation: (location) => set((state) => ({
        locations: [...state.locations, location]
      })),

      updateLocation: (locationZip, updatedLocation) => set((state) => ({
        locations: state.locations.map(loc => 
          loc.locationZip === locationZip ? updatedLocation : loc
        )
      })),

      removeLocation: (locationZip) => set((state) => ({
        locations: state.locations.filter(loc => loc.locationZip !== locationZip)
      })),

      addZipCode: (locationZip, zipCode) => set((state) => ({
        locations: state.locations.map(loc => 
          loc.locationZip === locationZip
            ? { ...loc, serviceZips: [...loc.serviceZips, zipCode] }
            : loc
        )
      })),

      removeZipCode: (locationZip, zipCode) => set((state) => ({
        locations: state.locations.map(loc =>
          loc.locationZip === locationZip
            ? { ...loc, serviceZips: loc.serviceZips.filter(zip => zip !== zipCode) }
            : loc
        )
      })),

      setVendorMap: (vendorMap) => set({ vendorMap }),

      setVendorLocations: (vendorId, locations) => set((state) => ({
        vendorLocations: {
          ...state.vendorLocations,
          [vendorId]: locations
        }
      }))
    }),
    {
      name: 'vendor-storage'
    }
  )
);