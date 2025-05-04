
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Step, Task, TaskStatus } from '@/types/project';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import { TaskBuilder } from './TaskBuilder';
import { calculateProgress } from '@/utils/jsonValidator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...step,
      notes: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleStatusChange = (value: TaskStatus) => {
    let newProgress = step.progress;
    
    // Update progress based on status
    if (value === 'completed') {
      newProgress = 100;
    } else if (value === 'in-progress') {
      newProgress = Math.max(10, newProgress); // At least 10% if in progress
    } else if (value === 'not-started') {
      newProgress = 0;
    }
    
    onUpdate({
      ...step,
      status: value,
      progress: newProgress,
      updatedAt: new Date().toISOString()
    });
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(e.target.value);
    
    // Update status based on progress
    let newStatus = step.status;
    if (progress === 100) {
      newStatus = 'completed';
    } else if (progress > 0) {
      newStatus = 'in-progress';
    } else {
      newStatus = 'not-started';
    }
    
    onUpdate({
      ...step,
      progress,
      status: newStatus,
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
            
            {/* User Input Section */}
            <div className="space-y-3 bg-muted/10 p-3 rounded-md border-dashed border">
              <h4 className="text-sm font-medium">Track Progress</h4>
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Status</label>
                <RadioGroup
                  value={step.status}
                  onValueChange={handleStatusChange as (value: string) => void}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="not-started" id={`not-started-${step.id}`} />
                    <Label htmlFor={`not-started-${step.id}`} className="text-xs">Not Started</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="in-progress" id={`in-progress-${step.id}`} />
                    <Label htmlFor={`in-progress-${step.id}`} className="text-xs">In Progress</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="completed" id={`completed-${step.id}`} />
                    <Label htmlFor={`completed-${step.id}`} className="text-xs">Completed</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">Progress ({step.progress}%)</label>
                </div>
                <Input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={step.progress}
                  onChange={handleProgressChange}
                  className="h-2"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Notes (Optional)</label>
                <Textarea
                  value={step.notes || ''}
                  onChange={handleNotesChange}
                  placeholder="Add your notes, challenges, or achievements for this step"
                  rows={2}
                  className="text-xs min-h-[80px]"
                />
              </div>
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
