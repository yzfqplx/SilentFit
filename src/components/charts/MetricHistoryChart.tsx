import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { MetricRecord } from '../../types/data';
import { useTheme } from '../../contexts/ThemeContext';

interface MetricHistoryChartProps {
    metrics: MetricRecord[];
}

// --- 围度历史图表 ---
const MetricHistoryChart: React.FC<MetricHistoryChartProps> = ({ metrics }) => {
    const { theme } = useTheme();
    const tickColor = theme === 'light' ? '#374151' : '#9CA3AF';
    const gridColor = theme === 'light' ? '#E5E7EB' : '#374151';
    const tooltipBg = theme === 'light' ? '#FFFFFF' : '#1F2937';
    const legendColor = theme === 'light' ? '#374151' : '#E5E7EB';

    const data = metrics.slice().reverse(); // 反转，使图表从最老数据开始

    if (data.length < 2) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">围度趋势</h2>
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                    至少需要两条记录才能绘制趋势图。
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">围度趋势 (CM)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="date" stroke={tickColor} />
                    <YAxis stroke={tickColor} domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: tickColor }}
                        formatter={(value: number) => [`${value.toFixed(1)} cm`]}
                    />
                    <Legend wrapperStyle={{ color: legendColor }} />
                    <Line type="monotone" dataKey="shoulderCm" name="肩围" stroke="#60A5FA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="chestCm" name="胸围" stroke="#A78BFA" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="armCm" name="臂围" stroke="#FBBF24" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="waistCm" name="腰围" stroke="#F87171" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MetricHistoryChart;