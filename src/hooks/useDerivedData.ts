
import { useCallback } from 'react';
import type { MetricRecord } from '../types/data';
import { BMI_CATEGORIES, SHOULDER_WAIST_RATIO_CATEGORIES } from '../constants/bodyMetrics';

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
