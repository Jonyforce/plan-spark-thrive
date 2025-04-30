
import React, { useState } from 'react';
import { NavBar } from './NavBar';
import { SideBar } from './SideBar';
import { Toaster } from '@/components/ui/toaster';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar toggleSidebar={toggleSidebar} />
      <div className="flex">
        <SideBar isOpen={sidebarOpen} />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};
