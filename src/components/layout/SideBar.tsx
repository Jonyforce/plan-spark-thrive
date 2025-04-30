
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChartBar, CalendarCheck, Tag, Check, Clock } from 'lucide-react';

interface SideBarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
        isActive 
          ? 'bg-brand-100 text-brand-700 font-medium'
          : 'hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface SideBarProps {
  isOpen: boolean;
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarItems = [
    { to: '/', icon: <ChartBar className="h-5 w-5" />, label: 'Dashboard' },
    { to: '/projects', icon: <Check className="h-5 w-5" />, label: 'Projects' },
    { to: '/studies', icon: <CalendarCheck className="h-5 w-5" />, label: 'Studies' },
    { to: '/time-tracking', icon: <Clock className="h-5 w-5" />, label: 'Time Tracking' },
    { to: '/tags', icon: <Tag className="h-5 w-5" />, label: 'Tags' },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="lg:block hidden w-64 border-r border-border bg-sidebar h-[calc(100vh-4rem)] fixed">
      <div className="py-6 px-3 flex flex-col h-full">
        <div className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <SideBarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isActive={
                item.to === '/' 
                  ? currentPath === '/'
                  : currentPath.startsWith(item.to)
              }
            />
          ))}
        </div>
        <div className="pt-6 border-t border-border">
          <div className="px-4 py-2">
            <p className="text-sm text-muted-foreground">PlanSparkThrive v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
