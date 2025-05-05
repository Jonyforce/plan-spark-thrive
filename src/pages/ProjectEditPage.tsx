
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Project, Phase } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PhaseBuilder } from '@/components/project/PhaseBuilder';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

const ProjectEditPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { getProjectById, updateProject } = useProjectStore();
  
  const [project, setProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [phases, setPhases] = useState<Phase[]>([]);

  useEffect(() => {
    if (id) {
      const existingProject = getProjectById(id);
      if (existingProject) {
        setProject(existingProject);
        setProjectName(existingProject.name);
        setProjectDescription(existingProject.description || '');
        setPhases(existingProject.phases);
      } else {
        navigate('/projects');
      }
    }
  }, [id, getProjectById, navigate]);

  const handleAddPhase = () => {
    setPhases([
      ...phases,
      {
        id: uuidv4(),
        name: `Phase ${phases.length + 1}`,
        description: '',
        status: 'not-started',
        progress: 0,
        steps: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  };

  const handleUpdatePhase = (updatedPhase: Phase) => {
    setPhases(phases.map(phase => 
      phase.id === updatedPhase.id ? updatedPhase : phase
    ));
  };

  const handleDeletePhase = (phaseId: string) => {
    if (phases.length > 1) {
      setPhases(phases.filter(phase => phase.id !== phaseId));
    } else {
      toast({
        title: "Cannot Delete Last Phase",
        description: "A project must have at least one phase.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    if (!project) return;
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    const updatedProject: Project = {
      ...project,
      name: projectName,
      description: projectDescription,
      phases: phases,
      updatedAt: new Date().toISOString()
    };

    updateProject(id!, updatedProject);
    toast({
      title: "Project Updated",
      description: `Successfully updated project "${projectName}"`,
    });
    navigate(`/projects/${id}/view`);
  };

  if (!project) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/projects/${id}/view`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                  placeholder="Enter project name" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-description">Description (Optional)</Label>
                <Textarea 
                  id="project-description" 
                  value={projectDescription} 
                  onChange={(e) => setProjectDescription(e.target.value)} 
                  placeholder="Enter project description" 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Project Phases</h2>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddPhase}
              >
                + Add Phase
              </Button>
            </div>
            
            {phases.map((phase, index) => (
              <PhaseBuilder
                key={phase.id}
                phase={phase}
                onUpdate={handleUpdatePhase}
                onDelete={() => handleDeletePhase(phase.id)}
                isDeleteAllowed={phases.length > 1}
                phaseNumber={index + 1}
              />
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(`/projects/${id}/view`)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectEditPage;
