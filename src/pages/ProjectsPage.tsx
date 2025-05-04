
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const { projects } = useProjectStore();

  return (
    <AppLayout>
      <ProjectHeader />
      
      {projects.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">Create your first project to get started</p>
          <Link to="/projects/new" className="text-brand-500 hover:underline">
            Create a project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default ProjectsPage;
