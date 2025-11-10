
import { useState, useEffect, useCallback } from 'react';
import type { TrainingRecord, MetricRecord, DataAPI } from '../types/data';
import { webStore } from '../utils/webStore';

// Helper to get the data store (Electron API or webStore)
const getDataStore = (): DataAPI => {
  return (window.api as unknown as DataAPI) ? (window.api as unknown as DataAPI) : webStore;
};

// --- useDataFetching Hook ---
export const useDataFetching = (authReady: boolean) => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);

  const fetchRecords = useCallback(async (collection: 'training' | 'metrics', setter: Function) => {
    const store: DataAPI = getDataStore();
    if (!authReady || !store) return;
    try {
      const foundRecords: any[] = await store.find(collection, {});
      const normalized = foundRecords.map(r => {
        if (collection === 'metrics') {
          return {
            shoulderCm: 0,
            chestCm: 0,
            armCm: 0,
            waistCm: 0,
            weightKg: 0,
            ...r,
          } as MetricRecord;
        }
        if (collection === 'training') {
          return {
            sets: r.sets ?? 0,
            reps: r.reps ?? 0,
            weightKg: r.weightKg ?? 0,
            ...r,
          } as TrainingRecord;
        }
        return r;
      });
      setter(normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (e) {
      console.error(`Failed to fetch ${collection} records:`, e);
    }
  }, [authReady]);

  useEffect(() => {
    fetchRecords('training', setRecords);
    fetchRecords('metrics', setMetrics);
    
    const interval = setInterval(() => {
      fetchRecords('training', setRecords);
      fetchRecords('metrics', setMetrics);
    }, 5000); 
    return () => clearInterval(interval);
  }, [fetchRecords]);

  return { records, setRecords, metrics, setMetrics, fetchRecords };
};
