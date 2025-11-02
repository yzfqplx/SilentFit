import React from 'react';

// --- 子组件: 围度数据显示单元 ---
const MetricDisplay: React.FC<{ label: string; value: number | null | undefined; unit: string }> = ({ label, value, unit }) => {
    const isNumber = typeof value === 'number' && isFinite(value);
    const displayValue = isNumber ? (value as number).toFixed(1) : 'N/A';
    return (
        <div className="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700/50 last:border-b-0">
            <span className="text-gray-600 dark:text-gray-400 font-light">{label}:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
                {displayValue} <span className="text-sm font-normal text-gray-600 dark:text-gray-400">{unit}</span>
            </span>
        </div>
    );
};

export default MetricDisplay;