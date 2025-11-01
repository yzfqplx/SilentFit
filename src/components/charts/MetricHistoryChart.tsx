import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MetricRecord } from '../../types/data';

interface MetricHistoryChartProps {
    metrics: MetricRecord[];
}

// --- 围度历史图表 ---
const MetricHistoryChart: React.FC<MetricHistoryChartProps> = ({ metrics }) => {
    const data = metrics.slice().reverse(); // 反转，使图表从最老数据开始

    if (data.length < 2) {
        return (
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-white">围度趋势</h2>
                <div className="text-center p-8 text-gray-500">
                    至少需要两条记录才能绘制趋势图。
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
            <h2 className="text-xl font-semibold mb-4 text-white">围度趋势 (CM)</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={['auto', 'auto']} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                        labelStyle={{ color: '#E5E7EB' }}
                        formatter={(value: number) => [`${value.toFixed(1)} cm`]}
                    />
                    <Legend wrapperStyle={{ color: '#E5E7EB' }} />
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