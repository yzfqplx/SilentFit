import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
    const { heightCm, setHeightCm, records, metrics } = useAppContext();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white">设置</h1>
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 text-gray-400 space-y-4 transition-all duration-300 transform hover:scale-[1.01]">
                <div>
                    <label htmlFor="heightCm" className="block text-sm font-medium text-gray-400 mb-1">身高 (CM)</label>
                    <input
                        id="heightCm"
                        type="number"
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        value={heightCm === '' ? '' : heightCm}
                        onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        min="0" step="0.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">用于计算 BMI（基于最新体重）</p>
                </div>
                <div className="text-sm">
                    <p>训练记录数: {records.length}</p>
                    <p>围度记录数: {metrics.length}</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
