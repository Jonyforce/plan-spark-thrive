
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  GraduationCap,
  Clock,
  GitBranch,
  Settings,
  UploadCloud,
  CalendarDays
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMobile } from "@/hooks/use-mobile";

interface SideBarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SideBarLink: React.FC<SideBarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground',
        active
          ? 'bg-accent text-foreground'
          : 'text-muted-foreground'
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
  const isMobile = useMobile();

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen && !isMobile) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-y-0 z-50 flex flex-col border-r bg-background transition-all duration-300',
        isOpen
          ? 'left-0 w-64'
          : '-left-64 w-64'
      )}
    >
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <div className="bg-brand-500 text-white p-1 rounded-md mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 text-transparent bg-clip-text">PlanSparkThrive</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          <h2 className="px-4 text-sm font-medium text-muted-foreground">Navigation</h2>
          <SideBarLink to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active={isActive('/')} />
          <SideBarLink to="/projects" icon={<FolderKanban className="h-5 w-5" />} label="Projects" active={isActive('/projects')} />
          <SideBarLink to="/studies" icon={<GraduationCap className="h-5 w-5" />} label="Studies" active={isActive('/studies')} />
          <SideBarLink to="/time-tracking" icon={<Clock className="h-5 w-5" />} label="Time Tracking" active={isActive('/time-tracking')} />
          <SideBarLink to="/routine-planner" icon={<CalendarDays className="h-5 w-5" />} label="Routine Planner" active={isActive('/routine-planner')} />
        </div>
        
        <div className="py-2">
          <div className="h-px bg-border mx-4 my-2" />
        </div>
        
        <div className="space-y-1 p-2">
          <h2 className="px-4 text-sm font-medium text-muted-foreground">Tools</h2>
          <SideBarLink to="/import" icon={<UploadCloud className="h-5 w-5" />} label="Import" active={isActive('/import')} />
          <SideBarLink to="/gate-study" icon={<GitBranch className="h-5 w-5" />} label="GATE Study" active={isActive('/gate-study')} />
        </div>
        
        <div className="py-2">
          <div className="h-px bg-border mx-4 my-2" />
        </div>
        
        <div className="space-y-1 p-2">
          <h2 className="px-4 text-sm font-medium text-muted-foreground">Settings</h2>
          <SideBarLink to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" active={isActive('/settings')} />
        </div>
      </ScrollArea>
    </div>
  );
};
