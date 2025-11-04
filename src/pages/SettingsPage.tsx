import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const SettingsPage: React.FC = () => {
    const { heightCm, setHeightCm, records, setRecords, metrics, setMetrics, setAlertMessage } = useAppContext();
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleExportData = () => {
        const data = {
            heightCm,
            records,
            metrics,
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fitness_tracker_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setAlertMessage('未选择文件。');
            setSelectedFileName(null);
            return;
        }

        setSelectedFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedData = JSON.parse(content);

                if (importedData.heightCm !== undefined) {
                    setHeightCm(importedData.heightCm);
                }
                if (importedData.records) {
                    setRecords(importedData.records);
                }
                if (importedData.metrics) {
                    setMetrics(importedData.metrics);
                }
                setAlertMessage('数据已成功导入！');
            } catch (error) {
                console.error('导入数据失败:', error);
                setAlertMessage('导入数据失败，请检查文件格式。');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto"> {/* Increased max-width for horizontal layout */}

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 space-y-6 mb-8 lg:mb-0 lg:w-1/2"> {/* Added lg:w-1/2 for horizontal layout */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">个人信息</h2>
                    <div>
                        <label htmlFor="heightCm" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">身高 (CM)</label>
                        <input
                            id="heightCm"
                            type="number"
                            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                            value={heightCm === '' ? '' : heightCm}
                            onChange={(e) => setHeightCm(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            min="0" step="0.5"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">用于计算 BMI（基于最新体重）</p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>训练记录数: {records.length}</p>
                        <p>围度记录数: {metrics.length}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 space-y-6 lg:w-1/2"> {/* Added lg:w-1/2 for horizontal layout */}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">数据管理</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        您可以导出所有训练和围度数据，以便备份或迁移。
                        也可以导入之前导出的数据。
                    </p>
                    <button
                        onClick={handleExportData}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        导出数据
                    </button>
                    <div>
                        <label htmlFor="importData" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">导入数据</label>
                        <div className="relative">
                            <input
                                id="importData"
                                type="file"
                                accept=".json"
                                onChange={handleImportData}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 flex items-center justify-between cursor-pointer transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                                <span className="truncate">{selectedFileName || '选择 JSON 文件'}</span>
                                <span className="bg-indigo-500 text-white text-sm py-1 px-3 rounded-md hover:bg-indigo-600">浏览</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">导入之前导出的 JSON 文件</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
