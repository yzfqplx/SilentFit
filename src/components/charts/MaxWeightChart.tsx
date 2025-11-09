import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';

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
            <BarChart accessibilityLayer data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="activity"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="maxW" fill="var(--color-maxW)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}

export default MaxWeightChart;