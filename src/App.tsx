import { useAppContext, AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import AlertDialog from './components/AlertDialog';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';
import type { Page } from './types/data';
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';
import BottomNavBar from './components/BottomNavBar';

function AppContent() {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage, confirmDialog } = useAppContext();
  const [platform, setPlatform] = useState('web');

  useEffect(() => {
    const checkPlatform = async () => {
      const platform = await Capacitor.getPlatform();
      setPlatform(platform);
    };
    checkPlatform();
  }, []);

  const pageTitles: { [key in Page]: string } = {
    dashboard: '力量训练仪表板',
    records: '管理训练记录',
    metrics: '身体围度追踪',
    settings: '设置',
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
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-dark-bg text-light-text dark:text-dark-text font-sans antialiased w-full ${platform === 'android' ? 'pb-16' : ''}`}>
      {platform !== 'android' && <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-gray-100/50 dark:bg-dark-bg/50 p-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitles[currentPage]}
          </h1>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10">
          {renderContent()}
        </div>
      </main>

      {platform === 'android' && <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />}

      <AlertDialog 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onConfirm={() => setAlertMessage(null)} 
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
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
