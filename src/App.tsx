import React from 'react';
import Sidebar from './components/Sidebar';
import AlertDialog from './components/AlertDialog';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import { useAppContext } from './contexts/AppContext';

// --- 主应用组件 (App) ---
const App: React.FC = () => {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage } = useAppContext();

  // --- 渲染内容 ---
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
    <div className="flex h-screen bg-gray-900 text-white font-sans antialiased">
      
      {/* 1. Sidebar Navigation */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 min-w-[320px]">
        {renderContent()}
      </main>

      {/* Alert Dialog */}
      <AlertDialog message={alertMessage} onClose={() => setAlertMessage(null)} />

    </div>
  );
};

export default App;
