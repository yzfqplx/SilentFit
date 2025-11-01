import React from 'react';
import { MetricRecord } from '../types/data';

interface MetricFormProps {
    metricFormData: Partial<MetricRecord>;
    editingMetricId: string | null;
    handleMetricChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMetricSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
}

// --- 身体围度表单卡片 ---
const MetricForm: React.FC<MetricFormProps> = ({
    metricFormData,
    editingMetricId,
    handleMetricChange,
    handleMetricSubmit,
    handleCancelEdit,
}) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01] mb-8">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400">
            {editingMetricId ? '编辑围度记录' : '记录身体围度'}
        </h2>
        <form onSubmit={handleMetricSubmit} className="space-y-4">
            
            {/* Row 1: Date / Shoulder / Chest / Arm / Waist / Weight */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="relative">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">日期</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={metricFormData.date || new Date().toISOString().substring(0, 10)}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        required
                    />
                </div>
                <div className="relative">
                    <label htmlFor="shoulderCm" className="block text-sm font-medium text-gray-400 mb-1">肩围 (CM)</label>
                    <input
                        type="number"
                        id="shoulderCm"
                        name="shoulderCm"
                        value={metricFormData.shoulderCm || ''}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        min="0" step="0.1" required
                    />
                </div>
                <div className="relative">
                    <label htmlFor="chestCm" className="block text-sm font-medium text-gray-400 mb-1">胸围 (CM)</label>
                    <input
                        type="number"
                        id="chestCm"
                        name="chestCm"
                        value={metricFormData.chestCm || ''}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        min="0" step="0.1" required
                    />
                </div>
                <div className="relative">
                    <label htmlFor="armCm" className="block text-sm font-medium text-gray-400 mb-1">臂围 (CM)</label>
                    <input
                        type="number"
                        id="armCm"
                        name="armCm"
                        value={metricFormData.armCm || ''}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        min="0" step="0.1"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="waistCm" className="block text-sm font-medium text-gray-400 mb-1">腰围 (CM)</label>
                    <input
                        type="number"
                        id="waistCm"
                        name="waistCm"
                        value={metricFormData.waistCm || ''}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        min="0" step="0.1"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="weightKg" className="block text-sm font-medium text-gray-400 mb-1">体重 (KG)</label>
                    <input
                        type="number"
                        id="weightKg"
                        name="weightKg"
                        value={metricFormData.weightKg || ''}
                        onChange={handleMetricChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                        min="0" step="0.1"
                    />
                </div>
            </div>

            {/* Row 2: Notes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="relative col-span-2 md:col-span-4">
                    <label htmlFor="metricNotes" className="block text-sm font-medium text-gray-400 mb-1">备注</label>
                    <textarea
                        id="metricNotes"
                        name="notes"
                        rows={1}
                        value={metricFormData.notes || ''}
                        onChange={handleMetricChange as any}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 focus:outline-none"
                    />
                </div>
            </div>
            
            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-lg font-semibold 
                           bg-indigo-600 hover:bg-indigo-500 text-white 
                           shadow-xl shadow-indigo-900/50 focus:outline-none
                           transition-all duration-300 transform hover:scale-[1.01]"
            >
                {editingMetricId ? '保存围度更改' : '记录围度数据'}
            </button>
        </form>
        {editingMetricId && (
            <button
                onClick={handleCancelEdit}
                className="mt-2 w-full text-center py-1 text-sm font-medium text-gray-400 hover:text-white transition duration-150 focus:outline-none"
            >
                取消编辑
            </button>
        )}
    </div>
);

export default MetricForm;
