import React from 'react';
import type { TrainingRecord } from '../types/data';
import { CheckCircle2, ReactIcon, Edit2Icon, Trash2Icon } from './icons/Icons';
import Tooltip from './Tooltip';
import { calculate1RM } from '../utils/calculations';
import { Card } from '@/components/ui/card';
import { Button } from './ui/button';

interface TrainingRecordCardProps {
    record: TrainingRecord;
    handleEdit: (record: TrainingRecord) => void;
    handleDelete: (id: string) => void;
    handleMarkAsComplete: (id: string) => void;
}

// --- 子组件: 训练记录卡片 ---
const TrainingRecordCard: React.FC<TrainingRecordCardProps> = ({ record, handleEdit, handleDelete, handleMarkAsComplete }) => {
    const estimated1RM = calculate1RM(record.weightKg, record.reps);

    return (
        <Card>
            <div className="flex justify-between items-center p-4">
                {/* Left Info: Activity, Date, Volume */}
                <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full bg-secondary text-primary`}>
                        <ReactIcon size={16} />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground flex items-center">
                            {record.activity}
                            <span className="ml-3 text-xs text-muted-foreground font-normal">{record.date}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <span className='text-primary font-bold mr-1'>{record.weightKg} KG</span> 
                            x {record.reps} 次 x {record.sets} 组
                            <span className="ml-4 text-xs text-muted-foreground font-normal">Est. 1RM: {estimated1RM.toFixed(1)} kg</span>
                        </div>
                        {record.notes && (
                            <Tooltip content={record.notes}>
                                <p className="text-xs text-muted-foreground mt-1 italic max-w-md truncate">备注: {record.notes}</p>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex space-x-2">
                    {record.completed ? (
                        <div className="flex items-center space-x-1 text-primary">
                            <CheckCircle2 size={18} />
                            <span>已完成</span>
                        </div>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsComplete(record._id)} title="标记为完成">
                            <CheckCircle2 size={18} />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(record)} title="编辑">
                        <Edit2Icon size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(record._id)} title="删除">
                        <Trash2Icon size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default TrainingRecordCard;
