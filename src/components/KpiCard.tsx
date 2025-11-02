import React from 'react';
import { useMouseGlow } from '../hooks/useMouseGlow';

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
  const glowRef = useMouseGlow<HTMLDivElement>();

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
    <div 
      ref={glowRef}
      className={`card-glow p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-dark-card-bg`}>
      <div className={`${iconColorClass} mb-2`}>{icon}</div>
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-1 flex items-end">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="ml-1 text-base text-gray-500 dark:text-gray-400">{unit}</div>
      </div>
      {description && <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{description}</p>}
    </div>
  );
};

export default KpiCard;
