
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCreationForm } from '@/components/project/ProjectCreationForm';

const CreateProjectPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">Design your project with phases, steps, and tasks to track progress effectively.</p>
        </div>
        
        <ProjectCreationForm />
      </div>
    </AppLayout>
  );
};

export default CreateProjectPage;
