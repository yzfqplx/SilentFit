import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface MaxWeightChartProps {
    data: { activity: string; maxW: number }[];
}

const chartConfig = {
    maxW: {
        label: "最大重量",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

// --- 训练项目可视化: 各项目最大重量 ---
const MaxWeightChart: React.FC<MaxWeightChartProps> = ({ data }) => {

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart accessibilityLayer data={data} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} />
                    <YAxis
                        dataKey="activity"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={7}
                        type="category"
                    />
                    <XAxis
                        type="number"
                        dataKey="maxW"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="maxW" fill="var(--color-maxW)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}

export default MaxWeightChart;
