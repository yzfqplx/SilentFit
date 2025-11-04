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
  // Confirm Dialog state
  confirmDialog: {
    isOpen: boolean;
    message: string | null;
    onConfirm: () => void;
    onCancel: () => void;
  };
  setConfirmDialog: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    message: string | null;
    onConfirm: () => void;
    onCancel: () => void;
  }>>; 
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void; 
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
  trendRange: '30' | '90' | 'all';
  setTrendRange: React.Dispatch<React.SetStateAction<'30' | '90' | 'all'>>; 
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

// --- 创建 Context ---
const AppContext = createContext<AppContextType | undefined>(undefined);

// --- 创建 Provider 组件 ---
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authReady] = useState(true); // Simplified for context
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message: string | null;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    message: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirm = (message: string, onConfirm: () => void, onCancel?: () => void) => {
    setConfirmDialog({
      isOpen: true,
      message,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false, message: null, onConfirm: () => {}, onCancel: () => {} });
        onConfirm();
      },
      onCancel: () => {
        setConfirmDialog({ isOpen: false, message: null, onConfirm: () => {}, onCancel: () => {} });
        if (onCancel) onCancel();
      },
    });
  };

  const { records, setRecords, metrics, setMetrics, fetchRecords } = useDataFetching(authReady);
  
  const trainingData = useTrainingData(records, setRecords, fetchRecords, setAlertMessage, showConfirm, setCurrentPage);
  const metricData = useMetricData(metrics, setMetrics, fetchRecords, setAlertMessage, showConfirm, setCurrentPage);
  const settingsData = useSettingsData();
  const derivedData = useDerivedData(metrics, settingsData.heightCm);

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    alertMessage,
    setAlertMessage,
    confirmDialog,
    setConfirmDialog,
    showConfirm,
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
