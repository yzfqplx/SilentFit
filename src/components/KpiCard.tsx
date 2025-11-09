import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- 组件: KPI 概览卡片 ---
interface KpiCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  unit: string;
  color: string;
  description?: string; // Optional description prop
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, title, value, unit, color, description }) => {
  const colorClasses: { [key: string]: string } = {
    emerald: 'text-emerald-500 dark:text-emerald-400',
    blue: 'text-blue-500 dark:text-blue-400',
    indigo: 'text-indigo-500 dark:text-indigo-400',
    purple: 'text-purple-500 dark:text-purple-400',
    green: 'text-green-500 dark:text-green-400',
    red: 'text-red-500 dark:text-red-400',
  };

  const iconColorClass = colorClasses[color] || 'text-gray-500 dark:text-gray-400';

  return (
    <Card className="cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <div className={`${iconColorClass} mb-2`}>{icon}</div>
        <CardTitle className="text-xs md:text-sm font-semibold text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-1 flex items-end">
          <div className="text-2xl md:text-3xl font-bold text-foreground">
            {value}
          </div>
          <div className="ml-1 text-sm md:text-base text-muted-foreground">{unit}</div>
        </div>
        {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
