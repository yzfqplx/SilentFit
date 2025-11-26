import { useAppContext, AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';

import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import TrainingPlanPage from './pages/TrainingPlanPage';
import FitnessTheoryPage from './pages/FitnessTheoryPage';
import AlertDialog from './components/AlertDialog';
import './App.css';
import type { Page } from './types/data';
import { useState, useEffect } from 'react';
import { PanelLeftIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import BottomNavBar from './components/BottomNavBar';

function AppContent() {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage } = useAppContext();
  const [platform, setPlatform] = useState('web');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkPlatform = async () => {
      // 检查是否在 Tauri 环境中
      const isTauri = '__TAURI__' in window;

      console.log('🔍 Platform Detection:', {
        isTauri,
        userAgent: navigator.userAgent,
      });

      // 在 Tauri 中，检查 user agent 来判断平台
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('android')) {
        console.log('✅ Detected platform: android');
        setPlatform('android');
      } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        console.log('✅ Detected platform: ios');
        setPlatform('ios');
      } else {
        console.log('✅ Detected platform: web');
        setPlatform('web');
      }
    };
    checkPlatform();
  }, []);

  const pageTitles: { [key in Page]: string } = {
    dashboard: '力量训练仪表板',
    records: '管理训练记录',
    metrics: '身体围度追踪',
    settings: '设置',
    trainingPlan: '训练计划',
    fitnessTheory: '健身理论图谱',
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;

      case 'metrics':
        return <MetricsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'trainingPlan':
        return <TrainingPlanPage />;
      case 'fitnessTheory':
        return <FitnessTheoryPage />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen font-sans antialiased w-full ${platform === 'android' ? 'pb-16' : ''}`}>
      {platform !== 'android' && (
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      {isSidebarOpen && platform !== 'android' && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-10 bg-background/50 p-4 border-t border-b backdrop-blur-lg flex items-center"
          style={{ paddingTop: platform === 'android' ? 'calc(1rem + var(--safe-area-inset-top))' : '1rem' }}
        >
          {platform !== 'android' && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <PanelLeftIcon className="h-6 w-6" />
            </Button>
          )}
          <h1 className="text-xl font-bold">
            {pageTitles[currentPage]}
          </h1>
        </header>

        {/* Content */}
        <div className={`${currentPage === 'fitnessTheory' ? '' : 'p-6 md:p-10'} ${currentPage === 'fitnessTheory' ? 'h-full' : ''}`}>
          <div key={currentPage} className={`page-enter-animation ${currentPage === 'fitnessTheory' ? 'h-full' : ''}`}>
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
