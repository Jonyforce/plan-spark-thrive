
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubTask } from '@/types/project';
import { Trash } from 'lucide-react';

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

  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined;
    onUpdate({
      ...subtask,
      estimatedMinutes: value,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="flex gap-2 items-start border border-muted/60 rounded-sm p-1.5">
      <div className="flex-1 space-y-1">
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
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onDelete} 
        className="text-destructive h-6 w-6 mt-4"
      >
        <Trash className="h-3 w-3" />
      </Button>
    </div>
  );
};
