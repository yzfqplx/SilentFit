import React from 'react';
import type { MetricRecord } from '../types/data';
import { TapeMeasureIcon, Edit2Icon, Trash2Icon } from './icons/Icons';
import Tooltip from './Tooltip';
import { Card } from '@/components/ui/card';
import { Button } from './ui/button';

interface MetricRecordCardProps {
    metric: MetricRecord;
    handleEdit: (metric: MetricRecord) => void;
    handleDelete: (id: string) => void;
}

// --- 子组件: 围度记录卡片 ---
const MetricRecordCard: React.FC<MetricRecordCardProps> = ({ metric, handleEdit, handleDelete }) => {
    
    const measurements = [
        { label: '肩', value: metric.shoulderCm },
        { label: '胸', value: metric.chestCm },
        { label: '臂', value: metric.armCm },
        { label: '腰', value: metric.waistCm },
    ];
    
    return (
        <Card>
            <div className="flex justify-between items-center p-4">
                {/* Left Info: Date and Measurements */}
                <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full bg-primary text-primary-foreground`}>
                        <TapeMeasureIcon size={16} />
                    </div>
                    <div>
                        <div className="font-semibold text-foreground mb-1">
                            围度记录: {metric.date}
                        </div>
                        <div className="text-sm text-muted-foreground flex space-x-3">
                            {measurements.map((m, index) => (
                                <span key={index}>
                                    {m.label}: <span className='text-primary font-bold'>{m.value.toFixed(1)}</span> CM
                                </span>
                            ))}
                            <span>
                                体重: <span className='text-emerald-600 dark:text-emerald-400 font-bold'>{(metric.weightKg ?? 0).toFixed(1)}</span> KG
                            </span>
                        </div>
                        {metric.notes && (
                            <Tooltip content={metric.notes}>
                                <p className="text-xs text-muted-foreground mt-1 italic max-w-md truncate">备注: {metric.notes}</p>
                            </Tooltip>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(metric)} title="编辑">
                        <Edit2Icon size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(metric._id)} title="删除">
                        <Trash2Icon size={18} />
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default MetricRecordCard;
