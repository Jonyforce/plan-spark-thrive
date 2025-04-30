
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavBarProps {
  toggleSidebar: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-card border-b border-border h-16 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center ml-2">
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
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/projects/new">New Project</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/studies/new">New Study Plan</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/import">Import JSON</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};
