// src/components/DurationChart.tsx

import React from 'react';
import { type TrainingRecord } from '../types/Training';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

interface DurationChartProps {
    records: TrainingRecord[];
}

// ----------------------------------------------------
// 数据预处理函数
// ----------------------------------------------------
const processDataForChart = (records: TrainingRecord[]) => {
    // 1. 按日期分组，求和当日所有训练的时长
    const dailyDataMap: { [date: string]: number } = records.reduce((acc, record) => {
        // 使用 record.date (YYYY-MM-DD 格式) 作为键
        const dateKey = record.date; 
        const duration = record.durationMinutes || 0;
        
        acc[dateKey] = (acc[dateKey] || 0) + duration;
        return acc;
    }, {} as { [date: string]: number });

    // 2. 转换为 Recharts 要求的数组格式 [{ date: '2025-01-01', duration: 120 }, ...]
    let chartData = Object.keys(dailyDataMap).map(date => ({
        date: date,
        duration: dailyDataMap[date],
    }));

    // 3. 按日期排序 (确保趋势线正确)
    chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return chartData;
};

// ----------------------------------------------------
// 图表组件
// ----------------------------------------------------

const DurationChart: React.FC<DurationChartProps> = ({ records }) => {
    const chartData = processDataForChart(records);
    
    if (chartData.length < 2) {
        return (
            <div className="text-center text-gray-500 py-10">
                记录不足，至少需要两天的数据才能生成趋势图表。
            </div>
        );
    }
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                {/* 网格线 */}
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                
                {/* X 轴：日期 */}
                <XAxis 
                    dataKey="date" 
                    minTickGap={20} 
                    // 仅显示部分日期，防止重叠
                    tickFormatter={(value) => value.substring(5)} 
                />
                
                {/* Y 轴：时长（分钟）*/}
                <YAxis label={{ value: '时长 (分钟)', angle: -90, position: 'insideLeft', fill: '#666' }} />
                
                {/* 悬停提示 */}
                <Tooltip 
                    formatter={(value: number) => [`${value} 分钟`, '总时长']}
                    labelFormatter={(label) => `日期: ${label}`}
                />
                
                {/* 趋势线 */}
                <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#4F46E5" // Indigo 600
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DurationChart;