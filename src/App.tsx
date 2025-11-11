import { useAppContext, AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/TrainingRecordPage';
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import TrainingPlanPage from './pages/TrainingPlanPage'; // 导入新页面
import AlertDialog from './components/AlertDialog';
import './App.css';
import type { Page } from './types/data';
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';
import BottomNavBar from './components/BottomNavBar';

function AppContent() {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage, selectedTask } = useAppContext();
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    const checkPlatform = async () => {
      const currentPlatform = Capacitor.getPlatform();
      setPlatform(currentPlatform);
    };
    checkPlatform();
  }, []);

  const pageTitles: { [key in Page]: string } = {
    dashboard: '力量训练仪表板',
    records: '管理训练记录',
    metrics: '身体围度追踪',
    settings: '设置',
    trainingPlan: '训练计划', // 添加新页面的标题
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'records':
        return <RecordsPage />;
      case 'metrics':
        return <MetricsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'trainingPlan':
        return <TrainingPlanPage />; // 添加新页面的渲染逻辑
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen font-sans antialiased w-full ${platform === 'android' ? 'pb-16' : ''}`}>
      {platform !== 'android' && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Sticky Header */}
        <header 
          className="sticky top-0 z-10 bg-background/50 p-4 border-b backdrop-blur-lg"
          style={platform === 'android' ? { paddingTop: 'env(safe-area-inset-top)' } : {}}
        >
          <h1 className="text-xl font-bold">
            {pageTitles[currentPage]}
          </h1>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10">
          <div key={currentPage} className="page-enter-animation">
            {renderContent()}
          </div>
        </div>
      </main>


      {platform === 'android' && <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

      <AlertDialog 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onConfirm={() => setAlertMessage(null)} 
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
