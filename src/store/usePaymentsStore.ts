import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PaymentType = 'Incoming' | 'Outgoing';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Overdue';

export interface Payment {
  id: string;
  type: PaymentType;
  party: string; // client or vendor name
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  eventName: string;
  invoiceRef: string;
}

interface PaymentsState {
  payments: Payment[];
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  togglePaidStatus: (id: string) => void;
}

const seedPayments: Payment[] = [
  { id: 'P-001', type: 'Incoming', party: 'Acme Corp', amount: 75000, dueDate: '2024-09-15', status: 'Paid', eventName: 'TechCon 2024', invoiceRef: 'INV-1001' },
  { id: 'P-002', type: 'Incoming', party: 'Acme Corp', amount: 75000, dueDate: '2024-10-15', status: 'Unpaid', eventName: 'TechCon 2024', invoiceRef: 'INV-1002' },
  { id: 'P-003', type: 'Incoming', party: 'Creative M', amount: 50000, dueDate: '2024-08-10', status: 'Overdue', eventName: 'Marketing Kickoff', invoiceRef: 'INV-1003' },
  { id: 'P-004', type: 'Incoming', party: 'HealthCare Inc', amount: 220000, dueDate: '2024-10-20', status: 'Paid', eventName: 'Global Health Summit', invoiceRef: 'INV-1004' },
  { id: 'P-005', type: 'Outgoing', party: 'Gourmet Bites', amount: 25000, dueDate: '2024-10-10', status: 'Unpaid', eventName: 'TechCon 2024', invoiceRef: 'VEN-2001' },
  { id: 'P-006', type: 'Outgoing', party: 'Sonic Sound & Vision', amount: 15000, dueDate: '2024-10-10', status: 'Paid', eventName: 'TechCon 2024', invoiceRef: 'VEN-2002' },
  { id: 'P-007', type: 'Outgoing', party: 'Elegant Events', amount: 18000, dueDate: '2024-11-15', status: 'Unpaid', eventName: 'Global Health Summit', invoiceRef: 'VEN-2003' },
  { id: 'P-008', type: 'Outgoing', party: 'Lens Magic', amount: 5000, dueDate: '2024-08-01', status: 'Paid', eventName: 'Annual Retreat', invoiceRef: 'VEN-2004' },
  { id: 'P-009', type: 'Outgoing', party: 'Sweet Tooth Bakery', amount: 2000, dueDate: '2024-09-05', status: 'Overdue', eventName: 'Marketing Kickoff', invoiceRef: 'VEN-2005' },
  { id: 'P-010', type: 'Incoming', party: 'Venture Cap LLC', amount: 120000, dueDate: '2024-06-20', status: 'Paid', eventName: 'Investor Day', invoiceRef: 'INV-1005' },
];

export const usePaymentsStore = create<PaymentsState>()(
  persist(
    (set) => ({
      payments: seedPayments,
      addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
      updatePayment: (id, updatedPayment) => set((state) => ({
        payments: state.payments.map((p) => (p.id === id ? { ...p, ...updatedPayment } : p)),
      })),
      deletePayment: (id) => set((state) => ({
        payments: state.payments.filter((p) => p.id !== id),
      })),
      togglePaidStatus: (id) => set((state) => ({
        payments: state.payments.map((p) => {
          if (p.id === id) {
            return { ...p, status: p.status === 'Paid' ? 'Unpaid' : 'Paid' };
          }
          return p;
        })
      }))
    }),
    {
      name: 'payments-storage',
    }
  )
);
