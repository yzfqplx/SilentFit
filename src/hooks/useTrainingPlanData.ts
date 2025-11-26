
import { useCallback } from 'react';
import type { TrainingPlanItem } from '../types/Training';
import type { TrainingRecord } from '../types/data';
import { dataApi } from '../lib/tauri'; // Import dataApi

const getDataStore = () => {
  return dataApi;
};

export const useTrainingPlanData = (
  items: TrainingPlanItem[],
  setItems: React.Dispatch<React.SetStateAction<TrainingPlanItem[]>>,
  fetchRecords: (collection: 'training' | 'metrics' | 'trainingPlan', setter: Function) => Promise<void>,
  setRecords?: React.Dispatch<React.SetStateAction<TrainingRecord[]>>
) => {
  const addTrainingPlanItem = useCallback(async (
    title: string,
    dueDate?: Date,
    repeat?: string,
    reminder?: Date,
    weightKg?: number,
    sets?: number,
    reps?: number
  ) => {
    const store = getDataStore();
    const newItem: Omit<TrainingPlanItem, '_id'> = {
      title,
      completed: false,
      createdAt: new Date(),
      dueDate,
      repeat,
      reminder,
      weightKg,
      sets,
      reps,
    };
    console.log("useTrainingPlanData: Adding new item:", newItem);
    try {
      const insertedItem = await store.insert('trainingPlan', newItem);
      console.log("useTrainingPlanData: Item inserted:", insertedItem);
      fetchRecords('trainingPlan', setItems);
    } catch (error) {
      console.error("Error adding training plan item:", error);
    }
  }, [fetchRecords, setItems]);

  const toggleTrainingPlanItem = useCallback(async (id: string, completed: boolean) => {
    const store = getDataStore();
    try {
      const item = items.find(i => i._id === id);
      if (!item) return;

      if (completed) {
        const newRecord: Omit<TrainingRecord, '_id'> = {
          type: 'Weightlifting',
          activity: item.title,
          date: new Date().toISOString().substring(0, 10),
          sets: item.sets || 0,
          reps: item.reps || 0,
          weightKg: item.weightKg || 0,
          notes: 'Completed from Training Plan',
          completed: true,
          createdAt: new Date()
        };
        const insertedRecord = await store.insert('training', newRecord) as TrainingRecord;
        await store.update('trainingPlan', { _id: id }, { completed: true, relatedRecordId: insertedRecord._id }, {});
      } else {
        if (item.relatedRecordId) {
          await store.remove('training', { _id: item.relatedRecordId }, {});
        }
        await store.update('trainingPlan', { _id: id }, { completed: false, relatedRecordId: null }, {});
      }

      if (setRecords) {
        fetchRecords('training', setRecords);
      }
      fetchRecords('trainingPlan', setItems);
    } catch (error) {
      console.error("Error updating training plan item:", error);
    }
  }, [fetchRecords, setItems, items, setRecords]);

  const deleteTrainingPlanItem = useCallback(async (id: string) => {
    const store = getDataStore();
    try {
      const item = items.find(i => i._id === id);
      if (item && item.relatedRecordId) {
        await store.remove('training', { _id: item.relatedRecordId }, {});
        if (setRecords) {
          fetchRecords('training', setRecords);
        }
      }
      await store.remove('trainingPlan', { _id: id }, {});
      fetchRecords('trainingPlan', setItems);
    } catch (error) {
      console.error("Error deleting training plan item:", error);
    }
  }, [fetchRecords, setItems, items, setRecords]);

  return {
    trainingPlanItems: items,
    addTrainingPlanItem,
    toggleTrainingPlanItem,
    deleteTrainingPlanItem,
  };
};
