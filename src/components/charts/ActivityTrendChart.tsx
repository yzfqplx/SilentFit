import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';


interface ActivityTrendData {
    date: string;
    weightKg: number;
    reps: number;
}

interface ActivityTrendChartProps {
    selectedActivity: string;
    setSelectedActivity: React.Dispatch<React.SetStateAction<string>>;
    trendRange: '7' | '30' | '90' | 'all';
    setTrendRange: React.Dispatch<React.SetStateAction<'7' | '30' | '90' | 'all'>>;
    activityTrendData: ActivityTrendData[];
    availableActivities: string[];
}

const chartConfig = {
    weightKg: {
        label: "重量 (KG)",
        color: "hsl(var(--chart-1))",
    },
    reps: {
        label: "次数",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

// --- 训练项目趋势图表 ---
const ActivityTrendChart: React.FC<ActivityTrendChartProps> = ({
    selectedActivity,
    setSelectedActivity,
    trendRange,
    setTrendRange,
    activityTrendData,
    availableActivities,
}) => {

    const formatDateTick = (tick: string) => {
        const date = new Date(tick);
        return `${date.getMonth() + 1}-${date.getDate()}`;
    };

    const getTrendRangeText = (range: '7' | '30' | '90' | 'all') => {
        switch (range) {
            case '7':
                return '近7天';
            case '30':
                return '近30天';
            case '90':
                return '近90天';
            case 'all':
                return '全部';
            default:
                return '';
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">训练项目趋势</h2>
                    <p className="text-sm text-muted-foreground">{selectedActivity} - {getTrendRangeText(trendRange)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select onValueChange={(value: string) => setSelectedActivity(value)} value={selectedActivity}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="选择项目" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableActivities.map(act => (
                                <SelectItem key={act} value={act}>{act}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value: '7' | '30' | '90' | 'all') => setTrendRange(value)} value={trendRange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="选择范围" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">近7天</SelectItem>
                            <SelectItem value="30">近30天</SelectItem>
                            <SelectItem value="90">近90天</SelectItem>
                            <SelectItem value="all">全部</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {activityTrendData.length < 2 ? (
                <div className="text-center p-8 text-muted-foreground">该项目至少需要两条记录以显示趋势。</div>
            ) : (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <AreaChart accessibilityLayer data={activityTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={formatDateTick}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            dataKey="weightKg"
                            type="monotone"
                            fill="var(--color-weightKg)"
                            fillOpacity={0.4}
                            stroke="var(--color-weightKg)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Area
                            dataKey="reps"
                            type="monotone"
                            fill="var(--color-reps)"
                            fillOpacity={0.4}
                            stroke="var(--color-reps)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <ChartLegend />
                    </AreaChart>
                </ChartContainer>
            )}
        </>
    );
}

export default ActivityTrendChart;
