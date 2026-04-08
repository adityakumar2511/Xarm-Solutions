import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VendorCategory = 'Catering' | 'AV' | 'Decor' | 'Logistics' | 'Photography' | 'Security';
export type VendorStatus = 'Active' | 'Inactive';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactName: string;
  email: string;
  phone: string;
  services: string[];
  rating: number; // 1-5
  status: VendorStatus;
}

interface VendorsState {
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, vendor: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
}

const seedVendors: Vendor[] = [
  { id: 'V-001', name: 'Gourmet Bites', category: 'Catering', contactName: 'Chef Remy', email: 'hello@gourmetbites.com', phone: '555-0101', services: ['Buffet', 'Plated', 'Bar'], rating: 4.8, status: 'Active' },
  { id: 'V-002', name: 'Sonic Sound & Vision', category: 'AV', contactName: 'Mike Watts', email: 'mike@sonicsv.com', phone: '555-0102', services: ['Lighting', 'Sound Systems', 'Projection'], rating: 4.5, status: 'Active' },
  { id: 'V-003', name: 'Elegant Events', category: 'Decor', contactName: 'Sarah Jenkins', email: 'sarah@elegantevents.com', phone: '555-0103', services: ['Floral', 'Draping', 'Centerpieces'], rating: 4.9, status: 'Active' },
  { id: 'V-004', name: 'FastMove Logistics', category: 'Logistics', contactName: 'Tom Courier', email: 'tom@fastmove.com', phone: '555-0104', services: ['Transport', 'Setup', 'Teardown'], rating: 3.8, status: 'Inactive' },
  { id: 'V-005', name: 'Lens Magic', category: 'Photography', contactName: 'Emily Shutter', email: 'emily@lensmagic.com', phone: '555-0105', services: ['Event Coverage', 'Portraits', 'Video'], rating: 4.7, status: 'Active' },
  { id: 'V-006', name: 'IronGuard', category: 'Security', contactName: 'Officer Davis', email: 'contact@ironguard.com', phone: '555-0106', services: ['Access Control', 'VIP Protection'], rating: 4.2, status: 'Active' },
  { id: 'V-007', name: 'Sweet Tooth Bakery', category: 'Catering', contactName: 'Jane Dough', email: 'jane@sweettooth.com', phone: '555-0107', services: ['Desserts', 'Custom Cakes'], rating: 4.6, status: 'Active' },
  { id: 'V-008', name: 'Elite Stage', category: 'AV', contactName: 'Dave Rigger', email: 'dave@elitestage.com', phone: '555-0108', services: ['Staging', 'Rigging'], rating: 4.4, status: 'Active' },
];

export const useVendorsStore = create<VendorsState>()(
  persist(
    (set) => ({
      vendors: seedVendors,
      addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
      updateVendor: (id, updatedVendor) => set((state) => ({
        vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...updatedVendor } : v)),
      })),
      deleteVendor: (id) => set((state) => ({
        vendors: state.vendors.filter((v) => v.id !== id),
      })),
    }),
    {
      name: 'vendors-storage',
    }
  )
);
