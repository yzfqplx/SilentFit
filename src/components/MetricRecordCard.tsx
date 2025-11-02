import React from 'react';
import type { MetricRecord } from '../types/data';
import { TapeMeasureIcon, Edit2Icon, Trash2Icon } from './icons/Icons';
import Tooltip from './Tooltip';

interface MetricRecordCardProps {
    metric: MetricRecord;
    handleEdit: (metric: MetricRecord) => void;
    handleDelete: (id: string) => void;
}

// --- 子组件: 围度记录卡片 ---
const MetricRecordCard: React.FC<MetricRecordCardProps> = ({ metric, handleEdit, handleDelete }) => {
    
    const measurements = [
        { label: '肩', value: metric.shoulderCm },
        { label: '胸', value: metric.chestCm },
        { label: '臂', value: metric.armCm },
        { label: '腰', value: metric.waistCm },
    ];
    
    return (
        <div className={`
            p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800
            transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/70
            flex justify-between items-center
        `}>
            {/* Left Info: Date and Measurements */}
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white`}>
                    <TapeMeasureIcon size={16} />
                </div>
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">
                        围度记录: {metric.date}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex space-x-3">
                        {measurements.map((m, index) => (
                            <span key={index}>
                                {m.label}: <span className='text-indigo-600 dark:text-indigo-400 font-bold'>{m.value.toFixed(1)}</span> CM
                            </span>
                        ))}
                        <span>
                            体重: <span className='text-emerald-600 dark:text-emerald-400 font-bold'>{(metric.weightKg ?? 0).toFixed(1)}</span> KG
                        </span>
                    </div>
                    {metric.notes && (
                        <Tooltip content={metric.notes}>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic max-w-md truncate">备注: {metric.notes}</p>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleEdit(metric)}
                    className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 focus:outline-none"
                    title="编辑"
                >
                    <Edit2Icon size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(metric._id)}
                    className="p-2 rounded-full text-red-600 dark:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 focus:outline-none"
                    title="删除"
                >
                    <Trash2Icon size={18} />
                </button>
            </div>
        </div>
    );
};

export default MetricRecordCard;
