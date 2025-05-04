
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Task, SubTask } from '@/types/project';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, Trash } from 'lucide-react';
import { SubTaskBuilder } from './SubTaskBuilder';

interface TaskBuilderProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
  taskNumber: number;
}

export const TaskBuilder: React.FC<TaskBuilderProps> = ({
  task,
  onUpdate,
  onDelete,
  taskNumber
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...task,
      name: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...task,
      description: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onUpdate({
      ...task,
      estimatedMinutes: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddSubtask = () => {
    const newSubtask: SubTask = {
      id: uuidv4(),
      name: `Subtask ${task.subtasks.length + 1}`,
      description: '',
      status: 'not-started',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onUpdate({
      ...task,
      subtasks: [...task.subtasks, newSubtask],
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateSubtask = (updatedSubtask: SubTask) => {
    const updatedSubtasks = task.subtasks.map(subtask => 
      subtask.id === updatedSubtask.id ? updatedSubtask : subtask
    );
    
    // Calculate progress based on completed subtasks
    const completedSubtasks = updatedSubtasks.filter(st => st.status === 'completed').length;
    const totalProgress = updatedSubtasks.length > 0 ? 
      (completedSubtasks / updatedSubtasks.length) * 100 : 0;
    
    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
      progress: totalProgress,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    
    // Recalculate progress
    const completedSubtasks = updatedSubtasks.filter(st => st.status === 'completed').length;
    const totalProgress = updatedSubtasks.length > 0 ? 
      (completedSubtasks / updatedSubtasks.length) * 100 : 0;
    
    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
      progress: totalProgress,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <Card className="border border-muted/70">
      <div className="px-2 py-1 bg-muted/20 border-b flex items-center justify-between">
        <CollapsibleTrigger 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center hover:text-primary cursor-pointer flex-1"
        >
          {isOpen ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
          <span className="text-xs font-medium">Task {taskNumber}: {task.name || 'Untitled'}</span>
        </CollapsibleTrigger>
        
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive h-5 w-5">
          <Trash className="h-3 w-3" />
        </Button>
      </div>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="p-2 space-y-2">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-4">
              <div className="col-span-3 space-y-1">
                <label className="text-xs font-medium">Task Name</label>
                <Input
                  value={task.name}
                  onChange={handleNameChange}
                  placeholder="Enter task name"
                  className="h-7 text-xs"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Est. Time (min)</label>
                <Input
                  type="number"
                  min={0}
                  value={task.estimatedMinutes ?? ''}
                  onChange={handleEstimatedTimeChange}
                  placeholder="Minutes"
                  className="h-7 text-xs"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium">Task Description (Optional)</label>
              <Textarea
                value={task.description || ''}
                onChange={handleDescriptionChange}
                placeholder="Enter task description"
                rows={1}
                className="text-xs min-h-[50px]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-medium">Subtasks</h4>
                <Button variant="outline" size="sm" className="h-6 text-xs py-0" onClick={handleAddSubtask}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Subtask
                </Button>
              </div>
              
              <div className="space-y-1">
                {task.subtasks.map((subtask, index) => (
                  <SubTaskBuilder
                    key={subtask.id}
                    subtask={subtask}
                    onUpdate={handleUpdateSubtask}
                    onDelete={() => handleDeleteSubtask(subtask.id)}
                    subtaskNumber={index + 1}
                  />
                ))}
                
                {task.subtasks.length === 0 && (
                  <div className="text-center py-1 text-muted-foreground text-xs border border-dashed rounded-md">
                    No subtasks yet. Click "Add Subtask" to create one.
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
