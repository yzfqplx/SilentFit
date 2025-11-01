import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TrainingRecord, MetricRecord, DataAPI, Page } from '../types/data';
import { webStore } from './webStore';
import { STRENGTH_ACTIVITIES } from '../constants/activities';
import { normalizeActivity } from './data';

// Helper to get the data store (Electron API or webStore)
const getDataStore = (): DataAPI => {
  return (window as any).api ? window.api : webStore;
};

// --- BMI 分类数据 ---
interface BmiCategory {
  range: string;
  category: string;
}

const BMI_CATEGORIES: BmiCategory[] = [
  { range: '< 18.5', category: '体重过低' },
  { range: '18.5 - 23.9', category: '体重正常' },
  { range: '24.0 - 27.9', category: '超重' },
  { range: '≥ 28.0', category: '肥胖' },
];

// --- 肩腰比分类数据 ---
interface ShoulderWaistRatioCategory {
  range: string;
  visualFeature: string;
  adjectives: string;
}

const SHOULDER_WAIST_RATIO_CATEGORIES: ShoulderWaistRatioCategory[] = [
  { range: '≈ 1:1 或更小', visualFeature: '肩膀、腰部、臀部宽度接近。', adjectives: '直筒' },
  { range: '≈ 1.1:1 ~ 1.2:1', visualFeature: '稍微有腰部收窄的趋势，但不够明显。', adjectives: '匀称' },
  { range: '≈ 1.2:1 ~ 1.3:1', visualFeature: '初步的收窄，体型开始呈现线条感。', adjectives: '标准' },
  { range: '≈ 1.3:1 ~ 1.4:1', visualFeature: '腰部收窄明显，开始体现出良好的身体线条。', adjectives: '比例良好' },
  { range: '≈ 1.4:1 ~ 1.5:1', visualFeature: '腰部纤细，肩膀突出，体型呈现显著的V型或沙漏型。', adjectives: '宽肩窄腰' },
  { range: '≈ 1.5:1 或更大', visualFeature: '肩宽明显大于腰围，差距悬殊。', adjectives: '倒三角' },
];

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

// --- useTrainingData Hook ---
export const useTrainingData = (records: TrainingRecord[], setRecords: React.Dispatch<React.SetStateAction<TrainingRecord[]>>, fetchRecords: (collection: 'training' | 'metrics', setter: Function) => Promise<void>) => {
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
  const [trendRange, setTrendRange] = useState<'30' | '90' | 'all'>('all');

  const handleRecordChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
  }, []);

  const handleRecordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];
    if (!formData.activity) missing.push('训练项目');
    if (!formData.date) missing.push('日期');
    if (formData.weightKg === undefined || (formData.weightKg as number) < 0 || (formData.weightKg as number) > 300) missing.push('重量');
    if (formData.sets === undefined || (formData.sets as number) < 1) missing.push('组数');
    if (formData.reps === undefined || (formData.reps as number) < 1) missing.push('次数');
    if (missing.length) {
      alert(`请检查以下字段：${missing.join('、')}`);
      return;
    }
    const store: DataAPI = getDataStore();

    try {
      const recordToSave = { 
        ...formData, 
        type: 'Weightlifting',
        sets: formData.sets ?? 4,
        reps: formData.reps ?? 12,
        weightKg: formData.weightKg ?? 0,
        notes: formData.notes || ''
      } as TrainingRecord;

      if (editingId) {
        const { createdAt, ...updateData } = recordToSave;
        await store.update('training', { _id: editingId }, { $set: { ...updateData, updatedAt: new Date() } }, {});
        setEditingId(null);
        console.log("Training Record updated successfully!");
      } else {
        await store.insert('training', { ...recordToSave, createdAt: new Date() });
        console.log("Training Record added successfully!");
      }

      setFormData({
        type: 'Weightlifting',
        activity: STRENGTH_ACTIVITIES[0],
        date: new Date().toISOString().substring(0, 10),
        sets: 4,
        reps: 12,
        weightKg: 0,
        notes: '',
      });
      fetchRecords('training', setRecords);

    } catch (error) {
      console.error("Error saving training record:", error);
    }
  }, [formData, editingId, fetchRecords, setRecords]);

  const handleRecordEdit = useCallback((record: TrainingRecord, setCurrentPage: React.Dispatch<React.SetStateAction<Page>>) => {
    setEditingId(record._id);
    const { createdAt, ...formRecord } = record;
    setFormData(formRecord); 
    setCurrentPage('records');
  }, []);

  const handleRecordDelete = useCallback(async (id: string, confirm: (message: string) => boolean) => {
    const store: DataAPI = getDataStore();
    if (!store || !confirm(`确认删除此训练记录吗?`)) return;
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
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(r => ({ date: r.date, weightKg: r.weightKg || 0, reps: r.reps || 0 }));
    if (trendRange !== 'all') {
      const days = trendRange === '30' ? 30 : 90;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      data = data.filter(d => new Date(d.date) >= cutoff);
    }
    return data;
  }, [records, selectedActivity, trendRange]);

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
    totalWeightliftingSessions,
    totalSets,
    maxWeightByActivity,
    activityTrendData,
  };
};

// --- useMetricData Hook ---
export const useMetricData = (metrics: MetricRecord[], setMetrics: React.Dispatch<React.SetStateAction<MetricRecord[]>>, fetchRecords: (collection: 'training' | 'metrics', setter: Function) => Promise<void>) => {
  const [metricFormData, setMetricFormData] = useState<Partial<MetricRecord>>({
    date: new Date().toISOString().substring(0, 10),
    shoulderCm: 0,
    chestCm: 0,
    armCm: 0,
    waistCm: 0,
    weightKg: 0,
    notes: '',
  });
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);

  const handleMetricChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMetricFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  }, []);

  const handleMetricSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricFormData.date) {
      alert('请选择日期');
      return;
    }
    const nums = [metricFormData.shoulderCm, metricFormData.chestCm, metricFormData.armCm, metricFormData.waistCm, metricFormData.weightKg]
      .map(v => (v === undefined || v === null ? 0 : Number(v<=300?v:0)));
    if (nums.some(v => v < 0)) {
      alert('测量值需为非负数');
      return;
    }
    if (nums.every(v => v === 0)) {
      alert('请重新填写正确的测量值');
      return;
    }
    const store: DataAPI = getDataStore();

    try {
        const metricToSave = {
            ...metricFormData,
            shoulderCm: metricFormData.shoulderCm || 0,
            chestCm: metricFormData.chestCm || 0,
            armCm: metricFormData.armCm || 0,
            waistCm: metricFormData.waistCm || 0,
            weightKg: metricFormData.weightKg || 0,
            notes: metricFormData.notes || '',
        } as MetricRecord;

        if (editingMetricId) {
            const { createdAt, ...updateData } = metricToSave;
            await store.update('metrics', { _id: editingMetricId }, { $set: { ...updateData, updatedAt: new Date() } }, {});
            setEditingMetricId(null);
            console.log("Metric Record updated successfully!");
        } else {
            await store.insert('metrics', { ...metricToSave, createdAt: new Date() });
            console.log("Metric Record added successfully!");
        }

        setMetricFormData({
            date: new Date().toISOString().substring(0, 10),
            shoulderCm: 0, chestCm: 0, armCm: 0, waistCm: 0, weightKg: 0, notes: ''
        });
        fetchRecords('metrics', setMetrics);

    } catch (error) {
        console.error("Error saving metric record:", error);
    }
  }, [metricFormData, editingMetricId, fetchRecords, setMetrics]);

  const handleMetricEdit = useCallback((metric: MetricRecord, setCurrentPage: React.Dispatch<React.SetStateAction<Page>>) => {
    setEditingMetricId(metric._id);
    const { createdAt, ...formMetric } = metric;
    setMetricFormData(formMetric);
    setCurrentPage('metrics');
  }, []);
  
  const handleMetricDelete = useCallback(async (id: string, confirm: (message: string) => boolean) => {
    const store: DataAPI = getDataStore();
    if (!store || !confirm(`确认删除此围度记录吗?`)) return;
    try {
      await store.remove('metrics', { _id: id }, {});
      console.log("Metric Record deleted successfully!");
      fetchRecords('metrics', setMetrics);
    } catch (error) {
      console.error("Error deleting metric record:", error);
    }
  }, [fetchRecords, setMetrics]);

  const handleCancelMetricEdit = useCallback(() => {
    setEditingMetricId(null); 
    setMetricFormData({ 
        date: new Date().toISOString().substring(0, 10), 
        shoulderCm: 0, chestCm: 0, armCm: 0, waistCm: 0, weightKg: 0, notes: '' 
    });
  }, []);

  const latestMetrics = metrics.length > 0 ? metrics[0] : null; 

  return {
    metricFormData,
    setMetricFormData,
    editingMetricId,
    setEditingMetricId,
    handleMetricChange,
    handleMetricSubmit,
    handleMetricEdit,
    handleMetricDelete,
    handleCancelMetricEdit,
    latestMetrics,
  };
};

// --- useSettingsData Hook ---
export const useSettingsData = () => {
  const [heightCm, setHeightCm] = useState<number | ''>('');
  useEffect(() => {
    const saved = localStorage.getItem('heightCm');
    if (saved) {
      const v = parseFloat(saved);
      if (!Number.isNaN(v) && v > 0) setHeightCm(v);
    }
  }, []);
  useEffect(() => {
    if (typeof heightCm === 'number' && heightCm > 0) {
      localStorage.setItem('heightCm', String(heightCm));
    }
  }, [heightCm]);

  return { heightCm, setHeightCm };
};

// --- useDerivedData Hook ---
export const useDerivedData = (metrics: MetricRecord[], heightCm: number | '') => {
  const latestMetrics = metrics.length > 0 ? metrics[0] : null; 
  
  const shoulderWaistRatio = latestMetrics && latestMetrics.waistCm > 0
    ? (latestMetrics.shoulderCm / latestMetrics.waistCm)
    : null;
  const bmi = latestMetrics && typeof heightCm === 'number' && heightCm > 0 && latestMetrics.weightKg > 0
    ? (latestMetrics.weightKg / Math.pow(heightCm / 100, 2))
    : null;

  const getBmiDescription = useCallback((bmiValue: number | null) => {
    if (bmiValue === null || bmiValue === 0) return { range: 'N/A', category: '数据不足' };
    if (bmiValue < 18.5) return BMI_CATEGORIES[0];
    if (bmiValue >= 18.5 && bmiValue <= 23.9) return BMI_CATEGORIES[1];
    if (bmiValue >= 24.0 && bmiValue <= 27.9) return BMI_CATEGORIES[2];
    return BMI_CATEGORIES[3];
  }, []);

  const getShoulderWaistRatioDescription = useCallback((ratio: number | null) => {
    if (ratio === null || ratio === 0) return { range: 'N/A', visualFeature: '数据不足', adjectives: '数据不足' };
    if (ratio <= 1.0) return SHOULDER_WAIST_RATIO_CATEGORIES[0];
    if (ratio > 1.0 && ratio <= 1.2) return SHOULDER_WAIST_RATIO_CATEGORIES[1];
    if (ratio > 1.2 && ratio <= 1.3) return SHOULDER_WAIST_RATIO_CATEGORIES[2];
    if (ratio > 1.3 && ratio <= 1.4) return SHOULDER_WAIST_RATIO_CATEGORIES[3];
    if (ratio > 1.4 && ratio <= 1.5) return SHOULDER_WAIST_RATIO_CATEGORIES[4];
    return SHOULDER_WAIST_RATIO_CATEGORIES[5];
  }, []);

  const bmiDescription = getBmiDescription(bmi);
  const shoulderWaistRatioDescription = getShoulderWaistRatioDescription(shoulderWaistRatio);

  return {
    latestMetrics,
    shoulderWaistRatio,
    bmi,
    bmiDescription,
    shoulderWaistRatioDescription,
  };
};
