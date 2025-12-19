import React from 'react';
import type { Page } from '../types/data';
import { ReactIcon, TapeMeasureIcon, SettingsIcon, ClipboardListIcon, NetworkIcon } from './icons/Icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BottomNavBarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },
        { id: 'trainingPlan', icon: ClipboardListIcon, label: '训练计划' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'fitnessTheory', icon: NetworkIcon, label: '健身理论' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-background dark:bg-gray-950 border-t border-gray-200/30 dark:border-gray-800 backdrop-blur-xl flex justify-around items-center shadow-t-lg"
            style={{
                height: 'calc(4rem + max(env(safe-area-inset-bottom), 16px))',
                paddingBottom: 'max(env(safe-area-inset-bottom), 16px)',
            }}
        >
            {navItems.map(item => (
                <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full text-sm font-medium transition-colors duration-200",
                        "hover:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                        currentPage === item.id
                            ? "text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <item.icon className="w-6 h-6 transition-transform duration-200" />
                    <span className='text-xs mt-1'>{item.label}</span>
                </Button>
            ))}
        </nav>
    );
};

export default BottomNavBar;
