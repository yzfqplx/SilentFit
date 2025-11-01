import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MaxWeightChartProps {
    data: { activity: string; maxW: number }[];
}

// --- 训练项目可视化: 各项目最大重量 ---
const MaxWeightChart: React.FC<MaxWeightChartProps> = ({ data }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.01]">
        <h2 className="text-xl font-semibold mb-4 text-white">各训练项目最大重量</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="activity" stroke="#9CA3AF" interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} labelStyle={{ color: '#E5E7EB' }} formatter={(value: number) => [`${value} KG`, '最大重量']} />
                <Bar dataKey="maxW" fill="#60A5FA" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export default MaxWeightChart;