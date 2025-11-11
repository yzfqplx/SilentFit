
import { useCallback } from 'react';
import type { TrainingPlanItem } from '../types/Training';
import { webStore } from '../utils/webStore';
import type { DataAPI } from '../types/data';

const getDataStore = (): DataAPI => {
  return (window.api as unknown as DataAPI) ? (window.api as unknown as DataAPI) : webStore;
};

export const useTrainingPlanData = (
  items: TrainingPlanItem[],
  setItems: React.Dispatch<React.SetStateAction<TrainingPlanItem[]>>,
  fetchRecords: (collection: 'training' | 'metrics' | 'trainingPlan', setter: Function) => Promise<void>
) => {
  const addTrainingPlanItem = useCallback(async (title: string, dueDate?: Date, repeat?: string, reminder?: Date) => {
    const store = getDataStore();
    const newItem: Omit<TrainingPlanItem, '_id'> = {
      title,
      completed: false,
      createdAt: new Date(),
      dueDate,
      repeat,
      reminder,
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
      await store.update('trainingPlan', { _id: id }, { $set: { completed: !completed } }, {});
      fetchRecords('trainingPlan', setItems);
    } catch (error) {
      console.error("Error updating training plan item:", error);
    }
  }, [fetchRecords, setItems]);

  const deleteTrainingPlanItem = useCallback(async (id: string) => {
    const store = getDataStore();
    try {
      await store.remove('trainingPlan', { _id: id }, {});
      fetchRecords('trainingPlan', setItems);
    } catch (error) {
      console.error("Error deleting training plan item:", error);
    }
  }, [fetchRecords, setItems]);

  return {
    trainingPlanItems: items,
    addTrainingPlanItem,
    toggleTrainingPlanItem,
    deleteTrainingPlanItem,
  };
};
