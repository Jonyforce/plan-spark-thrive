
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectStore } from '@/stores/projectStore';
import { Project } from '@/types/project';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { syncProject } from '@/utils/dbSync';

interface ProjectFormInput {
  name: string;
  description?: string;
}

export const ProjectCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProject, getAllItems } = useProjectStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormInput>();
  
  const onSubmit = async (data: ProjectFormInput) => {
    setIsSubmitting(true);
    
    try {
      // Check for duplicate project name
      const allItems = getAllItems();
      const isDuplicate = allItems.some(item => 
        item.name.toLowerCase() === data.name.toLowerCase()
      );
      
      if (isDuplicate) {
        toast({
          title: "Error",
          description: "A project or study with this name already exists",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create Project
      const timestamp = new Date().toISOString();
      
      const newProject: Project = {
        id: uuidv4(),
        name: data.name,
        description: data.description || '',
        type: 'project',
        status: 'not-started',
        progress: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        phases: [
          {
            id: uuidv4(),
            name: 'Phase 1',
            status: 'not-started',
            progress: 0,
            createdAt: timestamp,
            updatedAt: timestamp,
            steps: [
              {
                id: uuidv4(),
                name: 'Step 1',
                status: 'not-started',
                progress: 0,
                createdAt: timestamp,
                updatedAt: timestamp,
                tasks: [
                  {
                    id: uuidv4(),
                    name: 'Task 1',
                    status: 'not-started',
                    progress: 0,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    subtasks: []
                  }
                ]
              }
            ]
          }
        ]
      };
      
      // Add to local store
      addProject(newProject);
      
      toast({
        title: "Project Created",
        description: `Successfully created project "${data.name}"`,
      });
      
      // Attempt to sync with database
      setIsSyncing(true);
      await syncProject(newProject);
      setIsSyncing(false);
      
      setIsSubmitting(false);
      navigate(`/projects/${newProject.id}/view`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Something went wrong while creating the project",
        variant: "destructive"
      });
      setIsSubmitting(false);
      setIsSyncing(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Project</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input 
              id="name"
              placeholder="Enter project name"
              {...register('name', { 
                required: "Project name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters"
                },
                maxLength: {
                  value: 50,
                  message: "Name cannot exceed 50 characters"
                }
              })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description"
              placeholder="Enter project description"
              {...register('description')}
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isSyncing}>
            {isSubmitting ? 'Creating...' : isSyncing ? 'Syncing...' : 'Create Project'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
