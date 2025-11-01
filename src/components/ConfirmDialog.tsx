import React from 'react';

interface ConfirmDialogProps {
  message: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md w-full text-white">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">确认</h3>
        <p className="mb-6 text-gray-300">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-semibold transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            取消
          </button>
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

export default ConfirmDialog;
