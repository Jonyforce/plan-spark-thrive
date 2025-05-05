
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectStore } from '@/stores/projectStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Clock, Check } from 'lucide-react';
import { Project, Task } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressBar } from '@/components/project/ProgressBar';
import { formatDistance } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { TaskItem } from '@/components/project/TaskItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';

const ProjectViewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const { getProjectById, updateProject } = useProjectStore();
  const [project, setProject] = useState<Project | null>(null);
  const [pendingTasks, setPendingTasks] = useState<{
    id: string;
    name: string;
    phaseId: string;
    phaseName: string;
    stepId: string; 
    stepName: string;
    taskId: string;
  }[]>([]);

  useEffect(() => {
    if (id) {
      const existingProject = getProjectById(id);
      if (existingProject) {
        setProject(existingProject);
        
        // Extract pending tasks
        const tasks: {
          id: string;
          name: string;
          phaseId: string;
          phaseName: string;
          stepId: string; 
          stepName: string;
          taskId: string;
        }[] = [];
        
        existingProject.phases.forEach(phase => {
          phase.steps.forEach(step => {
            step.tasks.forEach(task => {
              if (task.status !== 'completed') {
                tasks.push({
                  id: task.id,
                  name: task.name,
                  phaseId: phase.id,
                  phaseName: phase.name,
                  stepId: step.id,
                  stepName: step.name,
                  taskId: task.id
                });
              }
            });
          });
        });
        
        setPendingTasks(tasks);
      } else {
        navigate('/projects');
      }
    }
  }, [id, getProjectById, navigate]);

  const handleUpdateProject = (updatedProject: Project) => {
    if (id) {
      updateProject(id, updatedProject);
      setProject(updatedProject);
      
      toast({
        title: "Progress updated",
        description: "Your project progress has been saved successfully",
      });
    }
  };

  const handleTaskComplete = (taskId: string, status: 'not-started' | 'in-progress' | 'completed') => {
    if (!project) return;
    
    const updatedProject = { ...project };
    let foundTask = false;
    
    // Update the task status
    for (const phase of updatedProject.phases) {
      for (const step of phase.steps) {
        for (let i = 0; i < step.tasks.length; i++) {
          if (step.tasks[i].id === taskId) {
            step.tasks[i].status = status;
            step.tasks[i].progress = status === 'completed' ? 100 : (status === 'in-progress' ? 50 : 0);
            step.tasks[i].updatedAt = new Date().toISOString();
            foundTask = true;
            break;
          }
        }
        if (foundTask) break;
      }
      if (foundTask) break;
    }
    
    if (foundTask) {
      // Recalculate progress for steps, phases, and project
      for (const phase of updatedProject.phases) {
        for (const step of phase.steps) {
          // Calculate step progress based on tasks
          const totalTasks = step.tasks.length;
          if (totalTasks > 0) {
            const completedTasks = step.tasks.filter(task => task.status === 'completed').length;
            const inProgressTasks = step.tasks.filter(task => task.status === 'in-progress').length;
            step.progress = Math.round(((completedTasks * 100) + (inProgressTasks * 50)) / totalTasks);
            step.status = step.progress === 100 ? 'completed' : step.progress > 0 ? 'in-progress' : 'not-started';
          }
        }
        
        // Calculate phase progress based on steps
        const totalSteps = phase.steps.length;
        if (totalSteps > 0) {
          const stepsProgress = phase.steps.reduce((sum, step) => sum + step.progress, 0);
          phase.progress = Math.round(stepsProgress / totalSteps);
          phase.status = phase.progress === 100 ? 'completed' : phase.progress > 0 ? 'in-progress' : 'not-started';
        }
      }
      
      // Calculate project progress based on phases
      const totalPhases = updatedProject.phases.length;
      if (totalPhases > 0) {
        const phasesProgress = updatedProject.phases.reduce((sum, phase) => sum + phase.progress, 0);
        updatedProject.progress = Math.round(phasesProgress / totalPhases);
        updatedProject.status = updatedProject.progress === 100 ? 'completed' : updatedProject.progress > 0 ? 'in-progress' : 'not-started';
      }
      
      updatedProject.updatedAt = new Date().toISOString();
      handleUpdateProject(updatedProject);
      
      // Update pending tasks list
      if (status === 'completed') {
        setPendingTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }
      
      toast({
        title: status === 'completed' ? 'Task Completed' : 'Task Status Updated',
        description: `Task "${pendingTasks.find(t => t.id === taskId)?.name}" has been updated.`
      });
    }
  };

  // Function to start time tracking for a task
  const startTimeTracking = (taskId: string, taskPath: string) => {
    // Store information to be used on time tracking page
    localStorage.setItem('selected-tracking-project', id || '');
    localStorage.setItem('selected-tracking-item', taskId);
    localStorage.setItem('selected-tracking-item-name', taskPath);
    
    navigate('/time-tracking');
  };

  if (!project) {
    return null;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">
                Last updated {getTimeAgo(project.updatedAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/projects/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('/time-tracking')}>
              <Clock className="mr-2 h-4 w-4" />
              Track Time
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {project.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <ProgressBar value={project.progress} size="lg" />
                </div>
                <span className="text-xl font-medium">{Math.round(project.progress)}%</span>
              </div>

              <div className="flex gap-2 items-center">
                <span 
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(project.status)}`}
                >
                  {project.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">
                  {project.phases.length} phases, {project.phases.reduce((acc, phase) => acc + phase.steps.length, 0)} steps
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for Project View */}
          <Tabs defaultValue="structure">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="structure">Project Structure</TabsTrigger>
              <TabsTrigger value="pending">Pending Tasks ({pendingTasks.length})</TabsTrigger>
            </TabsList>
            
            {/* Project Structure Tab */}
            <TabsContent value="structure" className="space-y-4">
              <h2 className="text-xl font-semibold">Project Phases</h2>
              
              {project.phases.map((phase) => (
                <Card key={phase.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(phase.status)}`}>
                        {phase.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {phase.description && <p className="text-sm mb-4">{phase.description}</p>}
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round(phase.progress)}%</span>
                      </div>
                      <ProgressBar value={phase.progress} />
                    </div>
                    
                    {/* Steps */}
                    <div className="space-y-6 mt-6">
                      {phase.steps.map((step) => (
                        <div key={step.id} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{step.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusClass(step.status)}`}>
                              {step.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          {step.description && <p className="text-sm">{step.description}</p>}
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{Math.round(step.progress)}%</span>
                            </div>
                            <ProgressBar value={step.progress} size="sm" />
                          </div>
                          
                          {/* Tasks */}
                          <div className="space-y-2 pl-4 border-l-2 border-muted">
                            {step.tasks.map((task) => (
                              <div key={task.id} className="border border-muted rounded-md p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium">{task.name}</h4>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => startTimeTracking(
                                      task.id, 
                                      `${phase.name} > ${step.name} > ${task.name}`
                                    )}
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    Track
                                  </Button>
                                </div>
                                
                                {task.description && <p className="text-xs text-muted-foreground mb-2">{task.description}</p>}
                                
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`px-2 py-0.5 rounded ${getStatusClass(task.status)}`}>
                                    {task.status.replace('-', ' ')}
                                  </span>
                                  {task.estimatedMinutes && (
                                    <span className="text-muted-foreground">
                                      Est: {Math.floor(task.estimatedMinutes / 60)}h {task.estimatedMinutes % 60}m
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            {/* Pending Tasks Tab */}
            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Pending Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingTasks.length === 0 ? (
                    <div className="py-8 text-center">
                      <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                      <h3 className="text-lg font-medium">All tasks are completed!</h3>
                      <p className="text-muted-foreground">
                        No pending tasks for this project.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-4 border-b pb-4">
                          <Checkbox 
                            id={`task-${task.id}`}
                            checked={false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleTaskComplete(task.id, 'completed');
                              }
                            }}
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={`task-${task.id}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {task.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {task.phaseName} &gt; {task.stepName}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0" 
                            onClick={() => startTimeTracking(
                              task.id,
                              `${task.phaseName} > ${task.stepName} > ${task.name}`
                            )}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectViewPage;

