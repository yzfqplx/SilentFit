import React from 'react';

interface AlertDialogProps {
  message: string | null;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-sm w-full text-white">
        <h3 className="text-lg font-semibold mb-4 text-red-400">警告</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
