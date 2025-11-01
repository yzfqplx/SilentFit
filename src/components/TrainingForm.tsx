import React from 'react';
import type { TrainingRecord } from '../types/data';
import { STRENGTH_ACTIVITIES } from '../constants/activities';
import { CalendarIcon, WeightIcon } from './icons/Icons';

interface TrainingFormProps {
    formData: Partial<TrainingRecord>;
    editingId: string | null;
    handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
}

// --- 训练记录表单卡片 ---
const TrainingForm: React.FC<TrainingFormProps> = ({
    formData,
    editingId,
    handleRecordChange,
    handleRecordSubmit,
    handleCancelEdit,
}) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">
            {editingId ? '编辑训练记录' : '添加力量训练记录'}
        </h2>
        <form onSubmit={handleRecordSubmit} className="space-y-4">
            
            {/* Row 1: Activity and Date */}
            <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                    <label htmlFor="activity" className="block text-sm font-medium text-gray-400 mb-1">训练项目</label>
                    <select
                        id="activity"
                        name="activity"
                        value={formData.activity || ''}
                        onChange={handleRecordChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 appearance-none focus:outline-none"
                    >
                        {STRENGTH_ACTIVITIES.map(activity => (
                            <option key={activity} value={activity}>{activity}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-400 mb-1">日期</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date || new Date().toISOString().substring(0, 10)}
                        onChange={handleRecordChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
                        required
                    />
                    <CalendarIcon className="absolute right-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Row 2: Weight, Sets, Reps */}
            <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                    <label htmlFor="weightKg" className="block text-sm font-medium text-gray-400 mb-1">重量 (KG)</label>
                    <input
                        type="number"
                        id="weightKg"
                        name="weightKg"
                        value={formData.weightKg || ''}
                        onChange={handleRecordChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 pl-10 pr-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
                        required
                        min="0"
                        step="0.5"
                    />
                    <WeightIcon className="absolute left-3 top-[34px] w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <label htmlFor="sets" className="block text-sm font-medium text-gray-400 mb-1">组数</label>
                    <input
                        type="number"
                        id="sets"
                        name="sets"
                        value={formData.sets === undefined || formData.sets === null ? '' : formData.sets}
                        onChange={handleRecordChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
                        required
                        min="1"
                    />
                </div>
                <div className="relative">
                    <label htmlFor="reps" className="block text-sm font-medium text-gray-400 mb-1">次数</label>
                    <input
                        type="number"
                        id="reps"
                        name="reps"
                        value={formData.reps === undefined || formData.reps === null ? '' : formData.reps}
                        onChange={handleRecordChange}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
                        required
                        min="1"
                    />
                </div>
            </div>
            
            {/* Notes */}
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">备注</label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes || ''}
                        onChange={handleRecordChange as any}
                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150 focus:outline-none"
                    />
                </div>
            </div>


            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg text-lg font-semibold 
                           bg-emerald-600 hover:bg-emerald-500 text-white 
                           shadow-xl shadow-emerald-900/50 focus:outline-none
                           transition-all duration-300 transform hover:scale-[1.01]"
            >
                {editingId ? '保存更改' : '添加训练记录'}
            </button>
        </form>
        {editingId && (
            <button
                onClick={handleCancelEdit}
                className="mt-2 w-full text-center py-1 text-sm font-medium text-gray-400 hover:text-white transition duration-150 focus:outline-none"
            >
                取消编辑
            </button>
        )}
    </div>
);

export default TrainingForm;
