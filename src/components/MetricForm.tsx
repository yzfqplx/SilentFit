import React from 'react';
import type { MetricRecord } from '../types/data';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from "date-fns"; // Added import
import { Calendar as CalendarIcon } from "lucide-react"; // Added import
import { cn } from "@/lib/utils"; // Added import
import { Calendar } from "@/components/ui/calendar"; // Added import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added import

interface MetricFormProps {
    metricFormData: Partial<MetricRecord>;
    editingMetricId: string | null;
    handleMetricChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMetricSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
}

// --- 身体围度表单卡片 ---
const MetricForm: React.FC<MetricFormProps> = ({
    metricFormData,
    editingMetricId,
    handleMetricChange,
    handleMetricSubmit,
    handleCancelEdit,
}) => {
    const selectedDate = metricFormData.date ? new Date(metricFormData.date) : undefined;

    const handleDateSelect = (date: Date | undefined) => {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
        // Create a synthetic event to pass to handleMetricChange
        const syntheticEvent = {
            target: {
                name: "date",
                value: formattedDate,
            },
        } as React.ChangeEvent<HTMLInputElement>;
        handleMetricChange(syntheticEvent);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                    {editingMetricId ? '编辑围度记录' : '记录身体围度'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleMetricSubmit} className="space-y-4">
                    
                    {/* Row 1: Date / Shoulder / Chest / Arm / Waist / Weight */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="date">Date</Label> {/* Changed label to English */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal min-w-0",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {selectedDate ? <span className="truncate">{format(selectedDate, "yyyy年MM月dd日")}</span> : <span className="truncate">Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="shoulderCm">肩围 (CM)</Label>
                            <Input
                                type="number"
                                id="shoulderCm"
                                name="shoulderCm"
                                value={metricFormData.shoulderCm === 0 ? '' : metricFormData.shoulderCm || ''}
                                onChange={handleMetricChange}
                                min="0" step="0.1" required
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="chestCm">胸围 (CM)</Label>
                            <Input
                                type="number"
                                id="chestCm"
                                name="chestCm"
                                value={metricFormData.chestCm === 0 ? '' : metricFormData.chestCm || ''}
                                onChange={handleMetricChange}
                                min="0" step="0.1" required
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="armCm">臂围 (CM)</Label>
                            <Input
                                type="number"
                                id="armCm"
                                name="armCm"
                                value={metricFormData.armCm === 0 ? '' : metricFormData.armCm || ''}
                                onChange={handleMetricChange}
                                min="0" step="0.1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="waistCm">腰围 (CM)</Label>
                            <Input
                                type="number"
                                id="waistCm"
                                name="waistCm"
                                value={metricFormData.waistCm === 0 ? '' : metricFormData.waistCm || ''}
                                onChange={handleMetricChange}
                                min="0" step="0.1"
                            />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="weightKg">体重 (KG)</Label>
                            <Input
                                type="number"
                                id="weightKg"
                                name="weightKg"
                                value={metricFormData.weightKg === 0 ? '' : metricFormData.weightKg || ''}
                                onChange={handleMetricChange}
                                min="0" step="0.1"
                            />
                        </div>
                    </div>

                    {/* Row 2: Notes */}
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="metricNotes">备注</Label>
                        <Textarea
                            id="metricNotes"
                            name="notes"
                            rows={1}
                            value={metricFormData.notes || ''}
                            onChange={handleMetricChange as any}
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <Button type="submit" className="w-full">
                        {editingMetricId ? '保存围度更改' : '记录围度数据'}
                    </Button>
                </form>
                {editingMetricId && (
                    <Button variant="link" onClick={handleCancelEdit} className="mt-2 w-full">
                        取消编辑
                    </Button>
                )}
                </CardContent>
            </Card>
        );
};

export default MetricForm;
