import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type VersionStatus = 'Draft' | 'Approved' | 'Rejected';
export type VersionLabel = 'v1' | 'v2' | 'v3';

export interface LineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  total: number;
}

export interface Version {
  id: string;
  version: VersionLabel;
  items: LineItem[];
  status: VersionStatus;
  createdAt: string;
}

export interface Estimate {
  id: string;
  clientName: string;
  eventName: string;
  versions: Version[];
}

interface EstimatesState {
  estimates: Estimate[];
  addEstimate: (estimate: Estimate) => void;
  updateEstimate: (id: string, estimate: Partial<Estimate>) => void;
  deleteEstimate: (id: string) => void;
  duplicateVersion: (estimateId: string, versionId: string) => void;
  markApproved: (estimateId: string, versionId: string) => void;
}

const seedEstimates: Estimate[] = [
  {
    id: 'EST-001',
    clientName: 'Acme Corp',
    eventName: 'TechCon 2024',
    versions: [
      { id: 'V-101', version: 'v1', status: 'Draft', createdAt: '2024-05-01', items: [{ id: 'L-1', description: 'Venue Rental', qty: 1, rate: 50000, total: 50000 }, { id: 'L-2', description: 'AV Equipment', qty: 1, rate: 25000, total: 25000 }] },
      { id: 'V-102', version: 'v2', status: 'Approved', createdAt: '2024-05-15', items: [{ id: 'L-1', description: 'Venue Rental', qty: 1, rate: 50000, total: 50000 }, { id: 'L-2', description: 'AV Equipment', qty: 1, rate: 30000, total: 30000 }] }
    ]
  },
  {
    id: 'EST-002',
    clientName: 'HealthCare Inc',
    eventName: 'Global Health Summit',
    versions: [
      { id: 'V-201', version: 'v1', status: 'Rejected', createdAt: '2024-06-10', items: [{ id: 'L-3', description: 'Catering', qty: 500, rate: 150, total: 75000 }] },
      { id: 'V-202', version: 'v2', status: 'Draft', createdAt: '2024-06-25', items: [{ id: 'L-3', description: 'Catering', qty: 500, rate: 120, total: 60000 }, { id: 'L-4', description: 'Decor', qty: 1, rate: 15000, total: 15000 }] }
    ]
  },
  {
    id: 'EST-003',
    clientName: 'Finance Bros',
    eventName: 'Annual Retreat',
    versions: [
      { id: 'V-301', version: 'v1', status: 'Approved', createdAt: '2024-04-05', items: [{ id: 'L-5', description: 'Hotel Block', qty: 100, rate: 300, total: 30000 }, { id: 'L-6', description: 'Activities', qty: 1, rate: 20000, total: 20000 }] }
    ]
  }
];

export const useEstimatesStore = create<EstimatesState>()(
  persist(
    (set) => ({
      estimates: seedEstimates,
      addEstimate: (estimate) => set((state) => ({ estimates: [...state.estimates, estimate] })),
      updateEstimate: (id, updatedEstimate) => set((state) => ({
        estimates: state.estimates.map((e) => (e.id === id ? { ...e, ...updatedEstimate } : e)),
      })),
      deleteEstimate: (id) => set((state) => ({
        estimates: state.estimates.filter((e) => e.id !== id),
      })),
      duplicateVersion: (estimateId, versionId) => set((state) => {
        return {
          estimates: state.estimates.map(est => {
            if (est.id !== estimateId) return est;
            const sourceVersion = est.versions.find(v => v.id === versionId);
            if (!sourceVersion) return est;
            
            let newVersionLabel: VersionLabel = 'v1';
            if (est.versions.length === 1) newVersionLabel = 'v2';
            else if (est.versions.length >= 2) newVersionLabel = 'v3';

            const newVersion: Version = {
              ...sourceVersion,
              id: `V-${Math.floor(Math.random() * 10000)}`,
              version: newVersionLabel,
              status: 'Draft',
              createdAt: new Date().toISOString().split('T')[0],
              items: sourceVersion.items.map(item => ({ ...item, id: `L-${Math.floor(Math.random() * 10000)}` }))
            };
            return { ...est, versions: [...est.versions, newVersion] };
          })
        };
      }),
      markApproved: (estimateId, versionId) => set((state) => ({
        estimates: state.estimates.map(est => {
          if (est.id !== estimateId) return est;
          return {
            ...est,
            versions: est.versions.map(v => ({
              ...v,
              status: v.id === versionId ? 'Approved' : (v.status === 'Approved' ? 'Rejected' : v.status)
            }))
          };
        })
      }))
    }),
    {
      name: 'estimates-storage',
    }
  )
);
