import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import TrainingForm from '../components/TrainingForm';
import type { TrainingRecord } from '../types/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from "date-fns";
import { Calendar as CalendarIcon, MoreHorizontal } from "lucide-react"; // Added MoreHorizontal
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu imports
import ConfirmDialog from '@/components/ConfirmDialog'; // Import ConfirmDialog

const RecordsPage: React.FC = () => {
    const {
        records,
        formData,
        editingId,
        handleRecordChange,
        handleRecordSubmit,
        handleRecordEdit,
        handleRecordDelete,
        handleCancelRecordEdit,
        handleMarkAsComplete,
        recommendation,
        setFormData,
    } = useAppContext();

    const [selectedDate, setSelectedDate] = useState<string>(formData.date || new Date().toISOString().substring(0, 10));

    const handleFilterDateChange = (date: Date | undefined) => {
        const newDate = date ? format(date, "yyyy-MM-dd") : "";
        setSelectedDate(newDate);
        setFormData((prev: Partial<TrainingRecord>) => ({ ...prev, date: newDate }));
    };

    const filteredRecords = useMemo(() => {
        if (!selectedDate) {
            return records;
        }
        return records.filter(record => record.date === selectedDate);
    }, [records, selectedDate]);

    const columns: ColumnDef<TrainingRecord>[] = [
        {
            accessorKey: "date",
            header: "日期",
        },
        {
            accessorKey: "activity",
            header: "活动",
        },
        {
            accessorKey: "reps",
            header: "次数",
        },
        {
            accessorKey: "sets",
            header: "组数",
        },
        {
            accessorKey: "weightKg",
            header: "重量",
        },
        {
            accessorKey: "completed",
            header: "状态",
            cell: ({ row }) => {
                const record = row.original;
                return record.completed ? (
                    <span className="text-green-500">已完成</span>
                ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleMarkAsComplete(record._id)}>标记为完成</Button>
                );
            },
        },
        {
            id: "actions",
            header: "操作",
            cell: ({ row }) => {
                const record = row.original;
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
                            <DropdownMenuItem onClick={() => handleRecordEdit(record)}>
                                编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <ConfirmDialog
                                title="确认删除"
                                description="您确定要删除此训练记录吗？"
                                onConfirm={() => handleRecordDelete(record._id)}
                            >
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    删除
                                </DropdownMenuItem>
                            </ConfirmDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Form */}
            <TrainingForm
                formData={formData}
                editingId={editingId}
                handleRecordChange={handleRecordChange}
                handleRecordSubmit={handleRecordSubmit}
                handleCancelEdit={handleCancelRecordEdit}
                recommendation={recommendation}
            />

            {/* Records List */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>所有训练记录 ({filteredRecords.length})</CardTitle>
                        {/* Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "justify-start text-left font-normal",
                                        !selectedDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(new Date(selectedDate), "yyyy年MM月dd日") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate ? new Date(selectedDate) : undefined}
                                    onSelect={handleFilterDateChange}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={filteredRecords} />
                </CardContent>
            </Card>
        </main>
    );
};

export default RecordsPage;
