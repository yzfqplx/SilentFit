import React from 'react';
import type { TrainingRecord } from '../types/data';
import { DumbbellIcon, Edit2Icon, Trash2Icon } from './icons/Icons';
import Tooltip from './Tooltip';

interface TrainingRecordCardProps {
    record: TrainingRecord;
    handleEdit: (record: TrainingRecord) => void;
    handleDelete: (id: string) => void;
}

// --- 子组件: 训练记录卡片 ---
const TrainingRecordCard: React.FC<TrainingRecordCardProps> = ({ record, handleEdit, handleDelete }) => {
    
    return (
        <div className={`
            p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800
            transition duration-300 hover:bg-gray-100 dark:hover:bg-gray-700/70
            flex justify-between items-center
        `}>
            {/* Left Info: Activity, Date, Volume */}
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full bg-emerald-500 dark:bg-emerald-600 text-white`}>
                    <DumbbellIcon size={16} />
                </div>
                <div>
                    <div className="font-semibold text-gray-900 dark:text-white flex items-center">
                        {record.activity}
                        <span className="ml-3 text-xs text-gray-500 dark:text-gray-400 font-normal">{record.date}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className='text-emerald-600 dark:text-emerald-400 font-bold mr-1'>{record.weightKg} KG</span> 
                        x {record.reps} 次 x {record.sets} 组
                    </div>
                    {record.notes && (
                        <Tooltip content={record.notes}>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 italic max-w-md truncate">备注: {record.notes}</p>
                        </Tooltip>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex space-x-2">
                <button 
                    onClick={() => handleEdit(record)}
                    className="p-2 rounded-full text-indigo-600 dark:text-emerald-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 focus:outline-none"
                    title="编辑"
                >
                    <Edit2Icon size={18} />
                </button>
                <button 
                    onClick={() => handleDelete(record._id)}
                    className="p-2 rounded-full text-red-600 dark:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-150 focus:outline-none"
                    title="删除"
                >
                    <Trash2Icon size={18} />
                </button>
            </div>
        </div>
    );
};

export default TrainingRecordCard;
