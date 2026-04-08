import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuoteStatus = 'Pending' | 'Received' | 'Approved';

export interface Quote {
  id: string;
  vendorId: string;
  vendorName: string;
  eventName: string;
  amount: number;
  status: QuoteStatus;
  submittedDate: string;
  validUntil: string;
  notes: string;
}

interface QuotesState {
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
}

const seedQuotes: Quote[] = [
  { id: 'Q-001', vendorId: 'V-001', vendorName: 'Gourmet Bites', eventName: 'TechCon 2024', amount: 25000, status: 'Approved', submittedDate: '2024-08-01', validUntil: '2024-08-31', notes: 'Includes premium open bar' },
  { id: 'Q-002', vendorId: 'V-002', vendorName: 'Sonic Sound & Vision', eventName: 'TechCon 2024', amount: 15000, status: 'Approved', submittedDate: '2024-08-05', validUntil: '2024-09-05', notes: 'Full stage AV' },
  { id: 'Q-003', vendorId: 'V-003', vendorName: 'Elegant Events', eventName: 'Global Health Summit', amount: 18000, status: 'Received', submittedDate: '2024-09-10', validUntil: '2024-10-10', notes: 'Floral and draping' },
  { id: 'Q-004', vendorId: 'V-005', vendorName: 'Lens Magic', eventName: 'Product Launch V5', amount: 6500, status: 'Pending', submittedDate: '2024-10-01', validUntil: '2024-10-31', notes: '2 shooters + video' },
  { id: 'Q-005', vendorId: 'V-006', vendorName: 'IronGuard', eventName: 'Investor Day', amount: 4000, status: 'Approved', submittedDate: '2024-05-15', validUntil: '2024-06-15', notes: '4 guards for 8 hours' },
  { id: 'Q-006', vendorId: 'V-008', vendorName: 'Elite Stage', eventName: 'TechCon 2024', amount: 12000, status: 'Received', submittedDate: '2024-08-10', validUntil: '2024-09-10', notes: 'Main stage rigging' },
  { id: 'Q-007', vendorId: 'V-001', vendorName: 'Gourmet Bites', eventName: 'Global Health Summit', amount: 45000, status: 'Pending', submittedDate: '2024-09-15', validUntil: '2024-10-15', notes: 'Plated dinner for 500' },
  { id: 'Q-008', vendorId: 'V-007', vendorName: 'Sweet Tooth Bakery', eventName: 'Annual Retreat', amount: 1500, status: 'Approved', submittedDate: '2024-06-01', validUntil: '2024-07-01', notes: 'Custom branded cookies' },
];

export const useQuotesStore = create<QuotesState>()(
  persist(
    (set) => ({
      quotes: seedQuotes,
      addQuote: (quote) => set((state) => ({ quotes: [...state.quotes, quote] })),
      updateQuote: (id, updatedQuote) => set((state) => ({
        quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updatedQuote } : q)),
      })),
      deleteQuote: (id) => set((state) => ({
        quotes: state.quotes.filter((q) => q.id !== id),
      })),
    }),
    {
      name: 'quotes-storage',
    }
  )
);
