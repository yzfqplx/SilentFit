import React from 'react';
import type { Page } from '../types/data';
import { DumbbellIcon, ListChecksIcon, TapeMeasureIcon, SettingsIcon } from './icons/Icons';

interface SidebarProps {
    currentPage: Page;
    setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

// --- 子组件: 侧边栏 ---
const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
    
    const navItems = [
        { id: 'dashboard', icon: DumbbellIcon, label: '仪表板' },
        { id: 'records', icon: ListChecksIcon, label: '训练记录' },
        { id: 'metrics', icon: TapeMeasureIcon, label: '身体围度' },
        { id: 'settings', icon: SettingsIcon, label: '设置' },
    ];
    
    return (
        <aside className="w-64 bg-gray-800 p-4 shadow-2xl flex flex-col border-r border-gray-700">
            <div className="flex items-center p-2 mb-8 mt-2">
                <DumbbellIcon className="w-8 h-8 text-emerald-400 mr-2" />
                <h1 className="text-xl font-bold text-white">SilentFit</h1>
            </div>
            
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={`
                            flex items-center w-full py-3 px-3 rounded-xl 
                            text-sm font-medium transition duration-200 bg-gray-700 focus:outline-none
                            ${currentPage === item.id 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 bg-indigo-700' 
                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }
                        `}
                    >
                        <item.icon className="w-6 h-6 mr-3" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
