
import { useState, useEffect, useCallback } from 'react';
import type { TrainingRecord, MetricRecord } from '../types/data';
import type { TrainingPlanItem } from '../types/Training';
import { dataApi } from '../lib/tauri'; // Import dataApi

// Helper to get the data store (Tauri API)
const getDataStore = () => {
  return dataApi;
};

// --- useDataFetching Hook ---
export const useDataFetching = (authReady: boolean) => {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [metrics, setMetrics] = useState<MetricRecord[]>([]);
  const [trainingPlanItems, setTrainingPlanItems] = useState<TrainingPlanItem[]>([]);

  const fetchRecords = useCallback(async (collection: 'training' | 'metrics' | 'trainingPlan', setter: Function) => {
    const store = getDataStore();
    if (!authReady || !store) return;
    try {
      const foundRecords = (await store.find(collection, {})) as any[];
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
      if (collection === 'trainingPlan') {
        setter(normalized.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
      } else {
        setter(normalized.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (e) {
      // console.error(`Failed to fetch ${collection} records:`, e); // Keeping this commented out for now.
    }
  }, [authReady]);

  useEffect(() => {
    fetchRecords('training', setRecords);
    fetchRecords('metrics', setMetrics);
    fetchRecords('trainingPlan', setTrainingPlanItems);
    
    const interval = setInterval(() => {
      fetchRecords('training', setRecords);
      fetchRecords('metrics', setMetrics);
      fetchRecords('trainingPlan', setTrainingPlanItems);
    }, 5000); 
    return () => clearInterval(interval);
  }, [fetchRecords]);

  return { records, setRecords, metrics, setMetrics, trainingPlanItems, setTrainingPlanItems, fetchRecords };
};
