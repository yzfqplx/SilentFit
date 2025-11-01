import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STRENGTH_ACTIVITIES } from '../../constants/activities';

interface ActivityTrendData {
    date: string;
    weightKg: number;
    reps: number;
}

interface ActivityTrendChartProps {
    selectedActivity: string;
    setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
    trendRange: '30' | '90' | 'all';
    setTrendRange: React.Dispatch<React.SetStateAction<'30' | '90' | 'all'>>;
    activityTrendData: ActivityTrendData[];
}

// --- 训练项目趋势图表 ---
const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({
    selectedActivity,
    setSelectedActivity,
    trendRange,
    setTrendRange,
    activityTrendData,
}) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <div className="flex items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-semibold text-white">训练项目趋势</h2>
            <div className="flex items-center gap-2">
                <select
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                >
                    {STRENGTH_ACTIVITIES.map(act => (
                        <option key={act} value={act}>{act}</option>
                    ))}
                </select>
                <select
                    className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                    value={trendRange}
                    onChange={(e) => setTrendRange(e.target.value as '30' | '90' | 'all')}
                >
                    <option value="30">近30天</option>
                    <option value="90">近90天</option>
                    <option value="all">全部</option>
                </select>
            </div>
        </div>
        {activityTrendData.length < 2 ? (
            <div className="text-center p-8 text-gray-500">该项目至少需要两条记录以显示趋势。</div>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#E5E7EB' }} />
                    <Line type="monotone" dataKey="weightKg" name="重量 (KG)" stroke="#34D399" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="reps" name="次数" stroke="#FBBF24" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        )}
    </div>
);

export default ActivityTrendChart;