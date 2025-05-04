
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubTask, TaskStatus } from '@/types/project';
import { Trash } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SubTaskBuilderProps {
  subtask: SubTask;
  onUpdate: (subtask: SubTask) => void;
  onDelete: () => void;
  subtaskNumber: number;
}

export const SubTaskBuilder: React.FC<SubTaskBuilderProps> = ({
  subtask,
  onUpdate,
  onDelete,
  subtaskNumber
}) => {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...subtask,
      name: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...subtask,
      description: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...subtask,
      notes: e.target.value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onUpdate({
      ...subtask,
      estimatedMinutes: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleStatusChange = (value: TaskStatus) => {
    onUpdate({
      ...subtask,
      status: value,
      progress: value === 'completed' ? 100 : (value === 'in-progress' ? 50 : 0),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col gap-2 border border-muted/60 rounded-sm p-2">
      <div className="grid grid-cols-8 gap-1">
        <div className="col-span-6 space-y-0.5">
          <label className="text-xs font-medium">Subtask {subtaskNumber}</label>
          <Input
            value={subtask.name}
            onChange={handleNameChange}
            placeholder="Subtask name"
            className="h-6 text-xs py-0"
          />
        </div>
        <div className="col-span-2 space-y-0.5">
          <label className="text-xs font-medium">Est. min</label>
          <Input
            type="number"
            min={0}
            value={subtask.estimatedMinutes ?? ''}
            onChange={handleEstimatedTimeChange}
            placeholder="Time"
            className="h-6 text-xs py-0"
          />
        </div>
      </div>
      
      <Textarea
        value={subtask.description || ''}
        onChange={handleDescriptionChange}
        placeholder="Description (optional)"
        rows={1}
        className="text-xs min-h-[40px]"
      />
      
      {/* User Input Section */}
      <div className="space-y-2 bg-muted/10 p-1.5 rounded-md border-dashed border">
        <div className="space-y-1">
          <label className="text-xs font-medium">Status</label>
          <RadioGroup
            value={subtask.status}
            onValueChange={handleStatusChange as (value: string) => void}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="not-started" id={`not-started-${subtask.id}`} />
              <Label htmlFor={`not-started-${subtask.id}`} className="text-xs">Not Started</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="in-progress" id={`in-progress-${subtask.id}`} />
              <Label htmlFor={`in-progress-${subtask.id}`} className="text-xs">In Progress</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="completed" id={`completed-${subtask.id}`} />
              <Label htmlFor={`completed-${subtask.id}`} className="text-xs">Completed</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium">Notes (Optional)</label>
          <Textarea
            value={subtask.notes || ''}
            onChange={handleNotesChange}
            placeholder="Add your notes"
            rows={1}
            className="text-xs min-h-[40px]"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDelete} 
          className="text-destructive h-6 w-6 mt-0.5"
        >
          <Trash className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
