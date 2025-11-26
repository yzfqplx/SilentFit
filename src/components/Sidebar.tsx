import React, { useRef, useEffect } from 'react';
import type { Page } from '../types/data';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon, ClipboardListIcon, NetworkIcon } from './icons/Icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, onClose }) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },

        { id: 'trainingPlan', icon: ClipboardListIcon, label: '训练计划' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'fitnessTheory', icon: NetworkIcon, label: '健身理论' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    return (
        <div
            ref={sidebarRef}
            className={cn(
                "fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out",
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
            )}
        >
            <Card className="w-64 p-4 flex flex-col min-w-[250px] items-center rounded-none bg-sidebar h-full">
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
                            className={cn(
                                "w-full justify-start sidebar-button",
                                currentPage === item.id ? 'active' : ''
                            )}
                        >
                            <item.icon className="w-6 h-6 mr-3" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </nav>
            </Card>
        </div>
    );
};

export default Sidebar;

