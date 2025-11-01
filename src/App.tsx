import React, { useState, useEffect } from 'react';
import { Page } from './types/data';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import { useDataFetching, useTrainingData, useMetricData, useSettingsData, useDerivedData } from './utils/useData';

// --- 主应用组件 (App) ---

const App: React.FC = () => {
  const [authReady, setAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    setAuthReady(true);
  }, []);

  const { records, setRecords, metrics, setMetrics, fetchRecords } = useDataFetching(authReady);
  const {
    formData, editingId, selectedActivity, setSelectedActivity, trendRange, setTrendRange,
    handleRecordChange, handleRecordSubmit, handleRecordEdit, handleRecordDelete, handleCancelRecordEdit,
    totalWeightliftingSessions, totalSets, maxWeightByActivity, activityTrendData
  } = useTrainingData(records, setRecords, fetchRecords);
  const {
    metricFormData, editingMetricId,
    handleMetricChange, handleMetricSubmit, handleMetricEdit, handleMetricDelete, handleCancelMetricEdit,
  } = useMetricData(metrics, setMetrics, fetchRecords);
  const { heightCm, setHeightCm } = useSettingsData();
  const { latestMetrics, shoulderWaistRatio, bmi, bmiDescription, shoulderWaistRatioDescription } = useDerivedData(metrics, heightCm);


  // --- 渲染内容 ---
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            totalWeightliftingSessions={totalWeightliftingSessions}
            totalSets={totalSets}
            latestMetrics={latestMetrics}
            shoulderWaistRatio={shoulderWaistRatio}
            bmi={bmi}
            bmiDescription={bmiDescription}
            shoulderWaistRatioDescription={shoulderWaistRatioDescription}
            maxWeightByActivity={maxWeightByActivity}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
            trendRange={trendRange}
            setTrendRange={setTrendRange}
            activityTrendData={activityTrendData}
            formData={formData}
            editingId={editingId}
            handleRecordChange={handleRecordChange}
            handleRecordSubmit={handleRecordSubmit}
            handleCancelEdit={handleCancelRecordEdit}
            setCurrentPage={setCurrentPage}
          />
        );

      case 'records':
        return (
          <RecordsPage
            records={records}
            formData={formData}
            editingId={editingId}
            handleRecordChange={handleRecordChange}
            handleRecordSubmit={handleRecordSubmit}
            handleRecordEdit={(record) => handleRecordEdit(record, setCurrentPage)}
            handleRecordDelete={(id) => handleRecordDelete(id, window.confirm)}
            handleCancelEdit={handleCancelRecordEdit}
          />
        );

      case 'metrics':
        return (
          <MetricsPage
            metrics={metrics}
            metricFormData={metricFormData}
            editingMetricId={editingMetricId}
            handleMetricChange={handleMetricChange}
            handleMetricSubmit={handleMetricSubmit}
            handleMetricEdit={(metric) => handleMetricEdit(metric, setCurrentPage)}
            handleMetricDelete={(id) => handleMetricDelete(id, window.confirm)}
            handleCancelEdit={handleCancelMetricEdit}
          />
        );

      case 'settings':
        return (
          <SettingsPage
            heightCm={heightCm}
            setHeightCm={setHeightCm}
            records={records}
            metrics={metrics}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans antialiased">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 min-w-[320px]">
        {renderContent()}
      </main>

    </div>
  );
};

export default App;
