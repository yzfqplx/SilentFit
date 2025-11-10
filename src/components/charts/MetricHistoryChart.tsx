import React from 'react';
import { Line, LineChart, CartesianGrid, XAxis } from "recharts"
import type { MetricRecord } from '../../types/data';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

interface MetricHistoryChartProps {
    metrics: MetricRecord[];
}

const chartConfig = {
    shoulderCm: {
        label: "肩围",
        color: "hsl(var(--chart-1))",
    },
    chestCm: {
        label: "胸围",
        color: "hsl(var(--chart-2))",
    },
    armCm: {
        label: "臂围",
        color: "hsl(var(--chart-3))",
    },
    waistCm: {
        label: "腰围",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig;

// --- 围度历史图表 ---
const MetricHistoryChart: React.FC<MetricHistoryChartProps> = ({ metrics }) => {

    const data = metrics.slice().reverse(); // 反转，使图表从最老数据开始

    if (data.length < 2) {
        return (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
                暂无数据
            </div>
        );
    }
    
    return (
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line dataKey="shoulderCm" type="monotone" stroke="var(--color-shoulderCm)" strokeWidth={2} dot={false} />
                <Line dataKey="chestCm" type="monotone" stroke="var(--color-chestCm)" strokeWidth={2} dot={false} />
                <Line dataKey="armCm" type="monotone" stroke="var(--color-armCm)" strokeWidth={2} dot={false} />
                <Line dataKey="waistCm" type="monotone" stroke="var(--color-waistCm)" strokeWidth={2} dot={false} />
                <ChartLegend />
            </LineChart>
        </ChartContainer>
    );
};

export default MetricHistoryChart;
