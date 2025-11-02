import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { STRENGTH_ACTIVITIES } from '../../constants/activities';
import { useTheme } from '../../contexts/ThemeContext';

interface OneRepMaxData {
    date: string;
    estimated1RM: number;
}

interface OneRepMaxChartProps {
    selectedActivity: string;
    setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
    trendRange: '30' | '90' | 'all';
    setTrendRange: React.Dispatch<React.SetStateAction<'30' | '90' | 'all'>>;
    oneRepMaxData: OneRepMaxData[];
}

// --- 1RM 趋势图表 ---
const OneRepMaxChart: React.FC<OneRepMaxChartProps> = ({
    selectedActivity,
    setSelectedActivity,
    trendRange,
    setTrendRange,
    oneRepMaxData,
}) => {
    const { theme } = useTheme();
    const tickColor = theme === 'light' ? '#374151' : '#9CA3AF';
    const gridColor = theme === 'light' ? '#E5E7EB' : '#374151';
    const tooltipBg = theme === 'light' ? '#FFFFFF' : '#1F2937';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
            <div className="flex items-center justify-between mb-4 gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1RM 预估趋势</h2>
                <div className="flex items-center gap-2">
                    <select
                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                        value={selectedActivity}
                        onChange={(e) => setSelectedActivity(e.target.value)}
                    >
                        {STRENGTH_ACTIVITIES.map(act => (
                            <option key={act} value={act}>{act}</option>
                        ))}
                    </select>
                    <select
                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500 transition duration-150"
                        value={trendRange}
                        onChange={(e) => setTrendRange(e.target.value as '30' | '90' | 'all')}
                    >
                        <option value="30">近30天</option>
                        <option value="90">近90天</option>
                        <option value="all">全部</option>
                    </select>
                </div>
            </div>
            {oneRepMaxData.length < 2 ? (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">该项目至少需要两条记录以显示趋势。</div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={oneRepMaxData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="date" stroke={tickColor} />
                        <YAxis stroke={tickColor} />
                        <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: 'none', borderRadius: '8px' }} labelStyle={{ color: tickColor }} />
                        <Line type="monotone" dataKey="estimated1RM" name="预估 1RM (KG)" stroke="#34D399" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default OneRepMaxChart;
