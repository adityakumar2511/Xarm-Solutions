import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ElementStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Reserved';
export type ElementCategory = 'AV Equipment' | 'Furniture' | 'Decor' | 'Lighting' | 'Signage';

export interface ElementItem {
  id: string;
  name: string;
  category: ElementCategory;
  quantity: number;
  price: number;
  status: ElementStatus;
}

interface ElementsState {
  elements: ElementItem[];
  addElement: (element: ElementItem) => void;
  updateElement: (id: string, element: Partial<ElementItem>) => void;
  deleteElement: (id: string) => void;
}

const seedElements: ElementItem[] = [
  { id: 'EL-001', name: 'LED Uplight', category: 'Lighting', quantity: 45, price: 25, status: 'In Stock' },
  { id: 'EL-002', name: 'Lounge Chair - White Leather', category: 'Furniture', quantity: 12, price: 150, status: 'Low Stock' },
  { id: 'EL-003', name: 'Projector 10K Lumen', category: 'AV Equipment', quantity: 2, price: 800, status: 'Reserved' },
  { id: 'EL-004', name: 'Pipe and Drape - Black (10ft)', category: 'Decor', quantity: 100, price: 15, status: 'In Stock' },
  { id: 'EL-005', name: 'Directional Arrow Sign', category: 'Signage', quantity: 0, price: 35, status: 'Out of Stock' },
  { id: 'EL-006', name: 'Wireless Microphone Set', category: 'AV Equipment', quantity: 8, price: 120, status: 'In Stock' },
  { id: 'EL-007', name: 'Highboy Table', category: 'Furniture', quantity: 25, price: 45, status: 'In Stock' },
  { id: 'EL-008', name: 'Floral Centerpiece Base', category: 'Decor', quantity: 5, price: 10, status: 'Low Stock' },
];

export const useElementsStore = create<ElementsState>()(
  persist(
    (set) => ({
      elements: seedElements,
      addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),
      updateElement: (id, updatedElement) => set((state) => ({
        elements: state.elements.map((e) => (e.id === id ? { ...e, ...updatedElement } : e)),
      })),
      deleteElement: (id) => set((state) => ({
        elements: state.elements.filter((e) => e.id !== id),
      })),
    }),
    {
      name: 'elements-storage',
    }
  )
);
