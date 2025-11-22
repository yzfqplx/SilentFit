
import React, { useState, useCallback, useMemo } from 'react';
import type { TrainingRecord } from '../types/data';
import { STRENGTH_ACTIVITIES } from '../constants/activities';
import { normalizeActivity } from '../utils/data';
import { calculate1RM } from '../utils/calculations';
import { generateRecommendation } from '../utils/recommendations';
import type { Page } from '../types/data';
import { dataApi } from '../lib/tauri'; // Import dataApi

// Helper to get the data store (Tauri API)
const getDataStore = () => {
  return dataApi;
};

// --- useTrainingData Hook ---
export const useTrainingData = (
  records: TrainingRecord[],
  setRecords: React.Dispatch<React.SetStateAction<TrainingRecord[]>>,
  fetchRecords: (collection: 'training' | 'metrics', setter: Function) => Promise<void>,
  showAlert: (message: string) => void,
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>
) => {
  const [formData, setFormData] = useState<Partial<TrainingRecord>>({
    type: 'Weightlifting',
    activity: STRENGTH_ACTIVITIES[0],
    date: new Date().toISOString().substring(0, 10),
    sets: 4,
    reps: 12,
    weightKg: 0,
    notes: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string>(STRENGTH_ACTIVITIES[0]);
  const [trendRange, setTrendRange] = useState<'7' | '30' | '90' | 'all'>('7');

  const handleRecordChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  }, []);

  const handleRecordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("[handleRecordSubmit] called.");
    console.log("[handleRecordSubmit] Current editingId:", editingId);
    console.log("[handleRecordSubmit] Current formData (before validation):", formData);

    const missing: string[] = [];
    if (!formData.activity) missing.push('训练项目');
    if (!formData.date) missing.push('日期');
    // 注意：这里保留了原始的重量限制校验，您可以根据需要调整
    if (formData.weightKg === undefined || (formData.weightKg as number) < 0 || (formData.weightKg as number) > 300) missing.push('重量');
    if (formData.sets === undefined || (formData.sets as number) < 1) missing.push('组数');
    if (formData.reps === undefined || (formData.reps as number) < 1) missing.push('次数');
    if (missing.length) {
      showAlert(`请检查以下字段：${missing.join('、')}`);
      return;
    }
    const store = getDataStore();

    try {
      const recordToSave = {
        ...formData,
        type: 'Weightlifting',
        sets: formData.sets ?? 4,
        reps: formData.reps ?? 12,
        weightKg: formData.weightKg ?? 0,
        notes: '',
      } as TrainingRecord;

      if (editingId) {
        console.log("Performing update for record:", editingId, "with data:", recordToSave);
        const { createdAt, ...updateData } = recordToSave;
        await store.update('training', { _id: editingId }, { ...updateData, updatedAt: new Date() }, {});
        setEditingId(null);
        console.log("Training Record updated successfully! editingId reset to null.");
      } else {
        console.log("Performing insert for new record with data:", recordToSave);
        // Explicitly remove _id for new inserts, as backend generates it
        const { _id, ...newRecordData } = recordToSave;
        await store.insert('training', { ...newRecordData, createdAt: new Date() });
        console.log("Training Record added successfully!");
      }

      setFormData(prev => ({
        ...prev,
        type: 'Weightlifting',
        activity: STRENGTH_ACTIVITIES[0],
        date: new Date().toISOString().substring(0, 10),
        sets: 4,
        reps: 12,
        weightKg: 0,
        notes: '',
      }));
      fetchRecords('training', setRecords);

    } catch (error) {
      console.error("Error saving training record:", error);
    }
  }, [formData, editingId, fetchRecords, setRecords, showAlert]);

  const handleRecordEdit = useCallback((record: TrainingRecord) => {
    setEditingId(record._id);
    const { createdAt, ...formRecord } = record;
    setFormData(formRecord);
    setCurrentPage('records');
  }, [setCurrentPage]);

  const handleRecordDelete = useCallback(async (id: string) => {
    const store = getDataStore();
    if (!store) return;
    try {
      await store.remove('training', { _id: id }, {});
      console.log("Training Record deleted successfully!");
      fetchRecords('training', setRecords);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }, [fetchRecords, setRecords]);

  const handleCancelRecordEdit = useCallback(() => {
    setEditingId(null);
    setFormData({
        type: 'Weightlifting',
        activity: STRENGTH_ACTIVITIES[0],
        date: new Date().toISOString().substring(0, 10),
        sets: 4,
        reps: 12,
        weightKg: 0,
        notes: ''
    });
  }, []);

  const handleMarkAsComplete = useCallback(async (id: string) => {
    const store = getDataStore();
    if (!store) return;
    try {
      await store.update('training', { _id: id }, { completed: true, updatedAt: new Date() }, {});
      console.log("Training Record marked as complete!");
      fetchRecords('training', setRecords);
    } catch (error) {
      console.error("Error marking record as complete:", error);
    }
  }, [fetchRecords, setRecords]);

  const recommendation = useMemo(() => {
    const lastWorkout = records
      .filter(r => r.activity === selectedActivity && r.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return generateRecommendation(lastWorkout);
  }, [records, selectedActivity]);


  const totalWeightliftingSessions = records.filter(r => r.type === 'Weightlifting').length;
  const totalSets = records.reduce((sum, r) => sum + (r.sets || 0), 0);

  const maxWeightByActivity = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => {
      if (!r.activity) return;
      const key = normalizeActivity(r.activity);
      map[key] = Math.max(map[key] || 0, r.weightKg || 0);
    });
    return Object.entries(map)
      .map(([activity, maxW]) => ({ activity, maxW }))
      .sort((a, b) => b.maxW - a.maxW)
      .slice(0, 10);
  }, [records]);

  const activityTrendData = useMemo(() => {
    const target = selectedActivity;
    let data = records
      .filter(r => normalizeActivity(r.activity) === target)
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (trendRange !== 'all') {
      const days = trendRange === '7' ? 7 : (trendRange === '30' ? 30 : 90);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      data = data.filter(d => new Date(d.date) >= cutoff);
    }

    return data.map(r => ({ date: r.date, weightKg: r.weightKg || 0, reps: r.reps || 0 }));
  }, [records, selectedActivity, trendRange]);

  const oneRepMaxData = useMemo(() => {
    const target = selectedActivity;
    let data = records
      .filter(r => normalizeActivity(r.activity) === target)
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({ date: r.date, estimated1RM: calculate1RM(r.weightKg || 0, r.reps || 0) }));
    if (trendRange !== 'all') {
      const days = trendRange === '7' ? 7 : (trendRange === '30' ? 30 : 90);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      data = data.filter(d => new Date(d.date) >= cutoff);
    }
    return data;
  }, [records, selectedActivity, trendRange]);

  const oneRepMaxTrend = useMemo(() => {
    if (oneRepMaxData.length < 2) {
      return { latest1RM: null, trend: null };
    }
    const oldest1RM = oneRepMaxData[0].estimated1RM;
    const latest1RM = oneRepMaxData[oneRepMaxData.length - 1].estimated1RM;
    const trend = ((latest1RM - oldest1RM) / oldest1RM) * 100;
    return { latest1RM, trend };
  }, [oneRepMaxData]);

  return {
    formData,
    setFormData,
    editingId,
    setEditingId,
    selectedActivity,
    setSelectedActivity,
    trendRange,
    setTrendRange,
    handleRecordChange,
    handleRecordSubmit,
    handleRecordEdit,
    handleRecordDelete,
    handleCancelRecordEdit,
    handleMarkAsComplete,
    totalWeightliftingSessions,
    totalSets,
    maxWeightByActivity,
    activityTrendData,
    oneRepMaxData,
    recommendation,
    oneRepMaxTrend,
  };
};