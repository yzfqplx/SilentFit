
import React from 'react';
import type { Page } from '../types/data';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon } from './icons/Icons';

interface BottomNavBarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    const baseItemStyle = "flex flex-col items-center justify-center w-full h-full text-sm font-medium border-0 focus:outline-none transition-colors duration-200 relative pt-2";
    const activeItemStyle = "text-emerald-500 dark:text-emerald-400";
    const inactiveItemStyle = "text-gray-500 dark:text-gray-400";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200/30 dark:border-gray-700/30 backdrop-blur-xl h-16 flex justify-around items-center shadow-t-lg">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as Page)}
                    className={`${baseItemStyle} ${currentPage === item.id ? activeItemStyle : inactiveItemStyle}`}
                >
                    <item.icon className="w-6 h-6" />
                    <span className='text-xs mt-1'>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNavBar;
