import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventStatus = 'Active' | 'Completed' | 'Cancelled' | 'Upcoming';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Event {
  id: string;
  name: string;
  client: string;
  date: string;
  status: EventStatus;
  assignedTeam: string;
  revenue: number;
  paymentStatus: PaymentStatus;
  margin: number;
  progress: number;
  dueDate: string;
}

interface EventsState {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

const seedEvents: Event[] = [
  { id: 'E-001', name: 'TechCon 2024', client: 'Acme Corp', date: '2024-10-15', status: 'Active', assignedTeam: 'Alpha Team', revenue: 150000, paymentStatus: 'Pending', margin: 35, progress: 60, dueDate: '2024-09-15' },
  { id: 'E-002', name: 'Global Health Summit', client: 'HealthCare Inc', date: '2024-11-20', status: 'Upcoming', assignedTeam: 'Beta Team', revenue: 220000, paymentStatus: 'Paid', margin: 40, progress: 20, dueDate: '2024-10-20' },
  { id: 'E-003', name: 'Annual Retreat', client: 'Finance Bros', date: '2024-08-05', status: 'Completed', assignedTeam: 'Gamma Team', revenue: 85000, paymentStatus: 'Paid', margin: 30, progress: 100, dueDate: '2024-07-05' },
  { id: 'E-004', name: 'Product Launch V5', client: 'TechNova', date: '2024-12-01', status: 'Upcoming', assignedTeam: 'Alpha Team', revenue: 300000, paymentStatus: 'Pending', margin: 45, progress: 15, dueDate: '2024-11-01' },
  { id: 'E-005', name: 'Marketing Kickoff', client: 'Creative M', date: '2024-09-10', status: 'Active', assignedTeam: 'Beta Team', revenue: 50000, paymentStatus: 'Overdue', margin: 25, progress: 80, dueDate: '2024-08-10' },
  { id: 'E-006', name: 'Investor Day', client: 'Venture Cap LLC', date: '2024-07-20', status: 'Completed', assignedTeam: 'Gamma Team', revenue: 120000, paymentStatus: 'Paid', margin: 38, progress: 100, dueDate: '2024-06-20' },
  { id: 'E-007', name: 'Winter Gala', client: 'Entertainment Co', date: '2024-12-15', status: 'Upcoming', assignedTeam: 'Alpha Team', revenue: 75000, paymentStatus: 'Pending', margin: 28, progress: 5, dueDate: '2024-11-15' },
  { id: 'E-008', name: 'Sales Conference', client: 'Global Sales', date: '2024-10-05', status: 'Cancelled', assignedTeam: 'Beta Team', revenue: 0, paymentStatus: 'Pending', margin: 0, progress: 0, dueDate: '2024-09-05' },
];

export const useEventsStore = create<EventsState>()(
  persist(
    (set) => ({
      events: seedEvents,
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, updatedEvent) => set((state) => ({
        events: state.events.map((e) => (e.id === id ? { ...e, ...updatedEvent } : e)),
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id),
      })),
    }),
    {
      name: 'events-storage',
    }
  )
);
