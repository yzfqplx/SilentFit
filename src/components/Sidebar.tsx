import React from 'react';
import type { Page } from '../types/data';
import { ReactIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon, SunIcon, MoonIcon } from './icons/Icons';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { id: 'dashboard', icon: ReactIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];

    const baseItemStyle = "flex items-center w-full py-3 px-3 rounded-xl text-sm font-medium focus:outline-none relative overflow-hidden border-0 transition-colors duration-300";
    
    const activeItemStyle = "text-white shadow-lg dark:shadow-indigo-900/50 dark:bg-gray-700";
    
    const inactiveItemStyle = "text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:bg-gray-700";

    const themeTogglerStyle = "flex items-center justify-center w-full py-3 px-3 rounded-xl text-sm font-medium focus:outline-none text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:bg-gray-700";

    return (
        <aside className="w-64 bg-white/50 dark:bg-gray-800/50 p-4 shadow-2xl flex flex-col border-r dark:border-gray-700 min-w-[250px] backdrop-blur-lg items-center">
            <div className="flex items-center p-2 mb-8 mt-2">
                <ReactIcon className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mr-2 drop-shadow-lg" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">SilentFit</h1>
            </div>
            
            <nav className="flex-1 space-y-2 w-full">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`sidebar-button ${baseItemStyle} ${currentPage === item.id ? activeItemStyle + ' active' : inactiveItemStyle}`}
                    >
                        <item.icon className="w-6 h-6 mr-3" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto w-full">
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