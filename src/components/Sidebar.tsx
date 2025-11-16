import React from 'react';
import type { Page } from '../types/data';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon, ClipboardListIcon, NetworkIcon } from './icons/Icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'trainingPlan', icon: ClipboardListIcon, label: '训练计划' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'fitnessTheory', icon: NetworkIcon, label: '健身理论' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    return (
        <Card className="w-64 p-4 flex flex-col min-w-[250px] items-center rounded-none bg-sidebar">
            <div className="flex items-center p-2 mb-8 mt-2">
                <ReactIcon className="w-8 h-8 text-primary mr-2 drop-shadow-lg" />
                <h1 className="text-xl font-bold text-sidebar-foreground">SilentFit</h1>
            </div>
            
            <nav className="flex-1 space-y-2 w-full">
                {navItems.map(item => (
                    <Button
                        key={item.id}
                        variant={'ghost'}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`w-full justify-start sidebar-button ${currentPage === item.id ? 'active' : ''}`}
                    >
                        <item.icon className="w-6 h-6 mr-3" />
                        <span>{item.label}</span>
                    </Button>
                ))}
            </nav>

        </Card>
    );
};

export default Sidebar;

