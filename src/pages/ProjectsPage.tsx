
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectHeader } from '@/components/project/ProjectHeader';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Clock, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ProgressBar } from '@/components/project/ProgressBar';

const ProjectsPage = () => {
  const { projects } = useProjectStore();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Function to start tracking time for a project
  const startTracking = (projectId: string, itemId: string, itemName: string) => {
    // Store selected project and item in localStorage to be picked up by time tracking page
    localStorage.setItem('selected-tracking-project', projectId);
    localStorage.setItem('selected-tracking-item', itemId);
    localStorage.setItem('selected-tracking-item-name', itemName);
    
    // Navigate to time tracking page (using window.location since we're not in a router component)
    window.location.href = '/time-tracking';
  };

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
            <Card key={project.id} className="flex flex-col overflow-hidden border border-border hover:border-primary/20 transition-colors">
              <CardContent className="flex-1 p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium line-clamp-1 flex-1">{project.name}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                )}
                
                <div className="space-y-4 mt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(project.progress)}%</span>
                    </div>
                    <ProgressBar value={project.progress} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Created</span>
                      <p>{formatDate(project.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated</span>
                      <p>{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="text-xs">
                    <span className="text-muted-foreground">Structure</span>
                    <p>{project.phases.length} phases, {project.phases.reduce((acc, phase) => 
                      acc + phase.steps.length, 0)} steps</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between border-t">
                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  
                  {project.phases.length > 0 && project.phases[0].steps.length > 0 && 
                   project.phases[0].steps[0].tasks.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startTracking(
                        project.id, 
                        project.phases[0].steps[0].tasks[0].id,
                        `${project.phases[0].name} > ${project.phases[0].steps[0].name} > ${project.phases[0].steps[0].tasks[0].name}`
                      )}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                  )}
                </div>
                
                <Button asChild variant="outline" size="sm">
                  <Link to={`/projects/${project.id}/view`}>
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <div className="fixed bottom-6 right-6">
        <Button asChild size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <Link to="/projects/new">
            <PlusCircle className="h-6 w-6" />
            <span className="sr-only">Create new project</span>
          </Link>
        </Button>
      </div>
    </AppLayout>
  );
};

export default ProjectsPage;
