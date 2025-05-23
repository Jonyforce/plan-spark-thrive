
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectOrStudy } from '@/types/project';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectOrStudy;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  // Check if project has GitHub info
  const hasGithub = 'github' in project && project.github;

  return (
    <Card className={cn("card-hover", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="truncate">{project.name}</CardTitle>
          <div className="flex gap-2">
            {hasGithub && (
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                GitHub
              </Badge>
            )}
            <Badge variant={project.type === 'project' ? 'default' : 'secondary'}>
              {project.type === 'project' ? 'Project' : 'Study'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        )}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} />
        </div>
        
        {/* Show GitHub info if available */}
        {hasGithub && 'github' in project && project.github && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>GitHub: {project.github.owner}/{project.github.repo}</span>
            {project.github.lastSynced && (
              <span>Synced {formatDistanceToNow(new Date(project.github.lastSynced))} ago</span>
            )}
          </div>
        )}
        
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-1 text-xs">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Updated {formatDistanceToNow(new Date(project.updatedAt))} ago
      </CardFooter>
    </Card>
  );
};
