import React from 'react';

// --- 内联 SVG 图标组件 ---
export const IconWrapper: React.FC<{ size?: number; className?: string; children: React.ReactNode }> = ({ size = 24, className = '', children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

export const DumbbellIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M14.4 14.4 9.6 9.6" /><path d="m18 10-4-4" /><path d="m6 18 4-4" /><path d="M19 19a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" /><path d="M5 5a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" /></IconWrapper>
);
export const TapeMeasureIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M21 16H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" /><path d="M4 12h16" /><path d="M7 10v4" /><path d="M11 10v4" /><path d="M15 10v4" /><path d="M19 10v4" /></IconWrapper>
);
export const ListChecksIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="m3 16 2 2 4-4" /><path d="m3 12 2 2 4-4" /><path d="m3 8 2 2 4-4" /><path d="M14 4h7" /><path d="M14 8h7" /><path d="M14 12h7" /><path d="M14 16h7" /></IconWrapper>
);
export const SettingsIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.22c-.63.26-1.22.58-1.74.95l-.26.12a2 2 0 0 0-1 1.74l-.22.44a2 2 0 0 0-.95 1.74l-.12.26a2 2 0 0 0-1.74 1l-.44.22a2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2l.44.22c.26.63.58 1.22.95 1.74l.12.26a2 2 0 0 0 1.74 1l.22.44a2 2 0 0 0 2 2v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0 1.74-1l.22-.44c.63-.26 1.22-.58 1.74-.95l.26-.12a2 2 0 0 0 1.74-1l.22-.44a2 2 0 0 0 .95-1.74l.12-.26a2 2 0 0 0 1.74-1l.44-.22a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2l-.44-.22c-.26-.63-.58-1.22-.95-1.74l-.12-.26a2 2 0 0 0-1.74-1l-.22-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></IconWrapper>
);
export const Trash2Icon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></IconWrapper>
);
export const Edit2Icon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></IconWrapper>
);
export const CalendarIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></IconWrapper>
);
export const WeightIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}><path d="M12 2a4 4 0 0 1 4 4v5h-4z" /><path d="M8 6a4 4 0 0 0-4 4v5h4z" /><path d="M16 15h4v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-5z" /><path d="M4 15h4v5a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-5z" /></IconWrapper>
);

export const SunIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </IconWrapper>
);

export const MoonIcon = (props: { size?: number; className?: string }) => (
    <IconWrapper {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </IconWrapper>
);