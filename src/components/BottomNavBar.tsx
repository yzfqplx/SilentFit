
import React from 'react';
import type { Page } from '../types/data';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon, ClipboardListIcon } from './icons/Icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomNavBarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'trainingPlan', icon: ClipboardListIcon, label: '训练计划' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-950 border-t border-gray-200/30 dark:border-gray-800 backdrop-blur-xl flex justify-around items-center shadow-t-lg"
            style={{
                height: 'calc(4rem + env(safe-area-inset-bottom))',
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            {navItems.map(item => (
                <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-sm font-medium",
                        currentPage === item.id ? "text-blue-400" : "text-gray-400"
                    )}
                >
                    <item.icon className="w-6 h-6" />
                    <span className='text-xs mt-1'>{item.label}</span>
                </Button>
            ))}
        </nav>
    );
};

export default BottomNavBar;
