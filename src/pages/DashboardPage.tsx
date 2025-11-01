import React from 'react';
import type { TrainingRecord, MetricRecord, Page } from '../types/data';
import KpiCard from '../components/KpiCard';
import { DumbbellIcon, ListChecksIcon, TapeMeasureIcon, WeightIcon } from '../components/icons/Icons';
import MaxWeightChart from '../components/charts/MaxWeightChart';
import ActivityTrendChart from '../components/charts/ActivityTrendChart';
import TrainingForm from '../components/TrainingForm';
import MetricPreviewCard from '../components/MetricPreviewCard';

interface DashboardPageProps {
    // KPI Data
    totalWeightliftingSessions: number;
    totalSets: number;
    latestMetrics: MetricRecord | null;
    shoulderWaistRatio: number | null;
    bmi: number | null;
    bmiDescription: { range: string; category: string } | null;
    shoulderWaistRatioDescription: { range: string; visualFeature: string; adjectives: string } | null;
    
    // Chart Data
    maxWeightByActivity: { activity: string; maxW: number }[];
    selectedActivity: string;
    setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
    trendRange: '30' | '90' | 'all';
    setTrendRange: React.Dispatch<React.SetStateAction<'30' | '90' | 'all'>>;
    activityTrendData: { date: string; weightKg: number; reps: number }[];

    // Form Data & Handlers (for Quick Add)
    formData: Partial<TrainingRecord>;
    editingId: string | null;
    handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
    
    // Navigation
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
    totalWeightliftingSessions,
    totalSets,
    latestMetrics,
    shoulderWaistRatio,
    bmi,
    bmiDescription,
    shoulderWaistRatioDescription,
    maxWeightByActivity,
    selectedActivity,
    setSelectedActivity,
    trendRange,
    setTrendRange,
    activityTrendData,
    formData,
    editingId,
    handleRecordChange,
    handleRecordSubmit,
    handleCancelEdit,
    setCurrentPage,
}) => {
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">力量训练仪表板</h1>
            
            {/* KPI Cards Section - unified grid of 5 for consistent alignment */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <KpiCard 
                icon={<DumbbellIcon size={24} />} 
                title="总训练次数" 
                value={totalWeightliftingSessions.toString()} 
                unit="次" 
                color="emerald" 
              />
              <KpiCard 
                icon={<ListChecksIcon size={24} />} 
                title="总组数" 
                value={totalSets.toString()} 
                unit="组" 
                color="blue" 
              />
              <KpiCard 
                icon={<TapeMeasureIcon size={24} />} 
                title="上次围度记录" 
                value={latestMetrics?.date || 'N/A'} 
                unit="" 
                color="indigo" 
              />
              <KpiCard 
                icon={<TapeMeasureIcon size={24} />} 
                title="肩腰比" 
                value={shoulderWaistRatio ? shoulderWaistRatio.toFixed(2) : 'N/A'} 
                unit="" 
                color="purple"
                description={shoulderWaistRatioDescription ? shoulderWaistRatioDescription.adjectives : '暂无数据'}
              />
              <KpiCard 
                icon={<WeightIcon />} 
                title="BMI" 
                value={bmi ? bmi.toFixed(2) : 'N/A'} 
                unit="" 
                color="emerald"
                description={bmiDescription ? bmiDescription.category : '暂无数据'}
              />
            </div>

            {/* Activity Visualization */}
            <MaxWeightChart data={maxWeightByActivity} />

            {/* Activity Trend */}
            <ActivityTrendChart 
                selectedActivity={selectedActivity}
                setSelectedActivity={setSelectedActivity}
                trendRange={trendRange}
                setTrendRange={setTrendRange}
                activityTrendData={activityTrendData}
            />

            {/* Quick Add Form and Metric Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrainingForm 
                    formData={formData}
                    editingId={editingId}
                    handleRecordChange={handleRecordChange}
                    handleRecordSubmit={handleRecordSubmit}
                    handleCancelEdit={handleCancelEdit}
                />
                <MetricPreviewCard 
                    latestMetrics={latestMetrics}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
