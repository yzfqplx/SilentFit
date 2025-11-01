import React from 'react';
import { MetricRecord, Page } from '../types/data';
import { TapeMeasureIcon } from './icons/Icons';
import MetricDisplay from './MetricDisplay';

interface MetricPreviewCardProps {
    latestMetrics: MetricRecord | null;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

// --- 围度预览卡片 ---
const MetricPreviewCard: React.FC<MetricPreviewCardProps> = ({ latestMetrics, setCurrentPage }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-4 text-indigo-400 flex items-center">
            <TapeMeasureIcon size={20} className="mr-2"/> 最新身体围度 ({latestMetrics?.date || 'N/A'})
        </h2>
        
        {latestMetrics ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
                <MetricDisplay label="肩围" value={latestMetrics.shoulderCm} unit="cm" />
                <MetricDisplay label="胸围" value={latestMetrics.chestCm} unit="cm" />
                <MetricDisplay label="臂围" value={latestMetrics.armCm} unit="cm" />
                <MetricDisplay label="腰围" value={latestMetrics.waistCm} unit="cm" />
                <MetricDisplay label="体重" value={latestMetrics.weightKg} unit="kg" />
            </div>
        ) : (
            <div className="text-gray-500 text-center py-4">暂无围度数据。</div>
        )}

        <button
            onClick={() => setCurrentPage('metrics')}
            className="mt-6 w-full py-2 text-sm rounded-lg font-semibold bg-indigo-700 hover:bg-indigo-600 text-white transition duration-150"
        >
            前往追踪围度历史
        </button>
    </div>
);

export default MetricPreviewCard;