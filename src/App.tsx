import { useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import RecordsPage from './pages/RecordsPage';
import MetricsPage from './pages/MetricsPage';
import SettingsPage from './pages/SettingsPage';
import AlertDialog from './components/AlertDialog';
import ConfirmDialog from './components/ConfirmDialog';
import './App.css';

function App() {
  const { currentPage, setCurrentPage, alertMessage, setAlertMessage, confirmDialog } = useAppContext();

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
      <AlertDialog 
        isOpen={!!alertMessage} 
        message={alertMessage} 
        onConfirm={() => setAlertMessage(null)} 
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

    </div>
  );
};

export default App;
