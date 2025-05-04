
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const ProjectHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage and track your project progress</p>
      </div>
      <div className="flex space-x-2">
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/import">Import</Link>
        </Button>
      </div>
    </div>
  );
};
