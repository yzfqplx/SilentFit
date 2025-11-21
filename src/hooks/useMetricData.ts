
import React, { useState, useCallback } from 'react';
import type { MetricRecord, Page } from '../types/data';
import { dataApi } from '../lib/tauri'; // Import dataApi

// Helper to get the data store (Tauri API)
const getDataStore = () => {
  return dataApi;
};

// --- useMetricData Hook ---
export const useMetricData = (
  metrics: MetricRecord[], 
  setMetrics: React.Dispatch<React.SetStateAction<MetricRecord[]>>,
  fetchRecords: (collection: 'training' | 'metrics', setter: Function) => Promise<void>,
  showAlert: (message: string) => void,
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>
) => {
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
      // 使用三元表达式来确保空字符串转为 0，防止 NaN 影响后续校验
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    }));
  }, []);

  const handleMetricSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricFormData.date) {
      showAlert('请选择日期');
      return;
    }
    
    // 定义合理的上下限（单位：厘米/千克）
    const MIN_CM = 10;
    const MAX_CM = 300;
    const MIN_KG = 1;
    const MAX_KG = 300;

    const shoulder = metricFormData.shoulderCm || 0;
    const chest = metricFormData.chestCm || 0;
    const arm = metricFormData.armCm || 0;
    const waist = metricFormData.waistCm || 0;
    const weight = metricFormData.weightKg || 0;

    // 收集所有需要检查的数值
    const measurements = [
      { name: '肩围', value: shoulder, min: MIN_CM, max: MAX_CM },
      { name: '胸围', value: chest, min: MIN_CM, max: MAX_CM },
      { name: '臂围', value: arm, min: MIN_CM, max: MAX_CM },
      { name: '腰围', value: waist, min: MIN_CM, max: MAX_CM },
      { name: '体重', value: weight, min: MIN_KG, max: MAX_KG },
    ];

    const invalidFields: string[] = [];

    // 执行范围检查
    measurements.forEach(m => {
      // 仅检查非零的输入值
      if (m.value !== 0) {
        // 检查负数和范围
        if (m.value < 0 || m.value < m.min || m.value > m.max) {
          invalidFields.push(`${m.name} (${m.value.toFixed(1)}${m.name.includes('重') ? 'kg' : 'cm'})`);
        }
      }
    });

    if (invalidFields.length > 0) {
      showAlert(`请检查以下测量值，确保在合理范围内：${invalidFields.join('、')}\n(例如围度在 ${MIN_CM}-${MAX_CM}cm，体重在 ${MIN_KG}-${MAX_KG}kg)`);
      return;
    }

    // 确保用户至少输入了一项有效数据
    if (shoulder === 0 && chest === 0 && arm === 0 && waist === 0 && weight === 0) {
      showAlert('请至少填写一项有效的身体测量值');
      return;
    }
    
    const store = getDataStore();

    try {
        const metricToSave = {
            ...metricFormData,
            shoulderCm: shoulder,
            chestCm: chest,
            armCm: arm,
            waistCm: waist,
            weightKg: weight,
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
  }, [metricFormData, editingMetricId, fetchRecords, setMetrics, showAlert]);

  const handleMetricEdit = useCallback((metric: MetricRecord) => {
    setEditingMetricId(metric._id);
    const { createdAt, ...formMetric } = metric;
    setMetricFormData(formMetric);
    setCurrentPage('metrics');
  }, [setCurrentPage]);
  
  const handleMetricDelete = useCallback(async (id: string) => {
    const store = getDataStore();
    if (!store) return;
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
