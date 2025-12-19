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
import { useState, useEffect, useRef } from 'react';
import { PanelLeftIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import BottomNavBar from './components/BottomNavBar';

function AppContent() {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage } = useAppContext();
  const [platform, setPlatform] = useState('web');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

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

        // 初始化 Android 状态栏
        try {
          // 等待 JavaScript 接口可用
          const checkAndSetStatusBar = () => {
            if (window.AndroidStatusBar) {
              const isDark = document.documentElement.classList.contains('dark');
              window.AndroidStatusBar.setStyle(isDark);
              console.log('✅ Status bar initialized with theme:', isDark ? 'dark' : 'light');
            } else {
              // 如果接口还未准备好，稍后重试
              setTimeout(checkAndSetStatusBar, 100);
            }
          };
          checkAndSetStatusBar();
        } catch (error) {
          console.log('Status bar initialization failed:', error);
        }
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

  // Reset scroll position when page changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentPage]);

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
    <div className="flex h-screen font-sans antialiased w-full">
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

      <main ref={mainRef} className={`flex-1 hide-scrollbar ${currentPage === 'fitnessTheory' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        {/* Sticky Header */}
        <header
          className="sticky top-0 z-10 bg-background/50 p-4 border-b backdrop-blur-lg flex items-center"
          style={{
            paddingTop: platform === 'android' ? '48px' : '1rem'
          }}
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
        <div
          className={currentPage === 'fitnessTheory' ? 'h-full' : 'p-6 md:p-10'}
          style={platform === 'android' ? {
            paddingBottom: currentPage === 'fitnessTheory'
              ? 'calc(4rem + max(env(safe-area-inset-bottom), 16px))'
              : 'calc(4rem + max(env(safe-area-inset-bottom), 16px) + 1.5rem)'
          } : {}}
        >
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
