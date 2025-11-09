import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import MetricForm from '../components/MetricForm';
import MetricHistoryChart from '../components/charts/MetricHistoryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MetricRecord } from "@/types/data";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MetricsPage: React.FC = () => {
    const {
        metrics,
        metricFormData,
        editingMetricId,
        handleMetricChange,
        handleMetricSubmit,
        handleMetricEdit,
        handleMetricDelete,
        handleCancelMetricEdit,
        showConfirm,
    } = useAppContext();

    const columns: ColumnDef<MetricRecord>[] = [
        {
            accessorKey: "date",
            header: "日期",
        },
        {
            accessorKey: "shoulderCm",
            header: "肩围 (cm)",
        },
        {
            accessorKey: "chestCm",
            header: "胸围 (cm)",
        },
        {
            accessorKey: "armCm",
            header: "臂围 (cm)",
        },
        {
            accessorKey: "waistCm",
            header: "腰围 (cm)",
        },
        {
            accessorKey: "weightKg",
            header: "体重 (kg)",
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const metric = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleMetricEdit(metric)}>
                                编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                showConfirm(
                                    '确认删除此围度记录吗?',
                                    () => handleMetricDelete(metric._id)
                                );
                            }}>
                                删除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
                <MetricForm
                    metricFormData={metricFormData}
                    editingMetricId={editingMetricId}
                    handleMetricChange={handleMetricChange}
                    handleMetricSubmit={handleMetricSubmit}
                    handleCancelEdit={handleCancelMetricEdit}
                />
            </div>

            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>围度历史图表</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MetricHistoryChart metrics={metrics} />
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>围度历史记录 ({metrics.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={metrics} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default MetricsPage;
