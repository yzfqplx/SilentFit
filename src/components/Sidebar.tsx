import React from 'react';
import type { Page } from '../types/data';
import { DumbbellIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon, SunIcon, MoonIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { id: 'dashboard', icon: DumbbellIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    const baseItemStyle = "flex items-center w-full py-3 px-3 rounded-xl text-sm font-medium transition duration-200 focus:outline-none";
    
    const activeItemStyle = "bg-indigo-600 dark:bg-indigo-700 text-white shadow-lg dark:shadow-indigo-900/50";
    
    const inactiveItemStyle = "text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:bg-gray-700";

    const themeTogglerStyle = "flex items-center justify-center w-full py-3 px-3 rounded-xl text-sm font-medium transition duration-200 focus:outline-none text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:bg-gray-700";

    return (
        <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-2xl flex flex-col border-r dark:border-gray-700 min-w-[250px]">
            <div className="flex items-center p-2 mb-8 mt-2">
                <DumbbellIcon className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mr-2" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">SilentFit</h1>
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`${baseItemStyle} ${currentPage === item.id ? activeItemStyle : inactiveItemStyle}`}
                    >
                        <item.icon className="w-6 h-6 mr-3" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto">
                <button
                    onClick={toggleTheme}
                    className={themeTogglerStyle}
                >
                    {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                    <span className="ml-3">{theme === 'light' ? '深色模式' : '浅色模式'}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;