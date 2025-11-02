import React from 'react';

interface AlertDialogProps {
  message: string | null;
  onConfirm: () => void;
  isOpen: boolean;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ message, onConfirm, isOpen }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border dark:border-gray-700 max-w-sm w-full text-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">提示</h3>
        <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
