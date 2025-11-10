import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Page, TrainingRecord, MetricRecord } from '../types/data';
import { useDataFetching } from '../hooks/useDataFetching';
import { useTrainingData } from '../hooks/useTrainingData';
import { useMetricData } from '../hooks/useMetricData';
import { useSettingsData } from '../hooks/useSettingsData';
import { useDerivedData } from '../hooks/useDerivedData';

// --- 定义 Context 中值的类型 ---
interface AppContextType {
  // Page state
  currentPage: Page;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>; 
  // Alert state
  alertMessage: string | null;
  setAlertMessage: React.Dispatch<React.SetStateAction<string | null>>; 
  // Data fetching
  records: TrainingRecord[];
  setRecords: React.Dispatch<React.SetStateAction<TrainingRecord[]>>;
  metrics: MetricRecord[]; 
  setMetrics: React.Dispatch<React.SetStateAction<MetricRecord[]>>;
  // Training data and handlers
  formData: Partial<TrainingRecord>;
  editingId: string | null;
  selectedActivity: string;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string>>; 
  trendRange: '7' | '30' | '90' | 'all';
  setTrendRange: React.Dispatch<React.SetStateAction<'7' | '30' | '90' | 'all'>>;
  handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
  handleRecordEdit: (record: TrainingRecord) => void;
  handleRecordDelete: (id: string) => void;
  handleCancelRecordEdit: () => void;
  handleMarkAsComplete: (id: string) => Promise<void>;
  totalWeightliftingSessions: number;
  totalSets: number;
  maxWeightByActivity: { activity: string; maxW: number }[];
  activityTrendData: { date: string; weightKg: number; reps: number }[];
  oneRepMaxData: { date: string; estimated1RM: number }[];
  recommendation: Partial<TrainingRecord> | null;
  oneRepMaxTrend: { latest1RM: number | null; trend: number | null; };
  setFormData: React.Dispatch<React.SetStateAction<Partial<TrainingRecord>>>;

  // Metric data and handlers
  metricFormData: Partial<MetricRecord>;
  editingMetricId: string | null;
  handleMetricChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMetricSubmit: (e: React.FormEvent) => Promise<void>;
  handleMetricEdit: (metric: MetricRecord) => void;
  handleMetricDelete: (id: string) => void;
  handleCancelMetricEdit: () => void; 

  // Settings data
  heightCm: number | '';
  setHeightCm: React.Dispatch<React.SetStateAction<number | ''>>; 
  // Derived data
  latestMetrics: MetricRecord | null;
  shoulderWaistRatio: number | null;
  bmi: number | null;
  bmiDescription: { range: string; category: string };
  shoulderWaistRatioDescription: { range: string; visualFeature: string; adjectives: string };
}

// Define the type for the object returned by useTrainingData
interface TrainingDataContextType {
  formData: Partial<TrainingRecord>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<TrainingRecord>>>;
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedActivity: string;
  setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
  trendRange: '7' | '30' | '90' | 'all';
  setTrendRange: React.Dispatch<React.SetStateAction<'7' | '30' | '90' | 'all'>>;
  handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
  handleRecordEdit: (record: TrainingRecord) => void;
  handleRecordDelete: (id: string) => void;
  handleCancelRecordEdit: () => void;
  handleMarkAsComplete: (id: string) => Promise<void>;
  totalWeightliftingSessions: number;
  totalSets: number;
  maxWeightByActivity: { activity: string; maxW: number }[];
  activityTrendData: { date: string; weightKg: number; reps: number }[];
  oneRepMaxData: { date: string; estimated1RM: number }[];
  recommendation: Partial<TrainingRecord> | null;
  oneRepMaxTrend: { latest1RM: number | null; trend: number | null; };
}


// --- 创建 Context ---
const AppContext = createContext<AppContextType | undefined>(undefined);

// --- 创建 Provider 组件 ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authReady] = useState(true); // Simplified for context
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const { records, setRecords, metrics, setMetrics, fetchRecords } = useDataFetching(authReady);
  
  const trainingData: TrainingDataContextType = useTrainingData(records, setRecords, fetchRecords, setAlertMessage, setCurrentPage);
  const metricData = useMetricData(metrics, setMetrics, fetchRecords, setAlertMessage, setCurrentPage);
  const settingsData = useSettingsData();
  const derivedData = useDerivedData(metrics, settingsData.heightCm);

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    alertMessage,
    setAlertMessage,
    records,
    setRecords,
    metrics,
    setMetrics,
    ...trainingData,
    ...metricData,
    ...settingsData,
    ...derivedData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- 创建自定义 Hook ---
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
