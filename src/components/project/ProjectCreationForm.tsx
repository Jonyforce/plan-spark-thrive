
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PhaseBuilder } from './PhaseBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjectStore } from '@/stores/projectStore';
import { JsonImport } from '@/components/import/JsonImport';
import { Project, Phase, ProjectOrStudy } from '@/types/project';
import { updateProgressRecursively } from '@/utils/jsonValidator';
import { Plus, File } from 'lucide-react';

export const ProjectCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState<string>('manual');

  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: uuidv4(),
      name: 'Phase 1',
      description: '',
      status: 'not-started',
      progress: 0,
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }

    const newProject: Project = {
      id: uuidv4(),
      name: projectName,
      description: projectDescription,
      status: 'not-started',
      progress: 0,
      type: 'project',
      phases: phases,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Calculate progress based on phases
    const processedProject = updateProgressRecursively(newProject);
    
    addProject(processedProject);
    toast({
      title: "Project Created",
      description: `Successfully created project "${projectName}"`,
    });
    navigate('/projects');
  };

  const handleImportSubmit = (importedData: ProjectOrStudy) => {
    if (importedData.type === 'project') {
      // Type assertion to Project since we've checked the type is 'project'
      const project = importedData as Project;
      addProject(project);
      toast({
        title: "Project Imported",
        description: `Successfully imported project "${importedData.name}"`,
      });
      navigate('/projects');
    } else {
      toast({
        title: "Invalid Import Type",
        description: "The imported data is not a project",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="manual">
            <Plus className="h-4 w-4 mr-2" /> Create Manually
          </TabsTrigger>
          <TabsTrigger value="import">
            <File className="h-4 w-4 mr-2" /> Import JSON
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4">
          <form onSubmit={handleManualSubmit}>
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
                  <Plus className="h-4 w-4 mr-2" />
                  Add Phase
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
            
            <div className="mt-8 flex justify-end">
              <Button type="submit">Create Project</Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Project</CardTitle>
            </CardHeader>
            <CardContent>
              <JsonImport onImport={handleImportSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
