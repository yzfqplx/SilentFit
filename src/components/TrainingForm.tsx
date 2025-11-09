import React from 'react';
import type { TrainingRecord } from '../types/data';
import { STRENGTH_ACTIVITIES } from '../constants/activities';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from "date-fns"; // Added import
import { Calendar as CalendarIcon } from "lucide-react"; // Added import
import { cn } from "@/lib/utils"; // Added import
import { Calendar } from "@/components/ui/calendar"; // Added import
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added import

interface TrainingFormProps {
    formData: Partial<TrainingRecord>;
    editingId: string | null;
    handleRecordChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleRecordSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancelEdit: () => void;
    recommendation: Partial<TrainingRecord> | null;
}

// --- 训练记录表单卡片 ---
const TrainingForm: React.FC<TrainingFormProps> = ({
    formData,
    editingId,
    handleRecordChange,
    handleRecordSubmit,
    handleCancelEdit,
    recommendation,
}) => {
    const selectedDate = formData.date ? new Date(formData.date) : undefined;

    const handleDateSelect = (date: Date | undefined) => {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
        // Create a synthetic event to pass to handleRecordChange
        const syntheticEvent = {
            target: {
                name: "date",
                value: formattedDate,
            },
        } as React.ChangeEvent<HTMLInputElement>;
        handleRecordChange(syntheticEvent);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                    {editingId ? '编辑训练记录' : '添加力量训练记录'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRecordSubmit} className="space-y-4">
                    
                    {/* Row 1: Activity and Date */}
                    <div className="grid grid-cols-2 gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="activity">训练项目</Label>
                        <Select onValueChange={(value) => handleRecordChange({ target: { name: 'activity', value } } as any)} value={formData.activity || ''}>
                            <SelectTrigger>
                                <SelectValue placeholder="选择训练项目" />
                            </SelectTrigger>
                            <SelectContent>
                                {STRENGTH_ACTIVITIES.map(activity => (
                                    <SelectItem key={activity} value={activity}>{activity}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="date">Date</Label> {/* Changed label to English */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal min-w-0", // Added min-w-0
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
                </div>

                {/* Row 2: Weight, Sets, Reps */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="weightKg">重量 (KG)</Label>
                        <Input
                            type="number"
                            id="weightKg"
                            name="weightKg"
                            value={formData.weightKg === 0 ? '' : formData.weightKg || ''}
                            placeholder={recommendation?.weightKg?.toString() ?? ''}
                            onChange={handleRecordChange}
                            required
                            min="0"
                            step="0.5"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="sets">组数</Label>
                        <Input
                            type="number"
                            id="sets"
                            name="sets"
                            value={formData.sets === 0 ? '' : formData.sets === undefined || formData.sets === null ? '' : formData.sets}
                            placeholder={recommendation?.sets?.toString() ?? ''}
                            onChange={handleRecordChange}
                            required
                            min="1"
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="reps">次数</Label>
                        <Input
                            type="number"
                            id="reps"
                            name="reps"
                            value={formData.reps === 0 ? '' : formData.reps === undefined || formData.reps === null ? '' : formData.reps}
                            placeholder={recommendation?.reps?.toString() ?? ''}
                            onChange={handleRecordChange}
                            required
                            min="1"
                        />
                    </div>
                </div>
                
                {/* Notes */}
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="notes">备注</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        rows={2}
                        value={formData.notes || ''}
                        onChange={handleRecordChange as any}
                    />
                </div>


                {/* Submit Button */}
                <Button type="submit" className="w-full">
                    {editingId ? '保存更改' : '添加训练记录'}
                </Button>
            </form>
            {editingId && (
                <Button variant="link" onClick={handleCancelEdit} className="mt-2 w-full">
                    取消编辑
                </Button>
            )}
            </CardContent>
        </Card>
    );
}

export default TrainingForm;
