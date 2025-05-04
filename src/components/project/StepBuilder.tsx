
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Step, Task } from '@/types/project';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import { TaskBuilder } from './TaskBuilder';
import { calculateProgress } from '@/utils/jsonValidator';

interface StepBuilderProps {
  step: Step;
  onUpdate: (step: Step) => void;
  onDelete: () => void;
  stepNumber: number;
}

export const StepBuilder: React.FC<StepBuilderProps> = ({
  step,
  onUpdate,
  onDelete,
  stepNumber
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...step,
      name: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...step,
      description: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: uuidv4(),
      name: `Task ${step.tasks.length + 1}`,
      description: '',
      status: 'not-started',
      progress: 0,
      subtasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onUpdate({
      ...step,
      tasks: [...step.tasks, newTask],
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = step.tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    const updatedStep = {
      ...step,
      tasks: updatedTasks,
      progress: calculateProgress(updatedTasks),
      updatedAt: new Date().toISOString()
    };
    
    onUpdate(updatedStep);
  };

  const handleDeleteTask = (taskId: string) => {
    onUpdate({
      ...step,
      tasks: step.tasks.filter(task => task.id !== taskId),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <Card className="border border-muted">
      <div className="px-3 py-2 bg-muted/30 border-b flex items-center justify-between">
        <CollapsibleTrigger 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center hover:text-primary cursor-pointer flex-1"
        >
          {isOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          <span className="text-sm font-medium">Step {stepNumber}: {step.name || 'Untitled'}</span>
        </CollapsibleTrigger>
        
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive h-6 w-6">
          <Trash className="h-3 w-3" />
        </Button>
      </div>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="pt-3 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Step Name</label>
              <Input
                value={step.name}
                onChange={handleNameChange}
                placeholder="Enter step name"
                className="h-8 text-sm"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium">Step Description (Optional)</label>
              <Textarea
                value={step.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Enter step description"
                rows={1}
                className="text-sm min-h-[60px]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Tasks</h4>
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleAddTask}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-2">
                {step.tasks.map((task, index) => (
                  <TaskBuilder
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={() => handleDeleteTask(task.id)}
                    taskNumber={index + 1}
                  />
                ))}
                
                {step.tasks.length === 0 && (
                  <div className="text-center py-2 text-muted-foreground text-xs border border-dashed rounded-md">
                    No tasks yet. Click "Add Task" to create one.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
